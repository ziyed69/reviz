"use client";

import { useState } from "react";
import type { WrongItem } from "@/lib/modules/antiechec";
import { ResultPanel } from "../ResultPanel";

type CallFn = (body: Record<string, unknown>) => Promise<Record<string, unknown>>;

export function AntiEchecPanel({
  wrong,
  callModule,
  onError,
}: {
  wrong: WrongItem[];
  callModule: CallFn;
  onError: (e: string | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    onError(null);
    try {
      const data = await callModule({ action: "antiechec", wrong });
      if (data?.content) setContent(String(data.content));
    } catch (e) {
      onError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card tab-panel">
      <h2 className="panel-title">Anti-échec</h2>
      <p className="panel-desc">
        Fais d&apos;abord un QCM (module Révisions). On analyse tes erreurs ici.
        {wrong.length > 0 ? ` (${wrong.length} erreur(s) enregistrée(s))` : ""}
      </p>
      <button type="button" className="btn btn-primary" disabled={loading} onClick={run}>
        {loading ? "…" : "Analyser mes erreurs"}
      </button>
      {content && <ResultPanel title="Diagnostic" content={content} mode="free" />}
    </div>
  );
}
