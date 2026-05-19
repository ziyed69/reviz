import { buildRichSummary } from "../format-summary";

export function buildCrashPlan(text: string, title: string, days = 3): string {
  const summary = buildRichSummary(text, title);

  const schedule =
    days === 3
      ? `| Jour | Focus | Durée |
|------|--------|-------|
| J-3 | Survol + résumé express + 1er QCM | 2h |
| J-2 | QCM + flashcards + erreurs | 2h |
| J-1 | Re-QCM + fiche 10 mots + repos | 1h30 |`
      : `| Jour | Focus |
|------|--------|
| J-7 à J-4 | 45 min/jour : lecture active |
| J-3 à J-2 | QCM + corrections |
| J-1 | Relecture résumé uniquement |`;

  return `## Mode survie — examen dans ${days} jours
**Cours :** ${title}

### Priorités (80/20)
1. Maîtrise les **idées clés** du résumé ci-dessous
2. Fais **2 sessions QCM** (aujourd'hui + demain)
3. Ne apprends pas tout — vise les **points récurrents**

### Planning
${schedule}

### Résumé express
${summary}

### Checklist jour J
- [ ] 10 mots importants relus
- [ ] 15 min QCM express
- [ ] Dormir 7h minimum`;
}
