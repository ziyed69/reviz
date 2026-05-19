"use client";

import { useState } from "react";
import type { CourseContext } from "@/lib/types";
import { ResultPanel } from "../ResultPanel";

type CallFn = (body: Record<string, unknown>) => Promise<Record<string, unknown>>;

export function ProfPanel({
  course,
  callModule,
  onError,
}: {
  course: CourseContext;
  callModule: CallFn;
  onError: (e: string | null) => void;
}) {
  const [topic, setTopic] = useState(course.title);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [mode, setMode] = useState("free");

  async function run() {
    setLoading(true);
    onError(null);
    try {
      const data = await callModule({
        action: "prof",
        text: course.text,
        title: course.title,
        topic,
      });
      if (data?.content) {
        setContent(String(data.content));
        setMode(String(data.mode ?? "free"));
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card tab-panel">
      <h2 className="panel-title">Prof IA</h2>
      <p className="panel-desc">Explication simple, comme en cours.</p>
      <label className="field-label">Chapitre / thème</label>
      <input className="field-input" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <button type="button" className="btn btn-primary" disabled={loading} onClick={run} style={{ marginTop: "1rem" }}>
        {loading ? "…" : "Explique-moi ce cours"}
      </button>
      {content && (
        <ResultPanel title="Explication" content={content} mode={mode} onRegenerate={run} loading={loading} />
      )}
    </div>
  );
}
