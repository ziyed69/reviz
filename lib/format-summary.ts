/** Résumé structuré gratuit (sans API payante). */

function blocks(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.length >= 60);
}

function keywords(text: string, n = 8): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\wàâäéèêëïîôùûüç\s-]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
}

export function buildRichSummary(text: string, title: string): string {
  const parts = blocks(text);
  if (parts.length < 2) {
    return `## ${title}\n\nPas assez de contenu pour un résumé structuré. Essaie un PDF avec plus de texte.`;
  }

  const keys = keywords(text);
  const essentials = parts.slice(0, 4);
  const details = parts.slice(4, 7);

  let md = `## ${title}\n\n`;
  md += `### En bref\n`;
  md += essentials[0].slice(0, 280) + (essentials[0].length > 280 ? "…" : "") + "\n\n";

  md += `### Idées clés\n`;
  essentials.forEach((p, i) => {
    md += `- **Point ${i + 1}** — ${p.slice(0, 200)}${p.length > 200 ? "…" : ""}\n`;
  });

  if (keys.length) {
    md += `\n### Mots importants\n`;
    md += keys.map((k) => `- ${k}`).join("\n") + "\n";
  }

  if (details.length) {
    md += `\n### À approfondir\n`;
    details.forEach((p) => {
      md += `- ${p.slice(0, 160)}${p.length > 160 ? "…" : ""}\n`;
    });
  }

  md += `\n### Avant l'examen\n`;
  md += `- Relis les **mots importants**\n`;
  md += `- Fais un **QCM** et un **mode crash** si tu es pressé\n`;
  md += `- Utilise le **chat** pour tes zones floues\n`;

  return md;
}
