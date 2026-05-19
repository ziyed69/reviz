/** Réponses basiques sans clé OpenAI (qualité limitée mais fonctionnel). */

export function localSummary(text: string, title: string): string {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.length > 80)
    .slice(0, 6);

  const intro = `## Résumé — ${title}\n\n*(Mode basique — ajoute OPENAI_API_KEY pour un résumé IA complet.)*\n\n`;
  if (blocks.length === 0) {
    return intro + "Texte trop court pour résumer. Utilise un PDF avec plus de contenu.";
  }

  return (
    intro +
    blocks
      .map((b, i) => `### Point ${i + 1}\n${b.slice(0, 400)}${b.length > 400 ? "…" : ""}`)
      .join("\n\n")
  );
}

export function localStudyPlan(title: string): string {
  return `## Plan de révision — ${title}

*(Mode basique — connecte l'IA pour un plan personnalisé.)*

| Jour | Objectif |
|------|----------|
| J-7 | Relire le cours une fois (survol 45 min) |
| J-6 | Résumé + notes manuscrites |
| J-5 | **Examens auto** sur Reviz (1ère session) |
| J-4 | Revoir les erreurs du QCM |
| J-3 | **Chat PDF** : poser 10 questions sur le flou |
| J-2 | 2e session examen + fiches |
| J-1 | Repos + relecture rapide du résumé |
| Jour J | Confiance — pas de nouveau contenu |`;
}
