"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { questions, rhyme, type Question, type Skill } from "@/lib/content";
import { addStars } from "@/lib/progress";
import { speak } from "@/lib/speech";

type Mood = "idle" | "happy" | "silly";

type Level = {
  id: string;
  skill?: Skill;
  rhyme?: boolean;
  emoji: string;
  title: string;
  blurb: string;
  color: string;
};

const levels: Level[] = [
  {
    id: "hello",
    skill: "greetings",
    emoji: "🎂",
    title: "生日課室",
    blurb: "蛋糕自己跳緊舞。快啲講 Good morning！",
    color: "bg-amber-200",
  },
  {
    id: "people",
    skill: "people",
    emoji: "🎂👩‍🏫",
    title: "蛋糕帽老師",
    blurb: "老師戴住生日帽。分清 He、She、We。",
    color: "bg-sky-200",
  },
  {
    id: "bag",
    skill: "bag",
    emoji: "🎒🐱",
    title: "書包大逃亡",
    blurb: "擦膠同鉛筆想逃。用 have、has、a、an 捉返佢哋。",
    color: "bg-emerald-200",
  },
  {
    id: "sound",
    skill: "phonics",
    emoji: "🤡",
    title: "字母馬戲",
    blurb: "h、m、y、b、g、t、p、k 上台表演。",
    color: "bg-rose-200",
  },
  {
    id: "marks",
    skill: "marks",
    emoji: "💥",
    title: "標點打交",
    blurb: "問號同感嘆號喺度嘈。揀啱符號先停到。",
    color: "bg-violet-200",
  },
  {
    id: "rhyme",
    rhyme: true,
    emoji: "🥁",
    title: "踩地板童謠",
    blurb: "One, two 開始，Nine, ten 收尾。",
    color: "bg-orange-200",
  },
];

const cheers = [
  "叮！蛋糕飛出嚟！",
  "Wow! You are great!",
  "Super Boy 飛起咗！",
  "鉛筆拍手掌！",
];

const oops = [
  "哎呀，擦膠自己走去玩。",
  "Oh no! 蛋糕滑走咗。",
  "差少少，綠色先係答案。",
  "鉛筆喺度笑你，再睇一次。",
];

const SAVE = "sunny-dash-best";

function readBest(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(SAVE) || "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

function writeBest(id: string, score: number) {
  const current = readBest();
  current[id] = Math.max(current[id] ?? 0, score);
  localStorage.setItem(SAVE, JSON.stringify(current));
  return current;
}

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick(lines: string[]) {
  return lines[Math.floor(Math.random() * lines.length)];
}

let audio: AudioContext | null = null;

function tone(freq: number, at: number, dur: number, type: OscillatorType) {
  const Context = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return;
  if (!audio) audio = new Context();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, audio.currentTime + at);
  gain.gain.exponentialRampToValueAtTime(0.06, audio.currentTime + at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + at + dur);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(audio.currentTime + at);
  osc.stop(audio.currentTime + at + dur);
}

function playYes() {
  tone(523, 0, 0.12, "square");
  tone(659, 0.1, 0.12, "square");
  tone(784, 0.2, 0.18, "square");
}

function playNo() {
  tone(196, 0, 0.22, "triangle");
}

