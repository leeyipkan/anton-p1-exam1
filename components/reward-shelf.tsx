"use client";

import { useEffect, useState } from "react";
import { nextReward, readProgress, rewards } from "@/lib/progress";

export function LiveRewardShelf() {
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setPoints(readProgress().points);
    sync();
    window.addEventListener("sunny-points", sync);
    return () => window.removeEventListener("sunny-points", sync);
  }, []);

  if (points === null) return null;
  return <RewardShelf points={points} />;
}

export function RewardShelf({ points }: { points: number }) {
  const upcoming = nextReward(points);
  const previous = [...rewards].reverse().find((reward) => reward.need <= points);
  const span = upcoming ? upcoming.need - (previous?.need ?? 0) : 1;
  const filled = upcoming ? Math.min(100, Math.round(((points - (previous?.need ?? 0)) / span) * 100)) : 100;

  return (
    <section className="rounded-[1.6rem] bg-white p-4 shadow-sm ring-1 ring-amber-100">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-extrabold text-amber-700">積分</p>
          <p className="text-4xl font-extrabold text-amber-950">{points}</p>
        </div>
        <p className="text-sm font-bold text-stone-600">
          {upcoming ? `再 ${upcoming.need - points} 分攞 ${upcoming.emoji} ${upcoming.name}` : "獎勵全部攞晒！"}
        </p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-amber-100">
        <div className="h-full rounded-full bg-amber-500" style={{ width: `${filled}%` }} />
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {rewards.map((reward) => {
          const owned = points >= reward.need;
          return (
            <li
              key={reward.id}
              className={`rounded-2xl px-3 py-3 ${owned ? "bg-amber-100" : "bg-stone-100 text-stone-400"}`}
            >
              <span className="text-3xl">{owned ? reward.emoji : "🔒"}</span>
              <span className="mt-1 block font-extrabold text-stone-800">{reward.name}</span>
              <span className="block text-sm font-bold">
                {owned ? reward.line : `${reward.need} 分解鎖`}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
