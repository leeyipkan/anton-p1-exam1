"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportCard } from "@/components/report-card";
import { RewardShelf } from "@/components/reward-shelf";
import { questions, rhyme, type Question, type Skill } from "@/lib/content";
import { addPoints, readProgress, type Reward } from "@/lib/progress";
import { logAttempt } from "@/lib/report";
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
    title: "Birthday classroom",
    blurb: "The cake is dancing. Say Good morning!",
    color: "bg-amber-200",
  },
  {
    id: "people",
    skill: "people",
    emoji: "🎂👩‍🏫",
    title: "Cake-hat teacher",
    blurb: "The teacher wears a birthday hat. Sort out He, She, and We.",
    color: "bg-sky-200",
  },
  {
    id: "bag",
    skill: "bag",
    emoji: "🎒🐱",
    title: "Bag escape",
    blurb: "The eraser and pencil want to run. Catch them with have, has, a, and an.",
    color: "bg-emerald-200",
  },
  {
    id: "sound",
    skill: "phonics",
    emoji: "🤡",
    title: "Letter circus",
    blurb: "h, m, y, b, g, t, p, and k go on stage.",
    color: "bg-rose-200",
  },
  {
    id: "marks",
    skill: "marks",
    emoji: "💥",
    title: "Punctuation fight",
    blurb: "The question mark and the exclamation mark are shouting. Pick the right mark.",
    color: "bg-violet-200",
  },
  {
    id: "rhyme",
    rhyme: true,
    emoji: "🥁",
    title: "Floor rhyme",
    blurb: "Start with One, two. Finish with Nine, ten.",
    color: "bg-orange-200",
  },
];

const cheers = [
  "Ding! A cake flies out!",
  "Wow! You are great!",
  "Super Boy takes off!",
  "The pencil claps!",
];

