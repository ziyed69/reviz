export type ReportType = "stage" | "memoire" | "projet";

export function buildReport(type: ReportType, subject: string, context: string): string {
  const intro =
    type === "stage"
      ? "rapport de stage"
      : type === "memoire"
        ? "mémoire"
        : "rapport de projet";

  const ctx = context.slice(0, 1500);

  return `## Plan — ${intro}
**Sujet :** ${subject}

### Introduction
- Contexte de l'entreprise / du projet
- Problématique : *${subject}*
- Objectifs du ${intro}
- Méthodologie annoncée

### Problématique
> Comment ${subject.toLowerCase()} ?

Questions dérivées :
- Quel est l'enjeu principal ?
- Quelles contraintes (temps, ressources, technique) ?

### Chapitre 1 — Contexte
- Présentation du cadre
- État de l'art (3–5 sources)
- Extrait utile du cours :
${ctx ? `\n> ${ctx.slice(0, 400)}…\n` : ""}

### Chapitre 2 — Réalisation
- Ce que tu as fait concrètement
- Outils / méthodes utilisés
- Difficultés rencontrées

### Chapitre 3 — Résultats
- Livrables
- Indicateurs / preuves
- Analyse critique

### Conclusion
- Bilan des objectifs
- Limites du travail
- Ouverture / perspectives

### Annexes (si demandé)
- Grilles, captures, code, questionnaires

---
*Généré par Reviz — complète chaque section avec tes vraies données.*`;
}
