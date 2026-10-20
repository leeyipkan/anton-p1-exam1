"use client";

import { useState } from "react";
import { Drill } from "@/components/drill";
import { ReportCard } from "@/components/report-card";
import { Button } from "@/components/ui/button";
import { questions } from "@/lib/content";
import { addPoints, writeProgress, readProgress } from "@/lib/progress";

function sample() {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 8);
}

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [deck, setDeck] = useState(sample);
  const [last, setLast] = useState<number | null>(null);

  if (!started) {
    return (
      <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-rose-100">
        <p className="text-sm font-extrabold text-rose-600">8 questions · Units 1, 2, and 4 mixed</p>
        <h1 className="mt-1 text-4xl font-extrabold text-stone-900">Practice quiz</h1>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-stone-600">
          Each correct answer adds 10 points. A perfect 8 adds 20 more and can unlock a reward. If the speaker is quiet, a parent can read the question aloud.
        </p>
        <Button
          className="mt-5 h-12 rounded-full px-6 text-base"
          onClick={() => {
            setDeck(sample());
            setLast(null);
            setStarted(true);
          }}
        >
          {last === null ? "Start" : "Play again"}
        </Button>
        {last !== null && (
          <div className="mt-6 space-y-3 text-left">
            <p className="text-lg font-bold text-stone-700">This round: {last}/8</p>
            <p className="text-lg text-stone-600">
              {last >= 6
                ? "Nice work. Play again, or try another game."
                : "That is fine. Listen to the answer, then try again."}
            </p>
            {last === 8 && <p className="text-lg font-extrabold text-amber-800">Perfect round +20 points</p>}
            <ReportCard />
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <Drill
        key={deck.map((item) => item.id).join("-")}
        title="Practice quiz"
        questions={deck}
        onDone={(score) => {
          setLast(score);
          const best = Math.max(readProgress().bestQuiz, score);
          writeProgress({ bestQuiz: best });
          if (score === 8) addPoints(20);
          setStarted(false);
        }}
      />
    </div>
  );
}
