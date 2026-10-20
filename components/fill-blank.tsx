"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/content";
import { matchesBlank } from "@/lib/blank";
import { choiceLabel } from "@/lib/tell";

export function FillBlank({
  question,
  picked,
  onSubmit,
}: {
  question: Question;
  picked: string | null;
  onSubmit: (typed: string) => void;
}) {
  const [value, setValue] = useState("");
  const [before, after] = question.prompt.split("___");
  const locked = picked !== null;
  const shown = locked ? picked : value;
  const right = locked && matchesBlank(question.answer, picked);
  const mark = choiceLabel(question.answer);

  return (
    <form
      className="min-w-0 flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        if (locked) return;
        const typed = value.trim().replace(/\s+/g, " ");
        if (!typed) return;
        onSubmit(typed);
      }}
    >
      <p className="text-sm font-extrabold tracking-wide text-amber-700">Fill in the blank</p>
      <h2
        data-prompt={question.prompt}
        lang="en"
        className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-3 text-2xl font-extrabold leading-snug text-stone-900"
      >
        {before && <span>{before}</span>}
        <input
          aria-label="Missing word"
          value={shown}
          disabled={locked}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => setValue(event.target.value)}
          style={{ width: `${Math.max(6, shown.length + 1)}ch` }}
          className={`max-w-full rounded-xl border-b-4 bg-white px-2 py-1 text-center outline-none disabled:opacity-100 ${
            !locked ? "border-amber-400" : right ? "border-emerald-500 text-emerald-800" : "border-rose-400 text-rose-700"
          }`}
        />
        {after && <span>{after}</span>}
      </h2>
      {locked && (
        <p className="mt-3 text-lg font-extrabold text-emerald-800">
          {mark ? "The missing mark is" : "The missing word is"} <span data-filled>{question.answer}</span>
          {mark ? ` ${mark}` : ""}.
        </p>
      )}
      {!locked && (
        <Button type="submit" className="mt-4 h-12 rounded-full px-6 text-base" disabled={!value.trim()}>
          Check the gap
        </Button>
      )}
    </form>
  );
}
