"use client";

import { useCallback, useEffect, useState } from "react";
import type { CourseContext, Quiz } from "@/lib/types";
import type { QuotaInfo } from "./QuotaBanner";
import { QuotaBanner } from "./QuotaBanner";
import { PdfUploader } from "./PdfUploader";
import { QuizPlayer } from "./QuizPlayer";
import { RevisionPanel } from "./modules/RevisionPanel";
import { CvPanel } from "./modules/CvPanel";
import { ReportPanel } from "./modules/ReportPanel";
import { CrashPanel } from "./modules/CrashPanel";
import { ProfPanel } from "./modules/ProfPanel";
import { PlanningPanel } from "./modules/PlanningPanel";
import { AntiEchecPanel } from "./modules/AntiEchecPanel";
import type { WrongItem } from "@/lib/modules/antiechec";

export type ModuleId =
  | "revision"
  | "cv"
  | "report"
  | "crash"
  | "prof"
  | "planning"
  | "antiechec";

const MODULES: { id: ModuleId; label: string; icon: string; needsPdf?: boolean }[] = [
  { id: "revision", label: "Révisions", icon: "📚" },
  { id: "cv", label: "CV + Stage", icon: "💼" },
  { id: "report", label: "Rapport / Mémoire", icon: "📄" },
  { id: "crash", label: "Exam crash", icon: "🔥", needsPdf: true },
  { id: "prof", label: "Prof IA", icon: "🧑‍🏫", needsPdf: true },
  { id: "planning", label: "Planning", icon: "📅", needsPdf: true },
  { id: "antiechec", label: "Anti-échec", icon: "📊" },
];

export function RevizApp() {
  const [module, setModule] = useState<ModuleId>("revision");
  const [course, setCourse] = useState<CourseContext | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [wrongItems, setWrongItems] = useState<WrongItem[]>([]);

  const applyQuota = (data: { quota?: QuotaInfo }) => {
    if (data.quota) setQuota(data.quota);
  };

  useEffect(() => {
    fetch("/api/quota")
      .then((r) => r.json())
      .then(applyQuota)
      .catch(() => {});
  }, []);

  const uploadPdf = useCallback(async (file: File) => {
    setLoadingPdf(true);
    setError(null);
    setQuiz(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/pdf/extract", { method: "POST", body: form });
      const data = await res.json();
      applyQuota(data);
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setCourse({ title: data.title, text: data.text });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoadingPdf(false);
    }
  }, []);

  const callModule = useCallback(
    async (body: Record<string, unknown>) => {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      applyQuota(data);
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      return data;
    },
    []
  );

  if (quiz) {
    return (
      <QuizPlayer
        quiz={quiz}
        onReset={() => setQuiz(null)}
        onWrong={(items) => setWrongItems(items)}
      />
    );
  }

  const active = MODULES.find((m) => m.id === module)!;
  const needsPdfWarning = active.needsPdf && !course;

  return (
    <div className="reviz-app">
      <QuotaBanner quota={quota} />

      <div className="reviz-layout">
        <aside className="module-nav card">
          <p className="module-nav-title">Reviz AI</p>
          {MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`module-link ${module === m.id ? "module-link-active" : ""}`}
              onClick={() => setModule(m.id)}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </aside>

        <div className="module-main">
          {(module === "revision" || module === "crash" || module === "prof" || module === "planning") && (
            <PdfUploader loading={loadingPdf} fileName={course?.title} onFile={uploadPdf} />
          )}

          {needsPdfWarning && (
            <div className="warn-box">Importe un PDF en haut pour utiliser ce module.</div>
          )}

          {error && <div className="error-box">{error}</div>}

          {module === "revision" && course && (
            <RevisionPanel
              course={course}
              callModule={callModule}
              onQuiz={setQuiz}
              onError={setError}
            />
          )}
          {module === "cv" && (
            <CvPanel callModule={callModule} onError={setError} />
          )}
          {module === "report" && (
            <ReportPanel course={course} callModule={callModule} onError={setError} />
          )}
          {module === "crash" && course && (
            <CrashPanel course={course} callModule={callModule} onError={setError} />
          )}
          {module === "prof" && course && (
            <ProfPanel course={course} callModule={callModule} onError={setError} />
          )}
          {module === "planning" && course && (
            <PlanningPanel course={course} callModule={callModule} onError={setError} />
          )}
          {module === "antiechec" && (
            <AntiEchecPanel wrong={wrongItems} callModule={callModule} onError={setError} />
          )}
        </div>
      </div>
    </div>
  );
}
