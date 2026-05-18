import type { Quiz } from "./types";

export const DEMO_QUIZ: Quiz = {
  title: "Algèbre linéaire — Matrices (démo)",
  questions: [
    {
      id: 1,
      prompt: "Quelle est la dimension d'une matrice qui a 3 lignes et 4 colonnes ?",
      options: ["3 × 4", "4 × 3", "12 × 1", "7 × 7"],
      correctIndex: 0,
    },
    {
      id: 2,
      prompt: "Le produit matriciel AB est défini si :",
      options: [
        "A et B ont la même taille",
        "le nombre de colonnes de A = le nombre de lignes de B",
        "A est carrée",
        "B est la transposée de A",
      ],
      correctIndex: 1,
    },
    {
      id: 3,
      prompt: "Une matrice identité I₃ a sur la diagonale :",
      options: ["des 0", "des 1", "des -1", "des valeurs aléatoires"],
      correctIndex: 1,
    },
    {
      id: 4,
      prompt: "det(A) = 0 signifie généralement que A est :",
      options: ["inversible", "symétrique", "non inversible (singulière)", "diagonale"],
      correctIndex: 2,
    },
    {
      id: 5,
      prompt: "La transposée de [[1,2],[3,4]] est :",
      options: [
        "[[1,3],[2,4]]",
        "[[1,2],[3,4]]",
        "[[4,3],[2,1]]",
        "[[2,1],[4,3]]",
      ],
      correctIndex: 0,
    },
    {
      id: 6,
      prompt: "Un système Ax = b admet une solution unique si :",
      options: [
        "A est quelconque",
        "det(A) ≠ 0 et A est carrée",
        "b = 0",
        "A a plus de lignes que de colonnes",
      ],
      correctIndex: 1,
    },
    {
      id: 7,
      prompt: "Le rang d'une matrice mesure :",
      options: [
        "son déterminant",
        "le nombre maximal de lignes (ou colonnes) linéairement indépendantes",
        "sa trace",
        "son nombre de zéros",
      ],
      correctIndex: 1,
    },
    {
      id: 8,
      prompt: "Eigenvalue λ vérifie :",
      options: ["Av = λv pour un vecteur v non nul", "A = λI", "det(A) = λ", "A⁻¹ = λ"],
      correctIndex: 0,
    },
  ],
};
