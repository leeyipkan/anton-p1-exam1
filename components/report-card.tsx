"use client";

import { useEffect, useState } from "react";
import { readAttempts, skillInfo, summarize, type AttemptSkill, type Summary } from "@/lib/report";

export function ReportCard({ focus }: { focus?: AttemptSkill }) {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const sync = () => setSummary(summarize(readAttempts()));
    sync();
    window.addEventListener("sunny-points", sync);
    return () => window.removeEventListener("sunny-points", sync);
  }, []);

  if (!summary) return null;

  if (summary.tries === 0) {
    return (
      <section className="rounded-[1.6rem] bg-white p-5 text-left shadow-sm ring-1 ring-amber-100">
        <h2 className="text-2xl font-extrabold text-stone-900">Score report</h2>
        <p className="mt-2 text-lg text-stone-600">
          Finish a level. This page shows which question types feel familiar and which are easy to miss.
        </p>
      </section>
    );
  }

  const focusStat = focus ? summary.skills.find((item) => item.skill === focus) : null;

  return (
    <section className="space-y-4 text-left">
      <div className="rounded-[1.6rem] bg-white p-5 shadow-sm ring-1 ring-amber-100">
        <h2 className="text-2xl font-extrabold text-stone-900">Score report</h2>
        <p className="mt-1 text-lg font-bold text-stone-600">
          {summary.tries} tries, {summary.correct} correct.
        </p>
        {focusStat && focusStat.tries > 0 && (
          <p className="mt-2 rounded-2xl bg-amber-50 px-3 py-2 font-bold text-amber-950">
            So far, {focusStat.label}: {focusStat.correct} correct out of {focusStat.tries}.
          </p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <article className="rounded-[1.6rem] bg-emerald-50 p-5">
          <p className="text-sm font-extrabold text-emerald-800">Most familiar</p>
          {summary.familiar ? (
            <>
              <h3 className="mt-1 text-2xl font-extrabold text-emerald-950">
                {summary.familiar.emoji} {summary.familiar.label}
              </h3>
              <p className="mt-1 text-lg font-bold text-emerald-900">
                {summary.familiar.correct} correct out of {summary.familiar.tries}
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg font-bold text-emerald-900">
              No clear strength yet. Play a few more levels.
            </p>
          )}
        </article>
        <article className="rounded-[1.6rem] bg-rose-50 p-5">
          <p className="text-sm font-extrabold text-rose-800">Needs more practice</p>
          {summary.shaky ? (
            <>
              <h3 className="mt-1 text-2xl font-extrabold text-rose-950">
                {summary.shaky.emoji} {summary.shaky.label}
              </h3>
              <p className="mt-1 text-lg font-bold text-rose-900">
                {summary.shaky.tries - summary.shaky.correct} misses out of {summary.shaky.tries}
              </p>
              <p className="mt-2 text-base font-semibold text-rose-950">{summary.shaky.tip}</p>
            </>
          ) : (
            <p className="mt-2 text-lg font-bold text-rose-900">
              No shaky type yet. The levels you played look solid.
            </p>
          )}
        </article>
      </div>

      <div className="rounded-[1.6rem] bg-white p-5 shadow-sm ring-1 ring-amber-100">
        <h3 className="text-xl font-extrabold text-stone-900">Every type</h3>
        <ul className="mt-3 space-y-3">
          {summary.skills.map((item) => (
            <li key={item.skill}>
              <div className="flex items-center justify-between gap-3 text-base font-extrabold">
                <span>
                  {item.emoji} {item.label}
                </span>
                <span className="text-stone-500">
                  {item.tries === 0 ? "not played" : `${item.correct}/${item.tries}`}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full ${item.skill === summary.shaky?.skill ? "bg-rose-400" : "bg-emerald-400"}`}
                  style={{ width: item.tries === 0 ? "0%" : `${Math.round(item.rate * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {summary.missed.length > 0 && (
        <div className="rounded-[1.6rem] bg-white p-5 shadow-sm ring-1 ring-rose-100">
          <h3 className="text-xl font-extrabold text-stone-900">Missed most often</h3>
          <ul className="mt-3 space-y-3">
            {summary.missed.map((item) => (
              <li key={item.id} className="rounded-2xl bg-rose-50 px-4 py-3">
                <p className="text-sm font-extrabold text-rose-700">
                  {skillInfo[item.skill].label} · missed {item.misses} {item.misses === 1 ? "time" : "times"}
                </p>
                <p className="mt-1 text-lg font-extrabold text-stone-900" lang="en">
                  {item.prompt}
                </p>
                {item.explain && <p className="mt-1 text-base text-stone-600">{item.explain}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
