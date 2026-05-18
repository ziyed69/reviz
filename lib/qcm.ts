import type { Question, Quiz } from "./types";

const STOP_WORDS = new Set([
  "avec", "dans", "pour", "cette", "comme", "sont", "être", "avoir", "plus",
  "tout", "tous", "une", "des", "les", "est", "par", "sur", "qui", "que",
  "pas", "mais", "donc", "aussi", "entre", "après", "avant", "peut", "être",
  "the", "and", "for", "that", "this", "from", "with", "are", "was",
]);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\wàâäéèêëïîôùûüç\s-]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5 && !STOP_WORDS.has(w));
  return Array.from(new Set(words));
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 50 && s.length <= 400);
}

export function generateQuizFromText(text: string, title: string): Quiz {
  const sents = sentences(text);
  const allWords = pickWords(text);

  if (sents.length < 3 || allWords.length < 8) {
    throw new Error(
      "Pas assez de texte lisible dans ce PDF. Essaie un cours tapé (pas un scan flou)."
    );
  }

  const questions: Question[] = [];
  const used = new Set<string>();
  const pool = shuffle(sents).slice(0, 20);

  for (const sent of pool) {
    if (questions.length >= 15) break;

    const words = pickWords(sent).filter((w) => !used.has(w));
    if (words.length === 0) continue;

    const answer = words.sort((a, b) => b.length - a.length)[0];
    used.add(answer);

    const distractors = shuffle(
      allWords.filter((w) => w !== answer && !sent.toLowerCase().includes(w))
    ).slice(0, 3);

    if (distractors.length < 3) continue;

    const options = shuffle([answer, ...distractors]);
    const correctIndex = options.indexOf(answer);
    const prompt = sent.replace(
      new RegExp(`\\b${answer}\\b`, "i"),
      "______"
    );

    if (!prompt.includes("______")) continue;

    questions.push({
      id: questions.length + 1,
      prompt: `Complète : ${prompt}`,
      options: options.map((o) => o.charAt(0).toUpperCase() + o.slice(1)),
      correctIndex,
    });
  }

  if (questions.length < 5) {
    throw new Error(
      "Impossible de générer assez de questions. Essaie un PDF avec plus de texte."
    );
  }

  return {
    title: title.replace(/\.pdf$/i, ""),
    questions: questions.slice(0, 15),
  };
}
