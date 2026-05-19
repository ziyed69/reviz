"use client";

export type QuotaInfo = {
  tier: string;
  remaining: {
    pdf: number;
    summary: number;
    chat: number;
    plan: number;
    exam: number;
  };
};

export function QuotaBanner({ quota }: { quota: QuotaInfo | null }) {
  if (!quota) return null;

  const isPremium = quota.tier === "premium";
  const r = quota.remaining;

  return (
    <div className={`quota-banner ${isPremium ? "quota-premium" : ""}`}>
      <span className="quota-tier">{isPremium ? "Premium" : "Gratuit"}</span>
      <span className="quota-items">
        PDF {r.pdf} · Résumé {r.summary} · Chat {r.chat} · Plan {r.plan} · Exam {r.exam}
      </span>
      {!isPremium && (
        <a href="/#tarifs" className="quota-upgrade">
          Plus de crédits →
        </a>
      )}
    </div>
  );
}
