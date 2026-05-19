export type WrongItem = { prompt: string; correct: string; chosen?: string };

export function analyzeErrors(wrong: WrongItem[]): string {
  if (wrong.length === 0) {
    return `## Anti-échec\n\nAucune erreur enregistrée. Fais d'abord un **examen auto**, puis reviens ici.`;
  }

  let md = `## Analyse de tes erreurs\n\n`;
  md += `**${wrong.length}** question(s) ratée(s) détectée(s).\n\n`;

  md += `### Où tu perds des points\n`;
  wrong.slice(0, 8).forEach((w, i) => {
    md += `${i + 1}. **${truncate(w.prompt, 80)}**\n`;
    md += `   - Tu as choisi : *${w.chosen ?? "?"}*\n`;
    md += `   - Bonne réponse : **${w.correct}**\n`;
  });

  md += `\n### Plan de rattrapage\n`;
  md += `- Refais ces questions dans 24h (effet mémoire)\n`;
  md += `- Écris 1 phrase par erreur « en mes propres mots »\n`;
  md += `- Mini-QCM de 5 questions sur tes ratés uniquement\n`;

  md += `\n### Pattern détecté\n`;
  if (wrong.length >= 5) {
    md += `Tu confonds souvent des termes proches — fais des **flashcards** sur les mots en gras.\n`;
  } else {
    md += `Erreurs ciblées — 30 min de focus suffisent pour les corriger.\n`;
  }

  return md;
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + "…" : s;
}
