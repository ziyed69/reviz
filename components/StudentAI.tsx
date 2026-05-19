"use client";

import { useCallback, useEffect, useState } from "react";
import type { Quiz } from "@/lib/types";
import { QuizPlayer } from "./QuizPlayer";
import { QuotaBanner, type QuotaInfo } from "./QuotaBanner";

type Tab = "summary" | "chat" | "plan" | "exam";
type ChatMsg = { role: "user" | "assistant"; text: string };

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "summary", label: "Résumé", emoji: "📄" },
  { id: "chat", label: "Chat PDF", emoji: "💬" },
  { id: "plan", label: "Plan", emoji: "📅" },
  { id: "exam", label: "Examens", emoji: "✅" },
];

export function StudentAI() {
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("summary");
  const [summary, setSummary] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [featureLoading, setFeatureLoading] = useState(false);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);

  const applyQuota = (data: { quota?: QuotaInfo }) => {
    if (data.quota) setQuota(data.quota);
  };

  useEffect(() => {
    fetch("/api/quota")
      .then((r) => r.json())
      .then((d) => applyQuota(d))
      .catch(() => {});
  }, []);

  const reset = useCallback(() => {
    setTitle(null);
    setText(null);
    setSummary(null);
    setPlan(null);
    setChat([]);
    setQuiz(null);
    setError(null);
    setTab("summary");
  }, []);

  async function uploadPdf(file: File) {
    setLoading(true);
    setError(null);
    setSummary(null);
    setPlan(null);
    setChat([]);
    setQuiz(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/pdf/extract", { method: "POST", body: form });
      const data = await res.json();
      applyQuota(data);
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setTitle(data.title);
      setText(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function runAI(action: Tab) {
    if (!text || !title) return;
    setFeatureLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text, title }),
      });
      const data = await res.json();
      applyQuota(data);
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      if (action === "summary") setSummary(data.content);
      if (action === "plan") setPlan(data.content);
      if (action === "exam") setQuiz(data.quiz);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setFeatureLoading(false);
    }
  }

  async function sendChat() {
    if (!text || !title || !chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChat((c) => [...c, { role: "user", text: userMsg }]);
    setChatLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", text, title, message: userMsg }),
      });
      const data = await res.json();
      applyQuota(data);
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setChat((c) => [...c, { role: "assistant", text: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setChat((c) => c.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  }

  if (quiz) {
    return (
      <QuizPlayer
        quiz={quiz}
        onReset={() => {
          setQuiz(null);
          setTab("exam");
        }}
      />
    );
  }

  return (
    <div className="student-ai">
      <QuotaBanner quota={quota} />
      {!text ? (
        <UploadZone drag={drag} setDrag={setDrag} loading={loading} onFile={uploadPdf} />
      ) : (
        <>
          <div className="course-bar card">
            <div>
              <strong>{title}</strong>
              <span className="muted-inline">
                {text.length.toLocaleString("fr-FR")} caractères
              </span>
            </div>
            <button type="button" className="btn btn-ghost" onClick={reset}>
              Changer de PDF
            </button>
          </div>

          <div className="tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                className={`tab ${tab === t.id ? "tab-active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          <div className="card tab-panel">
            {tab === "summary" && (
              <FeaturePanel
                title="Résumé du cours"
                desc="L'essentiel : idées clés, définitions, pièges."
                loading={featureLoading}
                onRun={() => runAI("summary")}
                content={summary}
                cta="Générer le résumé"
              />
            )}
            {tab === "plan" && (
              <FeaturePanel
                title="Plan de révision"
                desc="Planning J-7 → jour J pour ton examen."
                loading={featureLoading}
                onRun={() => runAI("plan")}
                content={plan}
                cta="Créer mon plan"
              />
            )}
            {tab === "exam" && (
              <FeaturePanel
                title="Examen automatique"
                desc="QCM depuis ton PDF + score final."
                loading={featureLoading}
                onRun={() => runAI("exam")}
                content={null}
                cta="Lancer l'examen"
              />
            )}
            {tab === "chat" && (
              <ChatPanel
                chat={chat}
                chatInput={chatInput}
                setChatInput={setChatInput}
                chatLoading={chatLoading}
                sendChat={sendChat}
              />
            )}
          </div>
        </>
      )}
      {error ? <div className="error-box">{error}</div> : null}
    </div>
  );
}

function ChatPanel({
  chat,
  chatInput,
  setChatInput,
  chatLoading,
  sendChat,
}: {
  chat: ChatMsg[];
  chatInput: string;
  setChatInput: (v: string) => void;
  chatLoading: boolean;
  sendChat: () => void;
}) {
  return (
    <div>
      <h2 className="panel-title">Chat PDF</h2>
      <p className="panel-desc">Pose des questions — l&apos;IA répond depuis ton cours.</p>
      <div className="chat-box">
        {chat.length === 0 ? (
          <p className="chat-hint">Ex : « Résume le chapitre 2 » ou « Quoi retenir pour l&apos;examen ? »</p>
        ) : (
          chat.map((m, i) => (
            <div key={i} className={`chat-bubble chat-${m.role}`}>
              {m.text}
            </div>
          ))
        )}
      </div>
      <div className="chat-input-row">
        <input
          type="text"
          className="chat-input"
          placeholder="Ta question…"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !chatLoading && sendChat()}
        />
        <button type="button" className="btn btn-primary" onClick={sendChat} disabled={chatLoading}>
          {chatLoading ? "…" : "Envoyer"}
        </button>
      </div>
    </div>
  );
}

function UploadZone({
  drag,
  setDrag,
  loading,
  onFile,
}: {
  drag: boolean;
  setDrag: (v: boolean) => void;
  loading: boolean;
  onFile: (f: File) => void;
}) {
  return (
    <div
      className={`upload-zone ${drag ? "dragover" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      onClick={() => document.getElementById("pdf-input")?.click()}
      role="button"
      tabIndex={0}
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
        <p className="upload-title">Lecture du PDF…</p>
      ) : (
        <>
          <p className="upload-title">Dépose ton PDF de cours</p>
          <p className="upload-sub">Résumé · Chat · Plan · Examens</p>
        </>
      )}
    </div>
  );
}

function FeaturePanel({
  title,
  desc,
  loading,
  onRun,
  content,
  cta,
}: {
  title: string;
  desc: string;
  loading: boolean;
  onRun: () => void;
  content: string | null;
  cta: string;
}) {
  return (
    <div>
      <h2 className="panel-title">{title}</h2>
      <p className="panel-desc">{desc}</p>
      {!content ? (
        <button type="button" className="btn btn-primary" onClick={onRun} disabled={loading}>
          {loading ? "Génération…" : cta}
        </button>
      ) : (
        <>
          <pre className="ai-output">{content}</pre>
          <button type="button" className="btn btn-ghost regen-btn" onClick={onRun} disabled={loading}>
            {loading ? "…" : "Régénérer"}
          </button>
        </>
      )}
    </div>
  );
}
