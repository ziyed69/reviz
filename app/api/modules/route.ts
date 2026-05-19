import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, hasOpenAI, truncateForAI } from "@/lib/ai";
import { buildRichSummary } from "@/lib/format-summary";
import { generateFlashcards } from "@/lib/flashcards";
import { localStudyPlan } from "@/lib/local-fallback";
import { generateQuizFromText } from "@/lib/qcm";
import { analyzeCv } from "@/lib/modules/cv";
import { buildReport, type ReportType } from "@/lib/modules/report";
import { buildCrashPlan } from "@/lib/modules/crash";
import { explainLikeTeacher } from "@/lib/modules/prof";
import { analyzeErrors, type WrongItem } from "@/lib/modules/antiechec";
import {
  consumeQuota,
  errorWithUsage,
  jsonWithUsage,
  validateChatMessage,
  type QuotaAction,
} from "@/lib/limits";

export const runtime = "nodejs";

type ModuleAction =
  | "summary"
  | "flashcards"
  | "chat"
  | "plan"
  | "exam"
  | "cv"
  | "report"
  | "crash"
  | "prof"
  | "antiechec";

const QUOTA_MAP: Record<ModuleAction, QuotaAction> = {
  summary: "summary",
  flashcards: "exam",
  chat: "chat",
  plan: "plan",
  exam: "exam",
  cv: "summary",
  report: "plan",
  crash: "plan",
  prof: "chat",
  antiechec: "exam",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action as ModuleAction;

    const gate = consumeQuota(req, QUOTA_MAP[action]);
    if (!gate.ok) return errorWithUsage(gate.error, gate.usage, gate.status);

    switch (action) {
      case "summary": {
        const { text, title = "Cours" } = body;
        if (!text || text.length < 150) {
          return errorWithUsage("Texte du cours trop court.", gate.usage, 400);
        }
        let content = buildRichSummary(text, title);
        if (hasOpenAI()) {
          try {
            content = await chatCompletion(
              "Tuteur étudiant. Markdown clair en français.",
              `Résume ce cours. Sections : En bref, Idées clés, Mots importants, Avant l'examen.\n\n${truncateForAI(text)}`
            );
          } catch {
            /* garde version locale */
          }
        }
        return jsonWithUsage({ content, mode: hasOpenAI() ? "ai" : "free" }, gate.usage);
      }

      case "flashcards": {
        const { text, title = "Cours" } = body;
        if (!text || text.length < 150) {
          return errorWithUsage("Importe d'abord un PDF.", gate.usage, 400);
        }
        const cards = generateFlashcards(text, title);
        return jsonWithUsage({ cards }, gate.usage);
      }

      case "plan": {
        const { text, title = "Cours" } = body;
        let content = localStudyPlan(title);
        if (text && hasOpenAI()) {
          try {
            content = await chatCompletion(
              "Coach révision. Markdown.",
              `Plan 7 jours avant examen pour:\n${truncateForAI(text)}`
            );
          } catch {
            /* local */
          }
        }
        return jsonWithUsage({ content, mode: hasOpenAI() ? "ai" : "free" }, gate.usage);
      }

      case "crash": {
        const { text, title = "Cours", days = 3 } = body;
        if (!text || text.length < 150) {
          return errorWithUsage("Importe un PDF pour le mode crash.", gate.usage, 400);
        }
        const content = buildCrashPlan(text, title, Number(days) || 3);
        return jsonWithUsage({ content, mode: "free" }, gate.usage);
      }

      case "prof": {
        const { text, title = "Cours", topic } = body;
        if (!text || text.length < 150) {
          return errorWithUsage("Importe un PDF.", gate.usage, 400);
        }
        let content = explainLikeTeacher(text, topic || title);
        if (hasOpenAI()) {
          try {
            content = await chatCompletion(
              "Prof patient. Explique simplement en markdown.",
              `Explique comme à un étudiant L2:\n${topic || title}\n\n${truncateForAI(text)}`
            );
          } catch {
            /* local */
          }
        }
        return jsonWithUsage({ content, mode: hasOpenAI() ? "ai" : "free" }, gate.usage);
      }

      case "chat": {
        const { text, title = "Cours", message } = body;
        const chatErr = validateChatMessage(message ?? "");
        if (chatErr) return errorWithUsage(chatErr, gate.usage, 400);
        if (!text) return errorWithUsage("Importe un PDF.", gate.usage, 400);
        if (!hasOpenAI()) {
          return jsonWithUsage(
            {
              reply:
                "Chat IA avancé nécessite OPENAI_API_KEY. Utilise Résumé, Prof IA ou Examen (mode gratuit).",
              mode: "free",
            },
            gate.usage
          );
        }
        const reply = await chatCompletion(
          "Réponds uniquement depuis le cours. Français, clair.",
          `${truncateForAI(text)}\n\nQuestion: ${message!.trim()}`
        );
        return jsonWithUsage({ reply, mode: "ai" }, gate.usage);
      }

      case "exam": {
        const { text, title = "Cours" } = body;
        if (!text) return errorWithUsage("Importe un PDF.", gate.usage, 400);
        const quiz = generateQuizFromText(text, title);
        return jsonWithUsage({ quiz, mode: "free" }, gate.usage);
      }

      case "cv": {
        const { cv, jobOffer } = body;
        if (!cv?.trim() || !jobOffer?.trim()) {
          return errorWithUsage("CV et offre requis.", gate.usage, 400);
        }
        const result = analyzeCv(cv, jobOffer);
        return jsonWithUsage({ result, mode: "free" }, gate.usage);
      }

      case "report": {
        const { reportType, subject, context = "" } = body as {
          reportType: ReportType;
          subject: string;
          context?: string;
        };
        if (!subject?.trim()) {
          return errorWithUsage("Sujet requis.", gate.usage, 400);
        }
        const content = buildReport(reportType || "stage", subject, context);
        return jsonWithUsage({ content, mode: "free" }, gate.usage);
      }

      case "antiechec": {
        const { wrong } = body as { wrong: WrongItem[] };
        const content = analyzeErrors(wrong ?? []);
        return jsonWithUsage({ content, mode: "free" }, gate.usage);
      }

      default:
        return errorWithUsage("Module inconnu.", gate.usage, 400);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
