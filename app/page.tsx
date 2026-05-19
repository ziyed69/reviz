import Link from "next/link";
import { Header } from "@/components/Header";
import { SubscribeButton } from "@/components/SubscribeButton";

const FEATURES = [
  { emoji: "📚", title: "Révisions PDF", text: "Résumé structuré, flashcards, QCM, chat." },
  { emoji: "💼", title: "CV + Stage", text: "Score ATS, CV optimisé, lettre de motivation." },
  { emoji: "📄", title: "Rapport / Mémoire", text: "Plan complet prêt à compléter." },
  { emoji: "🔥", title: "Exam crash", text: "Plan de survie si l'exam est dans 3 jours." },
  { emoji: "🧑‍🏫", title: "Prof IA", text: "Cours expliqué simplement." },
  { emoji: "📊", title: "Anti-échec", text: "Analyse de tes erreurs au QCM." },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero container">
          <p className="badge">Reviz AI · super-app étudiant</p>
          <h1>
            Une app.
            <br />
            Toute ta scolarité.
          </h1>
          <p className="hero-sub">
            Réviser, postuler en stage, rendre ton rapport — 100 % orienté étudiants français. Mode gratuit sans IA payante obligatoire.
          </p>
          <div className="hero-actions">
            <Link href="/app" className="btn btn-primary">
              Ouvrir Reviz AI
            </Link>
            <Link href="/exemple" className="btn btn-ghost">
              Démo QCM
            </Link>
          </div>
        </section>

        <section className="section container">
          <h2>7 modules. 1 seule app.</h2>
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
                Quotas journaliers · moteur gratuit
              </p>
              <Link href="/app" className="btn btn-ghost" style={{ marginTop: "1rem" }}>
                Commencer
              </Link>
            </div>
            <div className="card price-card price-featured">
              <h3>Premium</h3>
              <p className="price">5 €</p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                / mois · tous les modules · quotas élevés
              </p>
              <div style={{ marginTop: "1rem" }}>
                <SubscribeButton label="S'abonner" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <p>Reviz AI — fait par un étudiant, pour les étudiants</p>
      </footer>
    </>
  );
}
