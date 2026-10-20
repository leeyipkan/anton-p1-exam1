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
        <p className="text-sm font-extrabold text-rose-600">8 題 · Unit 1、2、4 混合</p>
        <h1 className="mt-1 text-4xl font-extrabold text-stone-900">模擬小測</h1>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-stone-600">
          每題答啱加 10 分。八題全對再加 20 分，可以解鎖獎勵。聽唔到英文，就請家長讀出題目。
        </p>
        <Button
          className="mt-5 h-12 rounded-full px-6 text-base"
          onClick={() => {
            setDeck(sample());
            setLast(null);
            setStarted(true);
          }}
        >
          開始
        </Button>
        {last !== null && (
          <div className="mt-6 space-y-3 text-left">
            <p className="text-lg font-bold text-stone-700">上次呢一輪：{last}/8</p>
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
        title="模擬小測"
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
