import { Header } from "@/components/Header";
import { StudentAI } from "@/components/StudentAI";

export default function AppPage() {
  return (
    <>
      <Header />
      <main className="container app-main">
        <p className="badge">IA étudiant · nouvelle génération</p>
        <h1>Ton copilote de révision</h1>
        <p className="app-lead">
          Un PDF → résumé, chat, plan et examen. Tout au même endroit.
        </p>
        <StudentAI />
      </main>
    </>
  );
}
