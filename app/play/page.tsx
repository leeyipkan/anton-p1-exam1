"use client";

import { useMemo, useState } from "react";
import { Drill } from "@/components/drill";
import { Button } from "@/components/ui/button";
import { games, questions, rhyme, type Skill } from "@/lib/content";
import { addStars } from "@/lib/progress";
import { speak } from "@/lib/speech";

export default function PlayPage() {
  const [skill, setSkill] = useState<Skill | "rhyme" | null>(null);
  const selected = games.find((game) => game.skill === skill);
  const deck = useMemo(
    () => (skill && skill !== "rhyme" ? questions.filter((item) => item.skill === skill) : []),
    [skill],
  );

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-extrabold text-emerald-700">揀一個遊戲</p>
        <h1 className="text-4xl font-extrabold text-stone-900">練習</h1>
        <p className="mt-2 text-lg text-stone-600">撳答案之前可以撳喇叭聽。答啱會加一粒星。</p>
      </header>

      {skill === null && (
        <div className="grid gap-3 sm:grid-cols-2">
          {games.map((game) => (
            <button
              key={game.skill}
              type="button"
              onClick={() => setSkill(game.skill)}
              className="rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-emerald-100"
            >
              <span className="text-4xl">{game.emoji}</span>
              <span className="mt-2 block text-2xl font-extrabold text-stone-900" lang="en">
                {game.title}
              </span>
              <span className="mt-1 block text-stone-600">{game.zh}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSkill("rhyme")}
            className="rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-emerald-100"
          >
            <span className="text-4xl">🎵</span>
            <span className="mt-2 block text-2xl font-extrabold text-stone-900">Rhyme order</span>
            <span className="mt-1 block text-stone-600">將童謠五句排返 1 至 5</span>
          </button>
        </div>
      )}

      {skill && skill !== "rhyme" && selected && (
        <div className="space-y-3">
          <Button variant="outline" className="h-10 rounded-full" onClick={() => setSkill(null)}>
            返回遊戲列表
          </Button>
          <Drill key={skill} title={selected.title} questions={deck} />
        </div>
      )}

      {skill === "rhyme" && (
        <div className="space-y-3">
          <Button variant="outline" className="h-10 rounded-full" onClick={() => setSkill(null)}>
            返回遊戲列表
          </Button>
          <RhymeOrder />
        </div>
      )}
    </div>
  );
}

function RhymeOrder() {
  const [pool, setPool] = useState(() => [...rhyme].sort(() => Math.random() - 0.5));
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked.every((line, index) => line === rhyme[index]);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
      <h2 className="text-2xl font-extrabold text-stone-900">按次序撳句子</h2>
      <p className="mt-1 text-stone-600">One, two 開始，Nine, ten 收尾。</p>
      <ol className="mt-4 space-y-2">
        {picked.map((line, index) => (
          <li key={line} lang="en" className="rounded-2xl bg-emerald-50 px-4 py-3 text-lg font-bold">
            {index + 1}. {line}
          </li>
        ))}
        {picked.length === 0 && <li className="text-stone-400">未揀句子</li>}
      </ol>
      <div className="mt-4 grid gap-2">
        {pool.map((line) => (
          <button
            key={line}
            type="button"
            lang="en"
            disabled={checked}
            onClick={() => {
              speak(line);
              setPool((items) => items.filter((item) => item !== line));
              setPicked((items) => [...items, line]);
            }}
            className="rounded-2xl bg-amber-50 px-4 py-3 text-left text-lg font-bold text-stone-800"
          >
            {line}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          className="h-11 rounded-full"
          disabled={picked.length !== rhyme.length || checked}
          onClick={() => {
            setChecked(true);
            const ok = picked.every((line, index) => line === rhyme[index]);
            if (ok) addStars(3);
            speak(ok ? "Yes! Good order." : "Let us try the rhyme again.");
          }}
        >
          檢查
        </Button>
        <Button
          variant="outline"
          className="h-11 rounded-full"
          onClick={() => {
            setPool([...rhyme].sort(() => Math.random() - 0.5));
            setPicked([]);
            setChecked(false);
          }}
        >
          重置
        </Button>
      </div>
      {checked && (
        <p className="mt-3 text-lg font-extrabold text-emerald-800">
          {correct ? "次序啱晒。" : "未啱。重置後再聽一次：One two 係 glue，Nine ten 係 pen。"}
        </p>
      )}
    </section>
  );
}
