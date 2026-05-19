import { Suspense } from "react";
import { SuccessClient } from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
          Chargement…
        </main>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
