"use client";

import { MarkdownView } from "./MarkdownView";

type Props = {
  title: string;
  content: string;
  mode?: string;
  onRegenerate?: () => void;
  loading?: boolean;
};

export function ResultPanel({ title, content, mode, onRegenerate, loading }: Props) {
  return (
    <div className="result-panel">
      <div className="result-header">
        <h3 className="result-title">{title}</h3>
        {mode && <span className="result-badge">{mode === "ai" ? "IA" : "Gratuit"}</span>}
      </div>
      <div className="result-body">
        <MarkdownView content={content} />
      </div>
      {onRegenerate && (
        <button type="button" className="btn btn-ghost regen-btn" onClick={onRegenerate} disabled={loading}>
          {loading ? "Génération…" : "Régénérer"}
        </button>
      )}
    </div>
  );
}
