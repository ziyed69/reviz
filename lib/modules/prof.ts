export function explainLikeTeacher(text: string, topic: string): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 30)
    .slice(0, 8);

  let md = `## Explication — ${topic}\n\n`;
  md += `### En une phrase\n`;
  md += sentences[0]
    ? simplify(sentences[0])
    : "Voici l'idée principale de ton cours, reformulée simplement.";

  md += `\n\n### Étape par étape\n`;
  sentences.slice(0, 5).forEach((s, i) => {
    md += `${i + 1}. ${simplify(s)}\n`;
  });

  md += `\n### Analogie\n`;
  md += `Imagine que **${topic}** est comme un outil : tu l'utilises pour résoudre un problème précis, pas pour tout mémoriser d'un coup.\n`;

  md += `\n### Ce que ton prof attend souvent\n`;
  md += `- Définir les termes clés\n`;
  md += `- Donner un exemple\n`;
  md += `- Faire le lien avec le chapitre précédent\n`;

  return md;
}

function simplify(s: string): string {
  return s
    .replace(/\b(néanmoins|toutefois|en effet|par conséquent)\b/gi, "donc")
    .replace(/\s+/g, " ")
    .trim();
}
