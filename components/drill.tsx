"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/content";
import { addPoints } from "@/lib/progress";
import { speak } from "@/lib/speech";
import { Volume2 } from "lucide-react";

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function Drill({
  title,
  questions,
  onDone,
}: {
  title: string;
  questions: Question[];
  onDone?: (score: number, total: number) => void;
}) {
  const [deck, setDeck] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setDeck(shuffle(questions));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  }, [questions]);

  useEffect(() => {
    if (!deck || finished) return;
    const line = deck[index]?.speak ?? deck[index]?.prompt;
    if (line) speak(line);
  }, [deck, index, finished]);

  if (!deck) {
    return <p className="text-lg font-bold text-amber-800">準備題目…</p>;
  }

  if (finished) {
    const total = deck.length;
    const great = score >= Math.ceil(total * 0.75);
    return (
      <section className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-amber-100">
        <p className="text-5xl">{great ? "🌟" : "💪"}</p>
        <h2 className="mt-2 text-3xl font-extrabold text-amber-900">
          {score} / {total}
        </h2>
        <p className="mt-2 text-lg text-stone-600">
          {great ? "好叻！可以再玩一次，或者轉另一個遊戲。" : "未緊要，再聽一次答案，然後再試。"}
        </p>
        <Button
          className="mt-5 h-12 rounded-full px-6 text-base"
          onClick={() => {
            setDeck(shuffle(questions));
            setIndex(0);
            setPicked(null);
            setScore(0);
            setFinished(false);
          }}
        >
          再玩一次
        </Button>
      </section>
    );
  }

  const question = deck[index];
  const correct = picked === question.answer;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-amber-900">{title}</h2>
        <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
          {index + 1} / {deck.length}
        </p>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
        <p className="text-sm font-bold text-amber-700">Unit {question.unit}</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h3 className="text-2xl font-extrabold leading-snug text-stone-800" lang="en">
            {question.prompt}
          </h3>
          <button
            type="button"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700"
            aria-label="讀出題目"
            onClick={() => speak(question.speak ?? question.prompt)}
          >
            <Volume2 />
          </button>
        </div>
        <p className="mt-2 text-base text-stone-500">{question.hint}</p>
        <div className="mt-4 grid gap-3">
          {question.choices.map((choice) => {
            const chosen = picked === choice;
            const show = picked !== null;
            const isAnswer = choice === question.answer;
            return (
              <button
                key={choice}
                type="button"
                disabled={picked !== null}
                lang="en"
                onClick={() => {
                  setPicked(choice);
                  const ok = choice === question.answer;
                  if (ok) {
                    setScore((value) => value + 1);
                    addPoints(10);
                    speak("Yes! " + choice);
                  } else {
                    speak("The answer is " + question.answer);
                  }
                }}
                className={`min-h-14 rounded-2xl border-2 px-4 py-3 text-left text-lg font-bold transition ${
                  show && isAnswer
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : show && chosen
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : "border-amber-100 bg-amber-50/60 text-stone-800 hover:border-amber-300"
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-4">
            <p className="text-lg font-extrabold text-amber-900">
              {correct ? "啱！" : "睇返正確答案。"}
            </p>
            <p className="mt-1 text-base text-stone-700">{question.explain}</p>
            <Button
              className="mt-3 h-11 rounded-full px-5"
              onClick={() => {
                if (index + 1 >= deck.length) {
                  const finalScore = score;
                  setFinished(true);
                  onDone?.(finalScore, deck.length);
                } else {
                  setIndex((value) => value + 1);
                  setPicked(null);
                }
              }}
            >
              {index + 1 >= deck.length ? "睇分數" : "下一題"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
