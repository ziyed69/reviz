"use client";

import { useCallback, useState } from "react";
import type { Quiz } from "@/lib/types";
import { QuizPlayer } from "./QuizPlayer";

export function AppTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [drag, setDrag] = useState(false);

  const reset = useCallback(() => {
    setFile(null);
    setQuiz(null);
    setError(null);
    setLoading(false);
  }, []);

  async function generate(pdf: File) {
    setLoading(true);
    setError(null);
    const form = new FormData();
    form.append("file", pdf);

    try {
      const res = await fetch("/api/generate", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur serveur");
      setQuiz(data.quiz);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  function onFile(f: File) {
    setFile(f);
    setQuiz(null);
    generate(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }

  if (quiz) {
    return <QuizPlayer quiz={quiz} onReset={reset} />;
  }

  return (
    <div>
      <div
        className={`upload-zone ${drag ? "dragover" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById("pdf-input")?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") document.getElementById("pdf-input")?.click();
        }}
      >
        <input
          id="pdf-input"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        {loading ? (
          <>
            <p style={{ fontSize: "1.25rem", fontWeight: 600 }}>On prépare tes questions…</p>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>~15–30 secondes</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: "1.25rem", fontWeight: 600 }}>Dépose ton PDF de cours</p>
            <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
              ou clique pour choisir — max 20 Mo, texte lisible (pas scan flou)
            </p>
            {file && !loading && (
              <p style={{ marginTop: "1rem", color: "var(--accent)" }}>{file.name}</p>
            )}
          </>
        )}
      </div>

      {error && <div className="error-box">{error}</div>}

      <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>
        3 cours gratuits / mois — version beta
      </p>
    </div>
  );
}
