import { Header } from "@/components/Header";
import { AppTool } from "@/components/AppTool";

export default function AppPage() {
  return (
    <>
      <Header />
      <main className="container" style={{ padding: "2rem 0 4rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Génère ton QCM</h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          PDF de cours → questions en quelques secondes.
        </p>
        <AppTool />
      </main>
    </>
  );
}