export function DashGame() {
  const [best, setBest] = useState<Record<string, number>>({});
  const [level, setLevel] = useState<Level | null>(null);
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [mood, setMood] = useState<Mood>("idle");
  const [burst, setBurst] = useState<string | null>(null);
  const [clearScore, setClearScore] = useState<number | null>(null);

  useEffect(() => {
    setBest(readBest());
  }, []);

  useEffect(() => {
    if (!level || level.rhyme || clearScore !== null || !deck[index] || picked) return;
    speak(deck[index].speak ?? deck[index].prompt);
  }, [level, deck, index, picked, clearScore]);

  function openLevel(next: Level) {
    setLevel(next);
    setClearScore(null);
    setMood("idle");
    setBurst(null);
    setPicked(null);
    setScore(0);
    setIndex(0);
    if (next.skill) {
      const pool = questions.filter((item) => item.skill === next.skill);
      setDeck(shuffle(pool).slice(0, Math.min(5, pool.length)));
    } else {
      setDeck([]);
    }
  }

  function finish(finalScore: number, total: number) {
    if (!level) return;
    const saved = writeBest(level.id, finalScore);
    setBest(saved);
    setClearScore(finalScore);
    setBurst(finalScore === total ? "You can fly now!" : "再玩一次，蛋糕會多啲。");
    setMood(finalScore > 0 ? "happy" : "silly");
    if (finalScore === total) playYes();
  }

  if (!level) {
    return <Map best={best} onPlay={openLevel} />;
  }

  if (level.rhyme && clearScore === null) {
    return (
      <RhymeStage
        onBack={() => setLevel(null)}
        onDone={(ok) => finish(ok ? 5 : 1, 5)}
      />
    );
  }

  if (clearScore !== null) {
    const total = level.rhyme ? 5 : deck.length;
    const title =
      clearScore === total ? "超級飛行蛋糕俠" : clearScore >= Math.ceil(total / 2) ? "擦膠小英雄" : "書包未拉鍊";
    return (
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-200 to-amber-100 p-6 text-center">
        <Hero mood={mood} line={burst ?? "Wow!"} />
        <p className="text-6xl">{level.emoji}</p>
        <h2 className="mt-2 text-4xl font-extrabold text-amber-950">{title}</h2>
        <p className="mt-2 text-2xl font-extrabold text-stone-700">
          {clearScore} / {total} 塊蛋糕
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button className="h-12 rounded-full px-6 text-base" onClick={() => openLevel(level)}>
            再玩呢關
          </Button>
          <Button variant="outline" className="h-12 rounded-full px-6 text-base" onClick={() => setLevel(null)}>
            返地圖
          </Button>
        </div>
      </section>
    );
  }

  const question = deck[index];
  if (!question) return null;

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-amber-100 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button type="button" className="text-sm font-extrabold text-amber-800" onClick={() => setLevel(null)}>
          ← 地圖
        </button>
        <p className="font-extrabold text-amber-900">
          {level.emoji} {level.title}
        </p>
        <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold">
          {index + 1}/{deck.length} · 🎂 {score}
        </p>
      </div>
      <Hero mood={mood} line={burst ?? "Help! 揀一個答案！"} />
      <div className="mt-4 rounded-3xl bg-amber-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-extrabold leading-snug text-stone-900" lang="en">
            {question.prompt}
          </h2>
          <button
            type="button"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-sky-200 text-sky-800"
            aria-label="讀題目"
            onClick={() => speak(question.speak ?? question.prompt)}
          >
            <Volume2 />
          </button>
        </div>
        <p className="mt-1 text-stone-600">{question.hint}</p>
      </div>
      <div className="mt-3 grid gap-3">
        {question.choices.map((choice) => {
          const show = picked !== null;
          const isAnswer = choice === question.answer;
          return (
            <button
              key={choice}
              type="button"
              lang="en"
              disabled={show}
              onClick={() => {
                setPicked(choice);
                const ok = choice === question.answer;
                if (ok) {
                  setScore((value) => value + 1);
                  setMood("happy");
                  setBurst(pick(cheers));
                  addStars(1);
                  playYes();
                  speak("Yes! " + choice);
                } else {
                  setMood("silly");
                  setBurst(pick(oops));
                  playNo();
                  speak("The answer is " + question.answer);
                }
              }}
              className={`min-h-16 rounded-full border-4 px-5 py-3 text-left text-xl font-extrabold ${
                show && isAnswer
                  ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                  : show && picked === choice
                    ? "border-rose-400 bg-rose-100 text-rose-800 game-wobble"
                    : "border-stone-900 bg-white text-stone-900 shadow-[4px_4px_0_#1c1917] active:translate-y-0.5 active:shadow-none"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="mt-4 rounded-3xl bg-amber-100 p-4">
          <p className="text-lg font-bold text-stone-800">{question.explain}</p>
          <Button
            className="mt-3 h-12 rounded-full px-6 text-base"
            onClick={() => {
              if (index + 1 >= deck.length) finish(score, deck.length);
              else {
                setIndex((value) => value + 1);
                setPicked(null);
                setMood("idle");
                setBurst(null);
              }
            }}
          >
            {index + 1 >= deck.length ? "睇蛋糕分數" : "下一格"}
          </Button>
        </div>
      )}
    </section>
  );
}

function Map({ best, onPlay }: { best: Record<string, number>; onPlay: (level: Level) => void }) {
  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-300 via-rose-200 to-sky-200 p-6 text-center">
        <Hero mood="idle" line="Help! 我張生日卡飛走咗！" />
        <h1 className="text-4xl font-extrabold leading-tight text-amber-950 md:text-5xl">
          Super Boy
          <span className="block">返學大冒險</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-lg font-bold text-amber-950/80">
          六關笑住玩。範圍係 Unit 1、Unit 2 同 Unit 4。
        </p>
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        {levels.map((level) => {
          const stars = best[level.id] ?? 0;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onPlay(level)}
              className={`rounded-[1.6rem] p-4 text-left shadow-[5px_5px_0_#1c1917] ring-1 ring-stone-900 ${level.color}`}
            >
              <span className="game-float inline-block text-5xl">{level.emoji}</span>
              <span className="mt-2 block text-2xl font-extrabold text-stone-900">{level.title}</span>
              <span className="mt-1 block text-base font-semibold text-stone-700">{level.blurb}</span>
              <span className="mt-2 block text-sm font-extrabold text-stone-800">
                最好成績 {stars === 0 ? "未玩" : `${stars} 塊蛋糕`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Hero({ mood, line }: { mood: Mood; line: string }) {
  return (
    <div className="relative mx-auto mb-2 flex max-w-md flex-col items-center">
      {mood === "happy" &&
        ["🎂", "⭐", "✨", "🎈"].map((item, index) => (
          <span
            key={item}
            className="game-pop pointer-events-none absolute text-3xl"
            style={{ left: `${12 + index * 22}%`, top: 0 }}
          >
            {item}
          </span>
        ))}
      <div className={mood === "happy" ? "game-jump text-7xl" : mood === "silly" ? "game-wobble text-7xl" : "game-float text-7xl"}>
        {mood === "silly" ? "🦸‍♂️🍌" : "🦸‍♂️"}
      </div>
      <p className="relative z-10 -mt-2 max-w-xs rounded-3xl border-4 border-stone-900 bg-white px-4 py-2 text-lg font-extrabold text-stone-900">
        {line}
      </p>
    </div>
  );
}

function RhymeStage({ onBack, onDone }: { onBack: () => void; onDone: (ok: boolean) => void }) {
  const [pool, setPool] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setPool(shuffle([...rhyme]));
  }, []);

  const correct = checked && picked.every((line, index) => line === rhyme[index]);

  return (
    <section className="rounded-[2rem] bg-orange-50 p-5 ring-1 ring-orange-200">
      <button type="button" className="text-sm font-extrabold text-orange-800" onClick={onBack}>
        ← 地圖
      </button>
      <Hero mood={checked ? (correct ? "happy" : "silly") : "idle"} line="踩順序！One, two 先行。" />
      <h2 className="text-center text-3xl font-extrabold">童謠地板</h2>
      <ol className="mt-3 space-y-2">
        {picked.map((line, index) => (
          <li key={line} lang="en" className="rounded-full bg-white px-4 py-3 text-lg font-extrabold shadow-[3px_3px_0_#1c1917]">
            {index + 1}. {line}
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-2">
        {pool.map((line) => (
          <button
            key={line}
            type="button"
            lang="en"
            disabled={checked}
            onClick={() => {
              speak(line);
              tone(440 + picked.length * 40, 0, 0.08, "square");
              setPool((items) => items.filter((item) => item !== line));
              setPicked((items) => [...items, line]);
            }}
            className="rounded-full border-4 border-stone-900 bg-white px-4 py-3 text-left text-lg font-extrabold"
          >
            {line}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          className="h-12 rounded-full px-5"
          disabled={picked.length !== rhyme.length || checked}
          onClick={() => {
            const ok = picked.every((line, index) => line === rhyme[index]);
            setChecked(true);
            if (ok) {
              addStars(3);
              playYes();
              speak("Yes! You can fly now!");
            } else {
              playNo();
              speak("Nine, ten, put down your pen.");
            }
            onDone(ok);
          }}
        >
          踩完，檢查
        </Button>
      </div>
    </section>
  );
}
