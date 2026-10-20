"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { units, type UnitId } from "@/lib/content";
import { speak } from "@/lib/speech";

export default function LearnPage() {
  const [unitId, setUnitId] = useState<UnitId>(1);
  const [open, setOpen] = useState<string | null>(null);
  const unit = units.find((item) => item.id === unitId) ?? units[0];

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-extrabold text-sky-700">Listen, then say it</p>
        <h1 className="text-4xl font-extrabold text-stone-900">Words and patterns</h1>
      </header>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {units.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setUnitId(item.id);
              setOpen(null);
            }}
            className={`rounded-2xl px-3 py-3 text-left font-extrabold ${
              item.id === unitId ? "bg-sky-500 text-white" : "bg-white text-stone-700 ring-1 ring-sky-100"
            }`}
          >
            Unit {item.id}
            <span className="mt-0.5 block text-sm font-semibold opacity-80">{item.zh}</span>
          </button>
        ))}
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        {unit.words.map((word) => {
          const shown = open === word.en;
          return (
            <article key={word.en} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-sky-100">
              <div className="flex items-center justify-between gap-3">
                <span className="text-5xl" aria-hidden>
                  {word.emoji}
                </span>
                <button
                  type="button"
                  className="grid size-12 place-items-center rounded-full bg-sky-100 text-sky-700"
                  aria-label={`Say ${word.en}`}
                  onClick={() => speak(word.say)}
                >
                  <Volume2 />
                </button>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold text-stone-900" lang="en">
                {word.en}
              </h2>
              <p className="text-lg text-stone-500">{word.zh}</p>
              <button
                type="button"
                className="mt-3 text-sm font-extrabold text-sky-700"
                onClick={() => {
                  setOpen(shown ? null : word.en);
                  speak(word.en.split("").join(" "));
                }}
              >
                {shown ? word.en.split("").join("-").toUpperCase() : "Spell it"}
              </button>
            </article>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-stone-900">Patterns</h2>
        {unit.patterns.map((pattern) => (
          <article key={pattern.en} className="rounded-3xl bg-white p-4 ring-1 ring-amber-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-amber-700">{pattern.title}</p>
                <p className="text-xl font-extrabold text-stone-900" lang="en">
                  {pattern.en}
                </p>
                <p className="text-stone-500">{pattern.zh}</p>
              </div>
              <button
                type="button"
                className="grid size-12 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-800"
                aria-label="Say the pattern"
                onClick={() => speak(pattern.examples[0] ?? pattern.en)}
              >
                <Volume2 />
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-stone-700">
              {pattern.examples.map((example) => (
                <li key={example} lang="en">
                  {example}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-stone-900">Letter sounds</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {unit.phonics.map((item) => (
            <button
              key={item.sound}
              type="button"
              onClick={() => speak(`${item.sound}. ${item.words.join(", ")}`)}
              className="rounded-3xl bg-emerald-50 p-4 text-left"
            >
              <p className="text-3xl font-extrabold text-emerald-800" lang="en">
                {item.sound}
              </p>
              <p className="mt-1 text-sm font-bold text-emerald-700">{item.zh}</p>
              <p className="mt-2 text-lg font-bold text-stone-800" lang="en">
                {item.words.join(" · ")}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
