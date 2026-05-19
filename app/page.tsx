import Link from "next/link";
import { Header } from "@/components/Header";
import { SubscribeButton } from "@/components/SubscribeButton";

const FEATURES = [
  {
    emoji: "📄",
    title: "Résumé de cours",
    text: "L'essentiel en 2 min : idées clés, définitions, pièges à éviter.",
  },
  {
    emoji: "💬",
    title: "Chat PDF",
    text: "Pose des questions sur ton cours — l'IA répond à partir de ton document.",
  },
  {
    emoji: "📅",
    title: "Plan de révision",
    text: "Un planning J-7 → jour J généré pour ton examen.",
  },
  {
    emoji: "✅",
    title: "Examens auto",
    text: "QCM interactif + score — tu sais où tu en es.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero container">
          <p className="badge">IA étudiant · nouvelle génération</p>
          <h1>
            Révise comme un étudiant
            <br />
            de 2026.
          </h1>
          <p className="hero-sub">
            Reviz transforme ton PDF en résumé, chat, plan et examen — sans refaire tes fiches à la main.
          </p>
          <div className="hero-actions">
            <Link href="/app" className="btn btn-primary">
              Essayer gratuitement
            </Link>
            <Link href="/exemple" className="btn btn-ghost">
              Voir la démo
            </Link>
          </div>
        </section>

        <section className="section container">
          <h2>4 outils. 1 upload.</h2>
          <div className="grid-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card feature-card">
                <span className="feature-emoji">{f.emoji}</span>
                <h3>{f.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="tarifs" className="section container">
          <h2>Tarifs</h2>
          <div className="pricing">
            <div className="card price-card">
              <h3>Gratuit</h3>
              <p className="price">0 €</p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                2 PDF/jour · quotas IA limités
              </p>
              <Link href="/app" className="btn btn-ghost" style={{ marginTop: "1rem" }}>
                Commencer
              </Link>
            </div>
            <div className="card price-card price-featured">
              <h3>Reviz Premium</h3>
              <p className="price">5 €</p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                / mois · quotas IA élevés (anti-abus)
              </p>
              <div style={{ marginTop: "1rem" }}>
                <SubscribeButton label="S'abonner — 5 €/mois" />
              </div>
            </div>
          </div>
        </section>

        <section className="section container faq" style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2>FAQ</h2>
          <details>
            <summary>Comment tu évites le spam / les coûts IA ?</summary>
            <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
              Limites par jour et par appareil (gratuit : 2 PDF, 12 messages chat, etc.). Premium = plus de crédits. Pause 2 s entre chaque action.
            </p>
          </details>
          <details>
            <summary>Il me faut une clé OpenAI ?</summary>
            <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
              Pour le chat et les meilleurs résumés, oui (clé dans Vercel). Sans clé : mode basique + examens locaux.
            </p>
          </details>
          <details>
            <summary>Mes PDF sont privés ?</summary>
            <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
              Oui. Traitement serveur, pas revendu.
            </p>
          </details>
        </section>
      </main>
      <footer className="site-footer">
        <p>Reviz — fait par un étudiant, pour les étudiants</p>
      </footer>
    </>
  );
}
