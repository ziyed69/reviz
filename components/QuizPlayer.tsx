"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types";
import Link from "next/link";

type Props = {
  quiz: Quiz;
  onReset?: () => void;
  onWrong?: (items: { prompt: string; correct: string; chosen?: string }[]) => void;
};

export function QuizPlayer({ quiz, onReset, onWrong }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [wrongs, setWrongs] = useState<{ prompt: string; correct: string; chosen?: string }[]>([]);

  const q = quiz.questions[index];
  const progress = ((index + (answered ? 1 : 0)) / quiz.questions.length) * 100;

  function pick(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    if (optionIndex === q.correctIndex) {
      setScore((s) => s + 1);
    } else {
      setWrongs((w) => [
        ...w,
        {
          prompt: q.prompt,
          correct: q.options[q.correctIndex],
          chosen: q.options[optionIndex],
        },
      ]);
    }
  }

  function next() {
    if (index + 1 >= quiz.questions.length) {
      setDone(true);
      setWrongs((w) => {
        onWrong?.(w);
        return w;
      });
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  }

  if (done) {
    return (
      <div className="card score-box">
        <h2>
          {score}/{quiz.questions.length}
        </h2>
        <p style={{ color: "var(--muted)", margin: "1rem 0" }}>
          {score === quiz.questions.length
            ? "Parfait — tu maîtrises ce cours."
            : score >= quiz.questions.length * 0.7
              ? "Bien joué — refais les questions ratées."
              : "Continue — relis le cours et réessaie."}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {onReset && (
            <button type="button" className="btn btn-primary" onClick={onReset}>
              Nouveau cours
            </button>
          )}
          <Link href="/app" className="btn btn-ghost">
            Upload un autre PDF
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <p style={{ color: "var(--muted)", marginBottom: "0.25rem" }}>{quiz.title}</p>
      <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1rem" }}>
        Question {index + 1} / {quiz.questions.length}
      </p>
      <div className="progress-bar">
        <span
          style={{
            display: "block",
            height: "100%",
            width: `${progress}%`,
            background: "var(--accent)",
            borderRadius: 99,
          }}
        />
      </div>
      <h2 style={{ fontSize: "1.15rem", margin: "1.25rem 0" }}>{q.prompt}</h2>
      <div>
        {q.options.map((opt, i) => {
          let cls = "quiz-option";
          if (answered) {
            if (i === q.correctIndex) cls += " correct";
            else if (i === selected) cls += " wrong";
          } else if (i === selected) cls += " selected";
          return (
            <button key={i} type="button" className={cls} onClick={() => pick(i)}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <button type="button" className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={next}>
          {index + 1 >= quiz.questions.length ? "Voir mon score" : "Question suivante"}
        </button>
      )}
    </div>
  );
}


