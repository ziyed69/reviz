"use client";

import { useState } from "react";
import type { CourseContext } from "@/lib/types";
import { ResultPanel } from "../ResultPanel";

type CallFn = (body: Record<string, unknown>) => Promise<Record<string, unknown>>;

export function CrashPanel({
  course,
  callModule,
  onError,
}: {
  course: CourseContext;
  callModule: CallFn;
  onError: (e: string | null) => void;
}) {
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    onError(null);
    try {
      const data = await callModule({
        action: "crash",
        text: course.text,
        title: course.title,
        days,
      });
      if (data?.content) setContent(String(data.content));
    } catch (e) {
      onError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card tab-panel">
      <h2 className="panel-title">Exam crash mode</h2>
      <p className="panel-desc">Examen dans peu de jours ? Plan de survie + résumé express.</p>
      <label className="field-label">Jours restants</label>
      <select className="field-select" value={days} onChange={(e) => setDays(Number(e.target.value))}>
        <option value={1}>1 jour</option>
        <option value={3}>3 jours</option>
        <option value={7}>7 jours</option>
      </select>
      <button type="button" className="btn btn-primary" disabled={loading} onClick={run} style={{ marginTop: "1rem" }}>
        {loading ? "…" : "Activer le mode survie"}
      </button>
      {content && <ResultPanel title="Plan crash" content={content} mode="free" />}
    </div>
  );
}
