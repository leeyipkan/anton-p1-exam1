"use client";

import { useEffect, useState } from "react";
import { nextReward, readProgress, type Progress } from "@/lib/progress";

export function StarMeter() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  if (!progress) return null;
  const upcoming = nextReward(progress.points);

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-amber-900">
        Points {progress.points}
      </span>
      <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-amber-900">
        {upcoming
          ? `Next reward ${upcoming.emoji} in ${upcoming.need - progress.points}`
          : "Every reward is unlocked"}
      </span>
      <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-amber-900">
        Best quiz {progress.bestQuiz}/8
      </span>
      <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-amber-900">
        Birthday card {progress.cardDone ? "done" : "not yet"}
      </span>
    </div>
  );
}
