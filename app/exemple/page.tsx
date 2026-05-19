"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { QuizPlayer } from "@/components/QuizPlayer";
import { DEMO_QUIZ } from "@/lib/demo-quiz";

export default function ExemplePage() {
  const [started, setStarted] = useState(false);

  return (
    <>
      <Header />
      <main className="container app-main">
        <p className="badge">Démo</p>
        <h1>Examen auto — exemple</h1>
        <p className="app-lead">8 questions d&apos;algèbre linéaire, sans upload.</p>

        {!started ? (
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ marginBottom: "1.5rem" }}>
              Teste l&apos;outil examen comme un vrai utilisateur.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setStarted(true)}>
              Lancer la démo
            </button>
            <p style={{ marginTop: "1.5rem" }}>
              <Link href="/app">→ Ouvrir l&apos;app complète avec ton PDF</Link>
            </p>
          </div>
        ) : (
          <QuizPlayer quiz={DEMO_QUIZ} onReset={() => setStarted(false)} />
        )}
      </main>
    </>
  );
}
