import Link from "next/link";
import { StarMeter } from "@/components/star-meter";

const doors = [
  {
    href: "/scope",
    emoji: "📋",
    title: "考試範圍",
    text: "家長先睇。四個單元考咩、點溫、邊幾頁相片未影到。",
    tint: "bg-amber-100",
  },
  {
    href: "/learn",
    emoji: "🔤",
    title: "生字同句型",
    text: "撳喇叭聽，再跟住讀。有拼音 h m y、b g t、p k -en。",
    tint: "bg-sky-100",
  },
  {
    href: "/play",
    emoji: "🎯",
    title: "練習遊戲",
    text: "打招呼、人物、書包、指令、拼音、標點，揀答案即時知道啱唔啱。",
    tint: "bg-emerald-100",
  },
  {
    href: "/quiz",
    emoji: "✅",
    title: "模擬小測",
    text: "八題混合，似卷上嘅選擇題。做完有分數。",
    tint: "bg-rose-100",
  },
  {
    href: "/write",
    emoji: "🎂",
    title: "寫作工房",
    text: "生日卡、介紹學校嘅人、漫畫標點。對住書本嘅寫作提示。",
    tint: "bg-violet-100",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-300 via-orange-200 to-sky-200 p-6 shadow-sm md:p-8">
        <p className="text-sm font-extrabold tracking-wide text-amber-900/80">
          PRIMARY 1 ENGLISH
        </p>
        <h1 className="mt-1 text-4xl font-extrabold text-amber-950 md:text-5xl">
          Hello! 準備英文測驗
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-amber-950/80">
          根據你影低嘅課本，今次溫習範圍係 Unit 1 至 Unit 4：認識新同學、學校嘅人、聽老師指令，同書包裡嘅物件。
        </p>
        <StarMeter />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {doors.map((door) => (
          <Link
            key={door.href}
            href={door.href}
            className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-amber-100 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`grid size-14 place-items-center rounded-2xl text-3xl ${door.tint}`}>
              {door.emoji}
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-stone-800">{door.title}</h2>
            <p className="mt-1 text-base leading-relaxed text-stone-600">{door.text}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
        <h2 className="text-xl font-extrabold text-amber-900">每日十分鐘</h2>
        <ol className="mt-3 grid gap-2 text-base text-stone-700 md:grid-cols-2">
          <li className="rounded-2xl bg-amber-50 px-4 py-3">1. 生字頁聽五個字，小朋友跟住讀。</li>
          <li className="rounded-2xl bg-sky-50 px-4 py-3">2. 揀一個句型，家長問、小朋友答。</li>
          <li className="rounded-2xl bg-emerald-50 px-4 py-3">3. 玩一個練習遊戲，錯題再讀一次。</li>
          <li className="rounded-2xl bg-violet-50 px-4 py-3">4. 寫一行：My name is ... I am six years old.</li>
        </ol>
      </section>
    </div>
  );
}
