"use client";

import { useState } from "react";
import type { CourseContext, Flashcard, Quiz } from "@/lib/types";
import { ResultPanel } from "../ResultPanel";
import { FlashcardsPlayer } from "../FlashcardsPlayer";

type CallFn = (body: Record<string, unknown>) => Promise<Record<string, unknown>>;

const TABS = [
  { id: "summary", label: "Résumé" },
  { id: "flashcards", label: "Flashcards" },
  { id: "exam", label: "QCM" },
  { id: "chat", label: "Chat" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function RevisionPanel({
  course,
  callModule,
  onQuiz,
  onError,
}: {
  course: CourseContext;
  callModule: CallFn;
  onQuiz: (q: Quiz) => void;
  onError: (e: string | null) => void;
}) {
  const [tab, setTab] = useState<TabId>("summary");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryMode, setSummaryMode] = useState<string>("free");
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [chat, setChat] = useState<{ role: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  async function run(action: string, extra: Record<string, unknown> = {}) {
    setLoading(true);
    onError(null);
    try {
      const data = await callModule({
        action,
        text: course.text,
        title: course.title,
        ...extra,
      });
      return data;
    } catch (e) {
      onError(e instanceof Error ? e.message : "Erreur");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="revision-panel">
      <div className="sub-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab ${tab === t.id ? "tab-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <div className="card tab-panel">
          {!summary ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={loading}
              onClick={async () => {
                const data = await run("summary");
                if (data?.content) {
                  setSummary(String(data.content));
                  setSummaryMode(String(data.mode ?? "free"));
                }
              }}
            >
              {loading ? "Génération…" : "Générer le résumé"}
            </button>
          ) : (
            <ResultPanel
              title="Résumé de ton cours"
              content={summary}
              mode={summaryMode}
              loading={loading}
              onRegenerate={async () => {
                const data = await run("summary");
                if (data?.content) {
                  setSummary(String(data.content));
                  setSummaryMode(String(data.mode ?? "free"));
                }
              }}
            />
          )}
        </div>
      )}

      {tab === "flashcards" && (
        <div className="card tab-panel">
          {!cards ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={loading}
              onClick={async () => {
                const data = await run("flashcards");
                if (data?.cards) setCards(data.cards as Flashcard[]);
              }}
            >
              {loading ? "…" : "Créer les flashcards"}
            </button>
          ) : (
            <FlashcardsPlayer cards={cards} />
          )}
        </div>
      )}

      {tab === "exam" && (
        <div className="card tab-panel">
          <p className="panel-desc">QCM interactif + score à la fin.</p>
          <button
            type="button"
            className="btn btn-primary"
            disabled={loading}
            onClick={async () => {
              const data = await run("exam");
              if (data?.quiz) onQuiz(data.quiz as Quiz);
            }}
          >
            {loading ? "…" : "Lancer l'examen"}
          </button>
        </div>
      )}

      {tab === "chat" && (
        <div className="card tab-panel">
          <div className="chat-box">
            {chat.map((m, i) => (
              <div key={i} className={`chat-bubble chat-${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Question sur le cours…"
            />
            <button
              type="button"
              className="btn btn-primary"
              disabled={loading}
              onClick={async () => {
                if (!chatInput.trim()) return;
                const msg = chatInput.trim();
                setChatInput("");
                setChat((c) => [...c, { role: "user", text: msg }]);
                const data = await run("chat", { message: msg });
                if (data?.reply) setChat((c) => [...c, { role: "assistant", text: String(data.reply) }]);
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
