"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/content";
import { addPoints } from "@/lib/progress";
import { logAttempt } from "@/lib/report";
import { isBlank, matchesBlank } from "@/lib/blank";
import { speak, speaksOnTapOnly } from "@/lib/speech";
import { choiceLabel, englishAnswer, englishQuestion } from "@/lib/tell";
import { FillBlank } from "@/components/fill-blank";
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
  const scoreRef = useRef(0);

  useEffect(() => {
    setDeck([...questions]);
    setIndex(0);
    setPicked(null);
    scoreRef.current = 0;
    setScore(0);
    setFinished(false);
  }, [questions]);

  useEffect(() => {
    if (speaksOnTapOnly()) return;
    if (!deck || finished) return;
    const line = deck[index] ? englishQuestion(deck[index]) : "";
    if (line) speak(line);
  }, [deck, index, finished]);

  if (!deck) {
    return <p className="text-lg font-bold text-amber-800">Getting the questions ready...</p>;
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
          {great ? "Nice work. Play again, or try another game." : "That is fine. Listen to the answer, then try again."}
        </p>
        <Button
          className="mt-5 h-12 rounded-full px-6 text-base"
          onClick={() => {
            const next = shuffle(questions);
            setDeck(next);
            setIndex(0);
            setPicked(null);
            scoreRef.current = 0;
            setScore(0);
            setFinished(false);
            if (speaksOnTapOnly() && next[0]) speak(englishQuestion(next[0]));
          }}
        >
          Play again
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
          {isBlank(question) ? (
            <FillBlank
              key={question.id}
              question={question}
              picked={picked}
              onSubmit={(typed) => {
                if (picked) return;
                const ok = matchesBlank(question.answer, typed);
                setPicked(ok ? question.answer : typed);
                logAttempt({ id: question.id, skill: question.skill, prompt: question.prompt, ok });
                if (ok) {
                  scoreRef.current += 1;
                  setScore(scoreRef.current);
                  addPoints(10);
                  speak("Yes! " + englishAnswer(question));
                } else {
                  speak(englishAnswer(question));
                }
              }}
            />
          ) : (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold tracking-wide text-amber-700">Choose one answer</p>
              <h3 data-prompt={question.prompt} className="mt-2 text-2xl font-extrabold leading-snug text-stone-800" lang="en">
                {question.prompt}
              </h3>
            </div>
          )}
          <button
            type="button"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700"
            aria-label="Read the question"
            onClick={() => speak(englishQuestion(question))}
          >
            <Volume2 />
          </button>
        </div>
        <p className="mt-2 text-lg font-bold text-amber-950" data-ask>
          Say to him: {englishQuestion(question)}
        </p>
        <p className="mt-1 text-base text-stone-500">{question.hint}</p>
        {!isBlank(question) && (
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
                  logAttempt({ id: question.id, skill: question.skill, prompt: question.prompt, ok });
                  if (ok) {
                    scoreRef.current += 1;
                    setScore(scoreRef.current);
                    addPoints(10);
                    speak("Yes! " + englishAnswer(question));
                  } else {
                    speak(englishAnswer(question));
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
                {choiceLabel(choice) ? ` ${choiceLabel(choice)}` : ""}
              </button>
            );
          })}
        </div>
        )}
        {picked && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-4">
            <p className="text-lg font-extrabold text-amber-900">
              {correct ? "Yes!" : "Look at the correct answer."}
            </p>
            <div className="mt-1 flex items-start justify-between gap-3">
              <p className="text-lg font-extrabold text-amber-950" data-tell>
                Tell him: {englishAnswer(question)}
              </p>
              <button
                type="button"
                className="grid size-12 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700"
                aria-label="Say the answer"
                onClick={() => speak(englishAnswer(question))}
              >
                <Volume2 />
              </button>
            </div>
            <p className="mt-1 text-base text-stone-700">{question.explain}</p>
            <Button
              className="mt-3 h-11 rounded-full px-5"
              onClick={() => {
                if (index + 1 >= deck.length) {
                  setFinished(true);
                  onDone?.(scoreRef.current, deck.length);
                } else {
                  const next = index + 1;
                  setIndex(next);
                  setPicked(null);
                  if (speaksOnTapOnly()) speak(englishQuestion(deck[next]));
                }
              }}
            >
              {index + 1 >= deck.length ? "See the score" : "Next question"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
