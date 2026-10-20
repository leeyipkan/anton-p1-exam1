const KEY = "sunny-class-progress";

export type Progress = {
  stars: number;
  bestQuiz: number;
  cardDone: boolean;
};

const empty: Progress = { stars: 0, bestQuiz: 0, cardDone: false };

export function readProgress(): Progress {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function writeProgress(patch: Partial<Progress>) {
  const next = { ...readProgress(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function addStars(count: number) {
  const current = readProgress();
  return writeProgress({ stars: current.stars + count });
}
