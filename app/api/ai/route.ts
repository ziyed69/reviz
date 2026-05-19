import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, hasOpenAI, truncateForAI } from "@/lib/ai";
import {
  consumeQuota,
  errorWithUsage,
  jsonWithUsage,
  validateChatMessage,
  type QuotaAction,
} from "@/lib/limits";
import { localStudyPlan, localSummary } from "@/lib/local-fallback";
import { generateQuizFromText } from "@/lib/qcm";
import type { Quiz } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  action: "summary" | "chat" | "plan" | "exam";
  text: string;
  title?: string;
  message?: string;
};

const ACTION_QUOTA: Record<Body["action"], QuotaAction> = {
  summary: "summary",
  chat: "chat",
  plan: "plan",
  exam: "exam",
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const { action, text, title = "Cours", message } = body;

    if (!text || text.length < 150) {
      return NextResponse.json({ error: "Texte du cours manquant ou trop court." }, { status: 400 });
    }

    const gate = consumeQuota(req, ACTION_QUOTA[action]);
    if (!gate.ok) return errorWithUsage(gate.error, gate.usage, gate.status);

    const chunk = truncateForAI(text);

    switch (action) {
      case "summary": {
        if (!hasOpenAI()) {
          return jsonWithUsage(
            { content: localSummary(text, title), mode: "basic" },
            gate.usage
          );
        }
        const content = await chatCompletion(
          "Tu es un tuteur pour étudiants français. Réponds en markdown clair.",
          `Résume ce cours pour réviser avant un examen. Structure : ## Idées clés, ## Définitions, ## Points à retenir, ## Pièges fréquents. Concis mais complet.\n\nTitre: ${title}\n\n${chunk}`
        );
        return jsonWithUsage({ content, mode: "ai" }, gate.usage);
      }

      case "plan": {
        if (!hasOpenAI()) {
          return jsonWithUsage(
            { content: localStudyPlan(title), mode: "basic" },
            gate.usage
          );
        }
        const content = await chatCompletion(
          "Tu es un coach révision pour étudiants. Réponds en markdown.",
          `Crée un plan de révision sur 7 jours avant l'exam. Tableau jour par jour + durées réalistes (1-2h/jour). Basé sur ce cours:\n\nTitre: ${title}\n\n${chunk}`
        );
        return jsonWithUsage({ content, mode: "ai" }, gate.usage);
      }

      case "chat": {
        const chatErr = validateChatMessage(message ?? "");
        if (chatErr) return errorWithUsage(chatErr, gate.usage, 400);
        if (!hasOpenAI()) {
          return jsonWithUsage(
            {
              reply:
                "Le chat PDF nécessite l'IA (OPENAI_API_KEY). En attendant, utilise Résumé + Examens auto.",
              mode: "basic",
            },
            gate.usage
          );
        }
        const reply = await chatCompletion(
          `Tu es un prof assistant. Tu réponds UNIQUEMENT à partir du cours fourni. Si la réponse n'est pas dans le cours, dis-le. Français, clair, concis.`,
          `Cours "${title}":\n\n${chunk}\n\n---\nQuestion étudiant: ${message!.trim()}`
        );
        return jsonWithUsage({ reply, mode: "ai" }, gate.usage);
      }

      case "exam": {
        let quiz: Quiz;
        try {
          quiz = generateQuizFromText(text, title);
        } catch {
          return errorWithUsage(
            "Impossible de générer l'examen depuis ce PDF.",
            gate.usage,
            422
          );
        }

        if (hasOpenAI() && quiz.questions.length > 0) {
          try {
            const improved = await chatCompletion(
              'Tu génères des QCM en JSON strict. Format: {"questions":[{"prompt":"...","options":["A","B","C","D"],"correctIndex":0}]}. 10 questions, une seule bonne réponse, niveau examen.',
              `À partir de ce cours, génère 10 QCM difficiles mais justes:\n\n${chunk.slice(0, 8000)}`
            );
            const parsed = JSON.parse(improved) as { questions: Quiz["questions"] };
            if (parsed.questions?.length >= 5) {
              quiz = {
                title,
                questions: parsed.questions.slice(0, 15).map((q, i) => ({
                  id: i + 1,
                  prompt: q.prompt,
                  options: q.options,
                  correctIndex: q.correctIndex,
                })),
              };
              return jsonWithUsage({ quiz, mode: "ai" }, gate.usage);
            }
          } catch {
            /* quiz local */
          }
        }

        return jsonWithUsage({ quiz, mode: "basic" }, gate.usage);
      }

      default:
        return errorWithUsage("Action inconnue.", gate.usage, 400);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur IA";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
