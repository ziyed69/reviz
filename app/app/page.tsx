import { Header } from "@/components/Header";
import { RevizApp } from "@/components/RevizApp";

export default function AppPage() {
  return (
    <>
      <Header />
      <main className="container app-main">
        <p className="badge">Reviz AI · super-app étudiant</p>
        <h1>Tout pour réviser et décrocher ton stage</h1>
        <p className="app-lead">
          Révisions, CV, rapport de stage, mode crash, prof IA et planning — une seule app.
        </p>
        <RevizApp />
      </main>
    </>
  );
}
