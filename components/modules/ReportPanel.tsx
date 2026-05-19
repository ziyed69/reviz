"use client";

import { useState } from "react";
import type { CourseContext } from "@/lib/types";
import type { ReportType } from "@/lib/modules/report";
import { ResultPanel } from "../ResultPanel";

type CallFn = (body: Record<string, unknown>) => Promise<Record<string, unknown>>;

export function ReportPanel({
  course,
  callModule,
  onError,
}: {
  course: CourseContext | null;
  callModule: CallFn;
  onError: (e: string | null) => void;
}) {
  const [type, setType] = useState<ReportType>("stage");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    onError(null);
    try {
      const data = await callModule({
        action: "report",
        reportType: type,
        subject,
        context: course?.text?.slice(0, 2000) ?? "",
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
      <h2 className="panel-title">Rapport de stage / Mémoire</h2>
      <p className="panel-desc">Plan complet : intro, problématique, chapitres, conclusion.</p>
      <div className="row-fields">
        <select className="field-select" value={type} onChange={(e) => setType(e.target.value as ReportType)}>
          <option value="stage">Rapport de stage</option>
          <option value="memoire">Mémoire</option>
          <option value="projet">Projet</option>
        </select>
      </div>
      <label className="field-label">Sujet / problématique</label>
      <input className="field-input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex : Optimisation logistique chez…" />
      <button type="button" className="btn btn-primary" disabled={loading || !subject.trim()} onClick={generate}>
        {loading ? "…" : "Générer le plan"}
      </button>
      {content && <ResultPanel title="Structure du document" content={content} mode="free" />}
    </div>
  );
}
