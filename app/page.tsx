import Link from "next/link";
import { Header } from "@/components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="hero container">
          <h1>
            Révise 2× plus vite.
            <br />
            Sans refaire tes fiches.
          </h1>
          <p>Tu uploades ton cours. On te génère un QCM. Tu révises.</p>
          <div className="hero-actions">
            <Link href="/app" className="btn btn-primary">
              Essayer gratuitement
            </Link>
            <Link href="/exemple" className="btn btn-ghost">
              Voir un exemple
            </Link>
          </div>
        </section>

        <section className="section container">
          <h2>Comment ça marche</h2>
          <div className="grid-3">
            <div className="card">
              <h3>1. Upload</h3>
              <p style={{ color: "var(--muted)" }}>Dépose ton PDF de cours (texte lisible).</p>
            </div>
            <div className="card">
              <h3>2. Génération</h3>
              <p style={{ color: "var(--muted)" }}>On extrait l&apos;essentiel et on crée tes questions.</p>
            </div>
            <div className="card">
              <h3>3. Révision</h3>
              <p style={{ color: "var(--muted)" }}>15 questions QCM — score à la fin.</p>
            </div>
          </div>
        </section>

        <section className="section container">
          <h2>Tarifs (bientôt actifs)</h2>
          <div className="pricing">
            <div className="card price-card">
              <h3>Gratuit</h3>
              <p className="price">0 €</p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>3 cours / mois</p>
            </div>
            <div className="card price-card">
              <h3>Examens</h3>
              <p className="price">9 €</p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>/ mois · illimité</p>
            </div>
            <div className="card price-card">
              <h3>Saison</h3>
              <p className="price">19 €</p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>4 mois · illimité</p>
            </div>
          </div>
        </section>

        <section className="section container faq" style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2>FAQ</h2>
          <details>
            <summary>Est-ce que ça remplace le cours ?</summary>
            <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
              Non — ça t&apos;aide à réviser activement avant l&apos;examen.
            </p>
          </details>
          <details>
            <summary>Mes PDF restent privés ?</summary>
            <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
              Oui. Traitement sur le serveur, pas revendu. Version beta.
            </p>
          </details>
          <details>
            <summary>Quels cours ça marche ?</summary>
            <p style={{ marginTop: "0.5rem", color: "var(--muted)" }}>
              Maths, éco, droit, bio… tout PDF avec du vrai texte (pas un scan flou).
            </p>
          </details>
        </section>

        <p className="container" style={{ textAlign: "center", color: "var(--muted)", paddingBottom: "1rem" }}>
          Fait par un étudiant en math-info, pour des étudiants qui perdent trop de temps sur les fiches.
        </p>
      </main>
      <footer className="site-footer">
        <p>Reviz · Contact : ziyed@reviz.app (à configurer)</p>
      </footer>
    </>
  );
}
