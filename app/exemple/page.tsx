"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { QuizPlayer } from "@/components/QuizPlayer";
import { DEMO_QUIZ } from "@/lib/demo-quiz";

export default function ExemplePage() {
  const [started, setStarted] = useState(false);

  return (
    <>
      <Header />
      <main className="container" style={{ padding: "2rem 0 4rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Démo Reviz</h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          Exemple : chapitre d&apos;algèbre linéaire — 8 questions, sans upload.
        </p>

        {!started ? (
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ marginBottom: "1.5rem" }}>
              Clique pour lancer le QCM démo comme un vrai utilisateur.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setStarted(true)}>
              Générer le QCM démo
            </button>
          </div>
        ) : (
          <QuizPlayer quiz={DEMO_QUIZ} onReset={() => setStarted(false)} />
        )}
      </main>
    </>
  );
}
