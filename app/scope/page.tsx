"use client";

import { useEffect, useState } from "react";
import { checklist, rhyme, units } from "@/lib/content";

const STORAGE = "sunny-class-checklist";

const tones = ["bg-amber-50", "bg-sky-50", "bg-emerald-50"];

export default function ScopePage() {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const known = new Set(checklist.map((item) => item.id));
      setDone(parsed.filter((id): id is string => typeof id === "string" && known.has(id)));
    } catch {
      setDone([]);
    }
  }, []);

  function toggle(id: string) {
    const next = done.includes(id) ? done.filter((item) => item !== id) : [...done, id];
    setDone(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
  }

  return (
    <article className="space-y-6">
      <header>
        <p className="text-sm font-extrabold text-amber-700">For parents</p>
        <h1 className="mt-1 text-4xl font-extrabold text-stone-900">What this English exam covers</h1>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-stone-600">
          Revise Unit 1 Getting to know you, Unit 2 People at my school, and Unit 4 In my school bag. Chapter 3 is out of this exam. The Unit 5 and Unit 6 preview on page 42 is the next chapter, not this paper.
        </p>
      </header>

      <div className="grid gap-4">
        {units.map((unit, index) => (
          <section key={unit.id} className={`rounded-3xl p-5 ${tones[index]}`}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold text-stone-900">
                Unit {unit.id} {unit.title}
              </h2>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-stone-600">
                {unit.zh}
              </span>
            </div>
            <p className="mt-2 leading-relaxed text-stone-700">{unit.story}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {unit.words.map((word) => (
                <span
                  key={word.en}
                  lang="en"
                  className="rounded-full bg-white px-3 py-1 text-sm font-bold text-stone-700"
                >
                  {word.emoji} {word.en}
                </span>
              ))}
            </div>
            <ul className="mt-3 space-y-1 text-stone-700">
              {unit.patterns.map((pattern) => (
                <li key={pattern.en}>
                  <span className="font-extrabold">{pattern.title}: </span>
                  <span lang="en">{pattern.en}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
        <h2 className="text-2xl font-extrabold text-stone-900">How the paper usually asks</h2>
        <ul className="mt-3 grid gap-2 text-base leading-relaxed text-stone-700 md:grid-cols-2">
          <li className="rounded-2xl bg-stone-50 p-3">Listening: circle the word you hear, or pick the sound.</li>
          <li className="rounded-2xl bg-stone-50 p-3">Choice: after a short story, pick the best answer.</li>
          <li className="rounded-2xl bg-stone-50 p-3">Fill the gap: This is ___. He is our ___.</li>
          <li className="rounded-2xl bg-stone-50 p-3">Phonics: hear a word and circle h / m / y, b / g / t, or p / k / -en.</li>
          <li className="rounded-2xl bg-stone-50 p-3">Grammar: I am / He is / She is / We are; I have / He has; a / an.</li>
          <li className="rounded-2xl bg-stone-50 p-3">Writing: a birthday card, a person sentence with capitals and a full stop, and a speech bubble.</li>
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
        <h2 className="text-2xl font-extrabold text-stone-900">Rhyme order</h2>
        <p className="mt-1 text-stone-600">Unit 4 asks you to put the pictures in rhyme order, 1 to 5. The last word of each line rhymes.</p>
        <ol className="mt-3 space-y-2">
          {rhyme.map((line, index) => (
            <li key={line} lang="en" className="rounded-2xl bg-emerald-50 px-4 py-2 text-lg font-bold text-emerald-950">
              {index + 1}. {line}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
        <h2 className="text-2xl font-extrabold text-stone-900">
          Revision list {done.length}/{checklist.length}
        </h2>
        <ul className="mt-3 space-y-2">
          {checklist.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-amber-50/70 px-3 py-3 text-base">
                <input
                  type="checkbox"
                  className="mt-1 size-5"
                  checked={done.includes(item.id)}
                  onChange={() => toggle(item.id)}
                />
                <span>{item.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-stone-800 p-5 text-stone-50">
        <h2 className="text-2xl font-extrabold">The night before</h2>
        <p className="mt-2 leading-relaxed text-stone-200">
          Do not start a new unit. Spend ten minutes on the word cards, then five minutes saying What is your name?, How old are you?, This is ... She is my classmate., and I have a pen. / She has an eraser. Finish with one birthday card. Read the correct sentence again. Skip extra copying.
        </p>
      </section>
    </article>
  );
}
