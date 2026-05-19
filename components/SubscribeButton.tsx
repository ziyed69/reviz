"use client";

import { useState } from "react";

type Props = {
  label?: string;
  className?: string;
};

export function SubscribeButton({
  label = "Passer à Reviz Premium — 5 €/mois",
  className = "btn btn-primary",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur paiement");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" className={className} onClick={checkout} disabled={loading}>
        {loading ? "Redirection…" : label}
      </button>
      {error && (
        <p style={{ color: "var(--error)", fontSize: "0.85rem", marginTop: "0.5rem" }}>{error}</p>
      )}
    </div>
  );
}
