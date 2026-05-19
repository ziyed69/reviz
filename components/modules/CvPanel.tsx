"use client";

import { useState } from "react";
import type { CvResult } from "@/lib/modules/cv";
import { ResultPanel } from "../ResultPanel";

type CallFn = (body: Record<string, unknown>) => Promise<Record<string, unknown>>;

export function CvPanel({
  callModule,
  onError,
}: {
  callModule: CallFn;
  onError: (e: string | null) => void;
}) {
  const [cv, setCv] = useState("");
  const [offer, setOffer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CvResult | null>(null);

  async function analyze() {
    setLoading(true);
    onError(null);
    try {
      const data = await callModule({ action: "cv", cv, jobOffer: offer });
      if (data?.result) setResult(data.result as CvResult);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card tab-panel">
      <h2 className="panel-title">CV + Stage</h2>
      <p className="panel-desc">Colle ton CV et l&apos;offre — score ATS, CV optimisé, lettre.</p>
      <label className="field-label">Ton CV</label>
      <textarea className="field-textarea" rows={8} value={cv} onChange={(e) => setCv(e.target.value)} placeholder="Colle le texte de ton CV…" />
      <label className="field-label">Offre de stage</label>
      <textarea className="field-textarea" rows={6} value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="Colle l'annonce…" />
      <button type="button" className="btn btn-primary" disabled={loading} onClick={analyze}>
        {loading ? "Analyse…" : "Analyser & optimiser"}
      </button>
      {result && (
        <div className="cv-results">
          <div className="score-ring">Score ATS : <strong>{result.score}/100</strong></div>
          <ResultPanel
            title="Lettre de motivation"
            content={result.letter}
            mode="free"
          />
          <ResultPanel
            title="CV optimisé (brouillon)"
            content={result.cvOptimized}
            mode="free"
          />
          <ResultPanel
            title="Conseils"
            content={result.tips.map((t) => `- ${t}`).join("\n")}
            mode="free"
          />
        </div>
      )}
    </div>
  );
}
