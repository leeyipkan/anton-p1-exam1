import Link from "next/link";
import { StarMeter } from "@/components/star-meter";

const doors = [
  {
    href: "/learn",
    emoji: "🔤",
    title: "生字卡",
    text: "聽完跟住讀。拼音 h m y、b g t、p k -en。",
    tint: "bg-sky-100",
  },
  {
    href: "/scope",
    emoji: "📋",
    title: "家長範圍",
    text: "Unit 1、2、4 考咩。小朋友可以跳過呢頁。",
    tint: "bg-amber-100",
  },
  {
    href: "/quiz",
    emoji: "✅",
    title: "模擬小測",
    text: "八題選擇，似考試卷。玩完冒險先做。",
    tint: "bg-rose-100",
  },
  {
    href: "/write",
    emoji: "🎂",
    title: "寫生日卡",
    text: "Dear、Happy birthday!、From，同介紹學校嘅人。",
    tint: "bg-violet-100",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Link
        href="/play"
        className="block overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-300 via-rose-200 to-sky-200 p-6 shadow-[6px_6px_0_#1c1917] ring-1 ring-stone-900 md:p-8"
      >
        <p className="game-float text-7xl">🦸‍♂️🎂</p>
        <p className="mt-2 text-sm font-extrabold tracking-wide text-amber-900/80">SUPER BOY SCHOOL DASH</p>
        <h1 className="mt-1 text-[2rem] font-extrabold leading-tight text-amber-950 md:text-5xl">
          返學大冒險
          <span className="mt-1 block text-2xl md:text-3xl">蛋糕、擦膠、傻老師</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-bold leading-relaxed text-amber-950/80">
          撳關卡玩。答啱有蛋糕同音效，答錯擦膠會走去玩。英文仍然係 Unit 1、2、4。
        </p>
        <span className="mt-4 inline-flex h-12 items-center rounded-full bg-stone-900 px-6 text-lg font-extrabold text-white">
          開始玩
        </span>
        <StarMeter />
      </Link>

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
          <li className="rounded-2xl bg-emerald-50 px-4 py-3">3. 玩一關 Super Boy，錯題睇綠色答案再讀一次。</li>
          <li className="rounded-2xl bg-violet-50 px-4 py-3">4. 寫一行：My name is ... I am six years old.</li>
        </ol>
      </section>
    </div>
  );
}
