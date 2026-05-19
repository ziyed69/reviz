"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";

export function SuccessClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("ok");
      return;
    }
    fetch("/api/premium/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => (r.ok ? setStatus("ok") : setStatus("err")))
      .catch(() => setStatus("err"));
  }, [sessionId]);

  return (
    <>
      <Header />
      <main className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
        <h1 style={{ marginBottom: "1rem" }}>Paiement réussi</h1>
        {status === "loading" && (
          <p style={{ color: "var(--muted)" }}>Activation Premium…</p>
        )}
        {status === "ok" && (
          <p style={{ color: "var(--muted)", maxWidth: 480, margin: "0 auto 2rem" }}>
            Premium activé — limites IA plus hautes sur cet appareil (31 jours).
          </p>
        )}
        {status === "err" && (
          <p style={{ color: "var(--error)", maxWidth: 480, margin: "0 auto 2rem" }}>
            Paiement OK mais activation en retard. Réessaie depuis l&apos;app ou contacte le support.
          </p>
        )}
        <Link href="/app" className="btn btn-primary">
          Ouvrir Reviz
        </Link>
      </main>
    </>
  );
}
