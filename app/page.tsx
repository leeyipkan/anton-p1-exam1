import Link from "next/link";
import { LiveRewardShelf } from "@/components/reward-shelf";
import { StarMeter } from "@/components/star-meter";

const doors = [
  {
    href: "/learn",
    emoji: "🔤",
    title: "Word cards",
    text: "Listen and say the word. Sounds: h m y, b g t, p k -en.",
    tint: "bg-sky-100",
  },
  {
    href: "/scope",
    emoji: "📋",
    title: "Exam scope",
    text: "What Units 1, 2, and 4 cover. Parents can read this page.",
    tint: "bg-amber-100",
  },
  {
    href: "/quiz",
    emoji: "✅",
    title: "Practice quiz",
    text: "Eight mixed questions, like a short paper. Play the dash first.",
    tint: "bg-rose-100",
  },
  {
    href: "/write",
    emoji: "🎂",
    title: "Birthday card",
    text: "Dear, Happy birthday!, From, and a sentence about school.",
    tint: "bg-violet-100",
  },
  {
    href: "/report",
    emoji: "📊",
    title: "Score report",
    text: "Which question types are familiar, and which are easy to miss.",
    tint: "bg-stone-100",
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
          Super Boy
          <span className="mt-1 block text-2xl md:text-3xl">School Dash</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-bold leading-relaxed text-amber-950/80">
          Tap a level and play. A correct answer pops a cake and a sound. A wrong answer sends the eraser off to play. English from Units 1, 2, and 4.
        </p>
        <span className="mt-4 inline-flex h-12 items-center rounded-full bg-stone-900 px-6 text-lg font-extrabold text-white">
          Start playing
        </span>
        <StarMeter />
      </Link>
      <LiveRewardShelf />

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
        <h2 className="text-xl font-extrabold text-amber-900">Ten minutes a day</h2>
        <ol className="mt-3 grid gap-2 text-base text-stone-700 md:grid-cols-2">
          <li className="rounded-2xl bg-amber-50 px-4 py-3">1. Listen to five words and say them back.</li>
          <li className="rounded-2xl bg-sky-50 px-4 py-3">2. Pick one pattern. A parent asks. The child answers.</li>
          <li className="rounded-2xl bg-emerald-50 px-4 py-3">3. Play one Super Boy level. Read the green answer again.</li>
          <li className="rounded-2xl bg-violet-50 px-4 py-3">4. Write one line: My name is ... I am six years old.</li>
        </ol>
      </section>
    </div>
  );
}
