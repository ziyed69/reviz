const ATS_KEYWORDS = [
  "expérience",
  "compétence",
  "projet",
  "formation",
  "résultat",
  "équipe",
  "analyse",
  "développement",
  "communication",
  "python",
  "javascript",
  "gestion",
  "stage",
  "alternance",
];

export type CvResult = {
  score: number;
  matching: string[];
  missing: string[];
  cvOptimized: string;
  letter: string;
  tips: string[];
};

function extractJobKeywords(offer: string): string[] {
  const words = offer
    .toLowerCase()
    .replace(/[^\wàâäéèêëïîôùûüç\s-]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
  return [...new Set(words)].slice(0, 40);
}

export function analyzeCv(cv: string, jobOffer: string): CvResult {
  const cvLow = cv.toLowerCase();
  const offerLow = jobOffer.toLowerCase();
  const jobKeys = extractJobKeywords(jobOffer);

  const matching: string[] = [];
  const missing: string[] = [];

  for (const k of jobKeys) {
    if (cvLow.includes(k)) matching.push(k);
    else if (offerLow.includes(k) && k.length >= 5) missing.push(k);
  }

  const baseScore = Math.min(95, 35 + matching.length * 4);
  const hasEmail = /@/.test(cv);
  const hasPhone = /\+?\d{8,}/.test(cv);
  const score = Math.min(98, baseScore + (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0));

  const skillsLine = missing.slice(0, 6).join(", ");
  const cvOptimized =
    cv.trim() +
    (skillsLine
      ? `\n\n---\nCompétences alignées offre : ${skillsLine}\nRésultats chiffrés : [ajoute 1-2 metrics]\n`
      : "");

  const letter = `Madame, Monsieur,

Je candidate au poste mentionné dans votre offre. Mon parcours en formation et mes projets m'ont permis de développer : ${matching.slice(0, 5).join(", ") || "des compétences adaptées à votre besoin"}.

${missing.length ? `Je mets en avant mon intérêt pour : ${missing.slice(0, 4).join(", ")}.` : ""}

Motivé(e) et disponible, je serais ravi(e) d'échanger avec vous.

Cordialement,
[Ton prénom]`;

  const tips = [
    score < 60 ? "Ajoute des mots-clés de l'offre dans ton CV." : "Bon alignement — personnalise encore l'accroche.",
    "Utilise des verbes d'action : développer, analyser, concevoir.",
    "1 chiffre par expérience (%, temps gagné, users…).",
    missing.length ? `Mots absents du CV : ${missing.slice(0, 8).join(", ")}` : "Bonne couverture des mots-clés.",
  ];

  return { score, matching: matching.slice(0, 15), missing: missing.slice(0, 12), cvOptimized, letter, tips };
}
