"use client";

import { useEffect, useState } from "react";
import { checklist, rhyme, units } from "@/lib/content";

const STORAGE = "sunny-class-checklist";

const tones = ["bg-amber-50", "bg-sky-50", "bg-violet-50", "bg-emerald-50"];

export default function ScopePage() {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE);
    if (raw) setDone(JSON.parse(raw) as string[]);
  }, []);

  function toggle(id: string) {
    const next = done.includes(id) ? done.filter((item) => item !== id) : [...done, id];
    setDone(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
  }

  return (
    <article className="space-y-6">
      <header>
        <p className="text-sm font-extrabold text-amber-700">家長摘要</p>
        <h1 className="mt-1 text-4xl font-extrabold text-stone-900">今次英文考咩</h1>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-stone-600">
          十六張相係小一英文課本 Unit 1 至 Unit 4。自評清單停喺 Unit 4，所以我當今次範圍係呢四課。第 42 頁開始預告 Unit 5「Who is that?」同 Unit 6「Animals we love」，如果老師話都考，要再影嗰幾頁。
        </p>
      </header>

      <section className="rounded-3xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="text-xl font-extrabold text-amber-950">相片未影到嘅頁</h2>
        <p className="mt-2 leading-relaxed text-amber-950/80">
          Unit 3「Listen to the teacher」嘅課文頁，大約第 22–29 頁，冇喺相入面。預告只見到三句指令，同拼音 s、-ft、-lk。請用課本對一次生字，唔好只靠呢度。Unit 1、2、4 嘅故事、生字、句型、拼音同寫作提示，相入面有。
        </p>
      </section>

      <div className="grid gap-4">
        {units.map((unit, index) => (
          <section key={unit.id} className={`rounded-3xl p-5 ${tones[index]}`}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold text-stone-900">
                Unit {unit.id} {unit.title}
              </h2>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-stone-600">
                {unit.zh}
                {unit.covered === "preview" ? " · 只得預告" : ""}
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
                  <span className="font-extrabold">{pattern.title}：</span>
                  <span lang="en">{pattern.en}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
        <h2 className="text-2xl font-extrabold text-stone-900">卷上通常點考</h2>
        <ul className="mt-3 grid gap-2 text-base leading-relaxed text-stone-700 md:grid-cols-2">
          <li className="rounded-2xl bg-stone-50 p-3">聽力：圈你聽到嘅字，或者跟指令做。</li>
          <li className="rounded-2xl bg-stone-50 p-3">選擇：故事之後揀最好嘅答案。</li>
          <li className="rounded-2xl bg-stone-50 p-3">填充：This is ___. He is our ___.</li>
          <li className="rounded-2xl bg-stone-50 p-3">拼音：聽字，圈 h / m / y、b / g / t、p / k / -en。</li>
          <li className="rounded-2xl bg-stone-50 p-3">文法：I am / He is / She is / We are；I have / He has；a / an。</li>
          <li className="rounded-2xl bg-stone-50 p-3">寫作：生日卡、用大階同句號介紹人、漫畫氣泡加標點。</li>
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
        <h2 className="text-2xl font-extrabold text-stone-900">童謠次序</h2>
        <p className="mt-1 text-stone-600">Unit 4 要將圖畫按童謠排 1 至 5。最後一個字押韻。</p>
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
          溫習清單 {done.length}/{checklist.length}
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
        <h2 className="text-2xl font-extrabold">考前一晚</h2>
        <p className="mt-2 leading-relaxed text-stone-200">
          唔好再追新課。用十分鐘聽生字，五分鐘口頭問 What is your name?、How old are you?、This is ... She is my classmate.、I have a pen. / She has an eraser. 最後寫一張生日卡就收工。錯題只讀正確句子，唔好罰抄。
        </p>
      </section>
    </article>
  );
}
