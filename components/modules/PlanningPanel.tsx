"use client";

import { useState } from "react";
import type { CourseContext } from "@/lib/types";
import { ResultPanel } from "../ResultPanel";

type CallFn = (body: Record<string, unknown>) => Promise<Record<string, unknown>>;

export function PlanningPanel({
  course,
  callModule,
  onError,
}: {
  course: CourseContext;
  callModule: CallFn;
  onError: (e: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    onError(null);
    try {
      const data = await callModule({
        action: "plan",
        text: course.text,
        title: course.title,
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
      <h2 className="panel-title">Planning de révision</h2>
      <p className="panel-desc">Calendrier jour par jour avant l&apos;examen.</p>
      <button type="button" className="btn btn-primary" disabled={loading} onClick={run}>
        {loading ? "…" : "Créer mon planning"}
      </button>
      {content && <ResultPanel title="Ton planning" content={content} mode="free" onRegenerate={run} loading={loading} />}
    </div>
  );
}
