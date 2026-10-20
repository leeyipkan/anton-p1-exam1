"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addPoints, readProgress, writeProgress } from "@/lib/progress";
import { speak } from "@/lib/speech";

const englishName = /^[A-Z][a-zA-Z]*(?: [A-Z][a-zA-Z]*)?$/;

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

  const friendOk = englishName.test(friend.trim());
  const meOk = englishName.test(me.trim());
  const ready = friendOk && meOk;

  const card = ready
    ? `Dear ${friend.trim()},\nHappy birthday!\nFrom ${me.trim()}`
    : "";

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-extrabold text-violet-700">Writing</p>
        <h1 className="text-4xl font-extrabold text-stone-900">Birthday card, people, and marks</h1>
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-violet-100">
        <h2 className="text-2xl font-extrabold">Unit 1 · Which birthday card is right?</h2>
        <p className="mt-1 text-stone-600">Dear is who gets the card. From is who writes it. Names start with a capital letter.</p>
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
            {cardChoices[cardPick].ok
              ? "This card has all three parts, and the names start with capitals."
              : "Look at the green card. Dear and the names need capital letters."}
          </p>
        )}
      </section>

      <section className="rounded-3xl bg-amber-50 p-5">
        <h2 className="text-2xl font-extrabold text-amber-950">Write your own card</h2>
        <p className="mt-1 text-amber-900/80">Use an English name. The first letter is a capital, like Lily or Ken.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block font-bold text-amber-950">
            Who gets the card
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
            Your name
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
          <li className={friendOk ? "text-emerald-700" : "text-stone-500"}>The friend&apos;s name starts with a capital</li>
          <li className={meOk ? "text-emerald-700" : "text-stone-500"}>Your name starts with a capital</li>
          <li className="text-emerald-700">It has Dear, Happy birthday!, and From</li>
        </ul>
        {ready && (
          <div className="mt-4 rounded-[2rem] bg-white p-6 text-center shadow-inner">
            <p className="text-4xl">🎂</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-2xl font-extrabold text-rose-700" lang="en">
              {card}
            </pre>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button className="h-11 rounded-full" onClick={() => speak(card.split("\n").join(" "))}>
                Read the card
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
                {saved ? "Saved" : "I finished it"}
              </Button>
            </div>
            {cardBonus && <p className="mt-3 font-extrabold text-amber-800">Reward +20 points</p>}
          </div>
        )}
      </section>

      <PeopleBook />

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
        <h2 className="text-2xl font-extrabold">Unit 4 · What does the comic say?</h2>
        <p className="mt-1 text-stone-600">You are talking to Super Boy. Put a comma before the name. A shout can use an exclamation mark.</p>
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
        {bubblePick !== null && (
          <p className="mt-3 font-bold text-emerald-800">
            {bubbleChoices[bubblePick].ok
              ? "The comma sits before the name, and the shout ends with !."
              : "Look at the green line. Put a comma before Super Boy."}
          </p>
        )}
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
  const nameOk = englishName.test(name.trim()) && englishName.test(friend.trim());
  const sentences = [
    `My name is ${name}.`,
    `I am ${age} years old.`,
    `This is ${friend}.`,
    `${who} is my ${role}.`,
  ];

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
      <h2 className="text-2xl font-extrabold">Unit 2 · Introduce people at school</h2>
      <p className="mt-1 text-stone-600">A sentence starts with a capital. A name starts with a capital. A sentence ends with a full stop. These four lines can be read aloud.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="My name" value={name} onChange={setName} />
        <label className="block font-bold">
          Age
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
        <Field label="Friend's name" value={friend} onChange={setFriend} />
        <label className="block font-bold">
          Boy or girl
          <select
            value={who}
            onChange={(event) => setWho(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-amber-200 px-3"
          >
            <option value="He">He, a boy</option>
            <option value="She">She, a girl</option>
          </select>
        </label>
        <label className="block font-bold md:col-span-2">
          This person is
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-amber-200 px-3"
          >
            <option value="classmate">classmate</option>
            <option value="group leader">group leader</option>
            <option value="best friend">best friend</option>
          </select>
        </label>
      </div>
      {!nameOk && (
        <p className="mt-3 font-bold text-rose-700">A name starts with a capital letter, like Amy or Tom.</p>
      )}
      {nameOk && (
      <div className="mt-4 space-y-2 rounded-3xl bg-amber-50 p-4">
        {sentences.map((line) => (
          <p key={line} lang="en" className="text-xl font-extrabold text-stone-800">
            {line}
          </p>
        ))}
        <Button className="mt-2 h-11 rounded-full" onClick={() => speak(sentences.join(" "))}>
          Read the four lines
        </Button>
      </div>
      )}
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
