"use client";

import { useEffect, useState } from "react";
import { readProgress, type Progress } from "@/lib/progress";

export function StarMeter() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  if (!progress) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-amber-900">
        ⭐ 練習之星 {progress.stars}
      </span>
      <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-amber-900">
        小測最好成績 {progress.bestQuiz}/8
      </span>
      <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-amber-900">
        生日卡 {progress.cardDone ? "已完成" : "未完成"}
      </span>
    </div>
  );
}
