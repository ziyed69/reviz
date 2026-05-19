"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";

export function FlashcardsPlayer({ cards }: { cards: Flashcard[] }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);

  if (cards.length === 0) return null;

  const card = cards[i];

  return (
    <div className="flashcards">
      <p className="flash-meta">
        Carte {i + 1} / {cards.length}
      </p>
      <button type="button" className="flash-card" onClick={() => setFlip(!flip)}>
        <p className="flash-label">{flip ? "Réponse" : "Question"}</p>
        <p className="flash-text">{flip ? card.answer : card.question}</p>
      </button>
      <div className="flash-actions">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={i === 0}
          onClick={() => {
            setI(i - 1);
            setFlip(false);
          }}
        >
          Précédent
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (i + 1 < cards.length) {
              setI(i + 1);
              setFlip(false);
            }
          }}
        >
          {i + 1 >= cards.length ? "Terminé" : "Suivant"}
        </button>
      </div>
    </div>
  );
}