const oops = [
  "Oops. The eraser ran off to play.",
  "Oh no! The cake slid away.",
  "Close. The green one is the answer.",
  "The pencil is giggling. Look again.",
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
  const [streak, setStreak] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  const [gained, setGained] = useState(0);
  const [points, setPoints] = useState(0);
  const [justUnlocked, setJustUnlocked] = useState<Reward[]>([]);
  const correctRef = useRef(0);
  const [mood, setMood] = useState<Mood>("idle");
  const [burst, setBurst] = useState<string | null>(null);
  const [clearScore, setClearScore] = useState<number | null>(null);

  useEffect(() => {
    setBest(readBest());
    setPoints(readProgress().points);
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
    setStreak(0);
    setRoundPoints(0);
    setGained(0);
    setJustUnlocked([]);
    correctRef.current = 0;
    setIndex(0);
    if (next.skill) {
      const pool = questions.filter((item) => item.skill === next.skill);
      setDeck(shuffle(pool).slice(0, Math.min(5, pool.length)));
    } else {
      setDeck([]);
    }
  }

  function grant(amount: number) {
    const result = addPoints(amount);
    setPoints(result.after);
    setRoundPoints((value) => value + amount);
    setGained(amount);
    if (result.unlocked.length) setJustUnlocked((current) => [...current, ...result.unlocked]);
    return result;
  }

  function finish(finalScore: number, total: number) {
    if (!level) return;
    const saved = writeBest(level.id, finalScore);
    setBest(saved);
    if (!level.rhyme && finalScore === total) grant(30);
    setClearScore(finalScore);
    setBurst(finalScore === total ? "All correct! You can fly now!" : "Play again. Points still add up.");
    setMood(finalScore > 0 ? "happy" : "silly");
    if (finalScore === total) playYes();
  }

  if (!level) {
    return <Map best={best} points={points} onPlay={openLevel} />;
  }

  if (level.rhyme && clearScore === null) {
    return (
      <RhymeStage
        onBack={() => setLevel(null)}
        onDone={(ok) => {
          logAttempt({
            id: "rhyme-order",
            skill: "rhyme",
            prompt: "Put the rhyme lines in order.",
            ok,
          });
          grant(ok ? 30 : 5);
          finish(ok ? 5 : 1, 5);
        }}
      />
    );
  }

  if (clearScore !== null) {
    const total = level.rhyme ? 5 : deck.length;
    const title =
      clearScore === total ? "Flying cake hero" : clearScore >= Math.ceil(total / 2) ? "Eraser hero" : "Bag still open";
    return (
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-200 to-amber-100 p-6 text-center">
        <Hero mood={mood} line={burst ?? "Wow!"} />
        <p className="text-6xl">{level.emoji}</p>
        <h2 className="mt-2 text-4xl font-extrabold text-amber-950">{title}</h2>
        <p className="mt-2 text-2xl font-extrabold text-stone-700">
          {clearScore} / {total} correct
        </p>
        <p className="mt-1 text-3xl font-extrabold text-amber-800">This level +{roundPoints}</p>
        <p className="text-lg font-bold text-stone-600">Total points {points}</p>
        {justUnlocked.length > 0 && (
          <ul className="mx-auto mt-4 grid max-w-md gap-2">
            {justUnlocked.map((reward) => (
              <li key={reward.id} className="rounded-3xl bg-white px-4 py-3 text-xl font-extrabold text-amber-950">
                New reward {reward.emoji} {reward.name}
                <span className="mt-1 block text-base text-stone-600">{reward.line}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mx-auto mt-5 max-w-3xl text-left">
          <ReportCard focus={level.rhyme ? "rhyme" : level.skill} />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button className="h-12 rounded-full px-6 text-base" onClick={() => openLevel(level)}>
            Play this level again
          </Button>
          <Button variant="outline" className="h-12 rounded-full px-6 text-base" onClick={() => setLevel(null)}>
            Back to the map
          </Button>
          <Link
            href="/report"
            className="inline-flex h-12 items-center rounded-full border border-stone-300 bg-white px-6 text-base font-extrabold"
          >
            Full report
          </Link>
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
          ← Map
        </button>
        <p className="font-extrabold text-amber-900">
          {level.emoji} {level.title}
        </p>
        <p className="rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold">
          {index + 1}/{deck.length} · {points} pts
          {streak > 1 ? ` · streak ${streak}` : ""}
        </p>
      </div>
      <Hero mood={mood} line={burst ?? "Help! Pick an answer!"} />
      <div className="mt-4 rounded-3xl bg-amber-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-extrabold leading-snug text-stone-900" lang="en">
            {question.prompt}
          </h2>
          <button
            type="button"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-sky-200 text-sky-800"
            aria-label="Read the question"
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
                logAttempt({ id: question.id, skill: question.skill, prompt: question.prompt, ok });
                if (ok) {
                  const nextStreak = streak + 1;
                  const bonus = nextStreak >= 3 ? 10 : nextStreak === 2 ? 5 : 0;
                  correctRef.current += 1;
                  setStreak(nextStreak);
                  setMood("happy");
                  setBurst(`${pick(cheers)} +${10 + bonus}`);
                  grant(10 + bonus);
                  playYes();
                  speak("Yes! " + choice);
                } else {
                  setStreak(0);
                  setGained(0);
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
          {gained > 0 && <p className="mt-1 text-2xl font-extrabold text-emerald-700">+{gained} points</p>}
          <Button
            className="mt-3 h-12 rounded-full px-6 text-base"
            onClick={() => {
              if (index + 1 >= deck.length) finish(correctRef.current, deck.length);
              else {
                setIndex((value) => value + 1);
                setPicked(null);
                setMood("idle");
                setBurst(null);
              }
            }}
          >
            {index + 1 >= deck.length ? "See the cake score" : "Next square"}
          </Button>
        </div>
      )}
    </section>
  );
}

function Map({
  best,
  points,
  onPlay,
}: {
  best: Record<string, number>;
  points: number;
  onPlay: (level: Level) => void;
}) {
  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-300 via-rose-200 to-sky-200 p-6 text-center">
        <Hero mood="idle" line="Help! My birthday card flew away!" />
        <h1 className="text-4xl font-extrabold leading-tight text-amber-950 md:text-5xl">
          Super Boy
          <span className="block">School Dash</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-lg font-bold text-amber-950/80">
          A correct answer is +10. A streak adds more. A perfect level adds +30. Enough points unlock a reward.
        </p>
      </section>
      <RewardShelf points={points} />
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
                Best {stars === 0 ? "not played" : `${stars} cakes`}
              </span>
            </button>
          );
        })}
      </div>
      <Link
        href="/report"
        className="block rounded-[1.6rem] bg-stone-900 px-5 py-4 text-white shadow-[5px_5px_0_#d6d3d1]"
      >
        <span className="text-2xl font-extrabold">See the report after you play</span>
        <span className="mt-1 block font-semibold text-stone-200">Which types feel familiar, which are easy to miss, and the questions missed most often.</span>
      </Link>
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
        ← Map
      </button>
      <Hero mood={checked ? (correct ? "happy" : "silly") : "idle"} line="Tap the order. One, two goes first." />
      <h2 className="text-center text-3xl font-extrabold">Rhyme floor</h2>
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
              playYes();
              speak("Yes! You can fly now!");
            } else {
              playNo();
              speak("Nine, ten, put down your pen.");
            }
            onDone(ok);
          }}
        >
          Done. Check it
        </Button>
      </div>
    </section>
  );
}
