import type { Flashcard } from "./types";

export function generateFlashcards(text: string, title: string): Flashcard[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 40 && s.length <= 220);

  const cards: Flashcard[] = [];
  const used = new Set<string>();

  for (const sent of sentences) {
    if (cards.length >= 12) break;
    const words = sent
      .split(/\s+/)
      .filter((w) => w.replace(/[^\w]/g, "").length >= 6);
    if (words.length < 2) continue;
    const answer = words.sort((a, b) => b.length - a.length)[0];
    if (used.has(answer.toLowerCase())) continue;
    used.add(answer.toLowerCase());

    const q = sent.replace(new RegExp(`\\b${answer}\\b`, "i"), "______");
    if (!q.includes("______")) continue;

    cards.push({
      id: cards.length + 1,
      question: q,
      answer: answer.charAt(0).toUpperCase() + answer.slice(1),
    });
  }

  if (cards.length < 4) {
    return [
      { id: 1, question: `Quel est le sujet principal de « ${title} » ?`, answer: title },
      { id: 2, question: "Combien de temps prévoir pour réviser ce chapitre ?", answer: "45–90 min en mode actif" },
    ];
  }

  return cards;
}
