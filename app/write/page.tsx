"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addPoints, readProgress, writeProgress } from "@/lib/progress";
import { speak } from "@/lib/speech";

const cardChoices = [
  {
    text: "Dear Lily,\nHappy birthday!\nFrom Ken",
    ok: true,
  },
  {
    text: "dear lily\nhappy birthday\nfrom ken",
    ok: false,
  },
  {
    text: "From Lily,\nDear Ken\nBirthday happy",
    ok: false,
  },
];

const bubbleChoices = [
  { text: "You are great, Super Boy!", ok: true },
  { text: "You are great Super Boy", ok: false },
  { text: "you are great, super boy.", ok: false },
];

export default function WritePage() {
  const [cardPick, setCardPick] = useState<number | null>(null);
  const [bubblePick, setBubblePick] = useState<number | null>(null);
  const [friend, setFriend] = useState("");
  const [me, setMe] = useState("");
  const [saved, setSaved] = useState(false);
  const [cardBonus, setCardBonus] = useState(false);

  const namePattern = /^[A-Z][a-zA-Z]*(?: [A-Z][a-zA-Z]*)?$/;
  const friendOk = namePattern.test(friend.trim());
  const meOk = namePattern.test(me.trim());
  const ready = friendOk && meOk;

  const card = ready
    ? `Dear ${friend.trim()},\nHappy birthday!\nFrom ${me.trim()}`
    : "";

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-extrabold text-violet-700">寫作</p>
        <h1 className="text-4xl font-extrabold text-stone-900">生日卡、人物、標點</h1>
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-violet-100">
        <h2 className="text-2xl font-extrabold">Unit 1 · 邊張生日卡啱？</h2>
        <p className="mt-1 text-stone-600">Dear 係收卡嘅人，From 係寫卡嘅人，名要大階。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {cardChoices.map((choice, index) => {
            const picked = cardPick === index;
            return (
              <button
                key={choice.text}
                type="button"
                lang="en"
                onClick={() => setCardPick(index)}
                className={`whitespace-pre-line rounded-3xl border-2 p-4 text-left text-lg font-bold ${
                  cardPick === null
                    ? "border-violet-100 bg-violet-50"
                    : choice.ok
                      ? "border-emerald-400 bg-emerald-50"
                      : picked
                        ? "border-rose-300 bg-rose-50"
                        : "border-stone-100 bg-stone-50 opacity-70"
                }`}
              >
                {choice.text}
              </button>
            );
          })}
        </div>
        {cardPick !== null && (
          <p className="mt-3 font-bold text-emerald-800">
            {cardChoices[cardPick].ok ? "呢張卡三部分齊，名都有大階。" : "睇綠色嗰張。dear 同人名都要大階。"}
          </p>
        )}
      </section>

      <section className="rounded-3xl bg-amber-50 p-5">
        <h2 className="text-2xl font-extrabold text-amber-950">自己寫一張</h2>
        <p className="mt-1 text-amber-900/80">英文名，第一個字母大階，例如 Lily、Ken。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block font-bold text-amber-950">
            收卡嘅人
            <input
              value={friend}
              onChange={(event) => {
                setFriend(event.target.value);
                setSaved(false);
              }}
              className="mt-1 h-12 w-full rounded-2xl border border-amber-200 bg-white px-3 text-lg"
              placeholder="Lily"
            />
          </label>
          <label className="block font-bold text-amber-950">
            你個名
            <input
              value={me}
              onChange={(event) => {
                setMe(event.target.value);
                setSaved(false);
              }}
              className="mt-1 h-12 w-full rounded-2xl border border-amber-200 bg-white px-3 text-lg"
              placeholder="Ken"
            />
          </label>
        </div>
        <ul className="mt-3 space-y-1 text-sm font-bold">
          <li className={friendOk ? "text-emerald-700" : "text-stone-500"}>收卡人名以大階開始</li>
          <li className={meOk ? "text-emerald-700" : "text-stone-500"}>你個名以大階開始</li>
          <li className="text-emerald-700">有 Dear、Happy birthday!、From</li>
        </ul>
        {ready && (
          <div className="mt-4 rounded-[2rem] bg-white p-6 text-center shadow-inner">
            <p className="text-4xl">🎂</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-2xl font-extrabold text-rose-700" lang="en">
              {card}
            </pre>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button className="h-11 rounded-full" onClick={() => speak(card.split("\n").join(" "))}>
                讀出生日卡
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full"
                onClick={() => {
                  const already = readProgress().cardDone;
                  writeProgress({ cardDone: true });
                  if (!already) {
                    addPoints(20);
                    setCardBonus(true);
                  }
                  setSaved(true);
                }}
              >
                {saved ? "已保存" : "我寫好了"}
              </Button>
            </div>
            {cardBonus && <p className="mt-3 font-extrabold text-amber-800">獎勵 +20 分</p>}
          </div>
        )}
      </section>

      <PeopleBook />

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
        <h2 className="text-2xl font-extrabold">Unit 4 · 漫畫點講</h2>
        <p className="mt-1 text-stone-600">對住 Super Boy 講，名字前面有逗號，大叫可以加感嘆號。</p>
        <div className="mt-4 grid gap-3">
          {bubbleChoices.map((choice, index) => {
            const picked = bubblePick === index;
            return (
              <button
                key={choice.text}
                type="button"
                lang="en"
                onClick={() => setBubblePick(index)}
                className={`rounded-full border-2 px-4 py-3 text-left text-lg font-bold ${
                  bubblePick === null
                    ? "border-sky-100 bg-sky-50"
                    : choice.ok
                      ? "border-emerald-400 bg-emerald-50"
                      : picked
                        ? "border-rose-300 bg-rose-50"
                        : "border-stone-100 opacity-60"
                }`}
              >
                {choice.text}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function PeopleBook() {
  const [name, setName] = useState("Amy");
  const [age, setAge] = useState("six");
  const [friend, setFriend] = useState("Tom");
  const [who, setWho] = useState("He");
  const [role, setRole] = useState("classmate");
  const nameOk = /^[A-Z]/.test(name.trim()) && /^[A-Z]/.test(friend.trim());
  const sentences = [
    `My name is ${name}.`,
    `I am ${age} years old.`,
    `This is ${friend}.`,
    `${who} is my ${role}.`,
  ];

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
      <h2 className="text-2xl font-extrabold">Unit 2 · 介紹學校嘅人</h2>
      <p className="mt-1 text-stone-600">句頭大階，人名大階，句尾句號。呢四句可以讀出聲。</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="我個名" value={name} onChange={setName} />
        <label className="block font-bold">
          年紀
          <select
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-amber-200 px-3"
          >
            {["five", "six", "seven", "eight"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <Field label="朋友個名" value={friend} onChange={setFriend} />
        <label className="block font-bold">
          男仔定女仔
          <select
            value={who}
            onChange={(event) => setWho(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-amber-200 px-3"
          >
            <option value="He">He 男仔</option>
            <option value="She">She 女仔</option>
          </select>
        </label>
        <label className="block font-bold md:col-span-2">
          佢係
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-amber-200 px-3"
          >
            <option value="classmate">classmate 同學</option>
            <option value="group leader">group leader 組長</option>
            <option value="best friend">best friend 最好嘅朋友</option>
          </select>
        </label>
      </div>
      {!nameOk && (
        <p className="mt-3 font-bold text-rose-700">人名第一個字母要大階，例如 Amy、Tom。</p>
      )}
      <div className="mt-4 space-y-2 rounded-3xl bg-amber-50 p-4">
        {sentences.map((line) => (
          <p key={line} lang="en" className="text-xl font-extrabold text-stone-800">
            {line}
          </p>
        ))}
        <Button className="mt-2 h-11 rounded-full" onClick={() => speak(sentences.join(" "))}>
          讀出四句
        </Button>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block font-bold">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-12 w-full rounded-2xl border border-amber-200 px-3 text-lg"
      />
    </label>
  );
}
