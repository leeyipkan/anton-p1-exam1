const KEY = "sunny-class-progress";

export type Progress = {
  stars: number;
  points: number;
  bestQuiz: number;
  cardDone: boolean;
};

export type Reward = {
  id: string;
  need: number;
  emoji: string;
  name: string;
  line: string;
};

export const rewards: Reward[] = [
  { id: "eraser", need: 30, emoji: "🧽", name: "逃跑擦膠", line: "擦膠決定留低陪你。" },
  { id: "hat", need: 60, emoji: "🎩", name: "生日帽", line: "Super Boy 戴帽飛。" },
  { id: "cape", need: 100, emoji: "🧣", name: "飛行斗篷", line: "斗篷可以飛過課室。" },
  { id: "crown", need: 150, emoji: "👑", name: "蛋糕皇冠", line: "蛋糕自己戴皇冠。" },
  { id: "bag", need: 220, emoji: "🎒", name: "金書包", line: "書包滿晒星星。" },
  { id: "medal", need: 300, emoji: "🏅", name: "Super 金章", line: "You can fly now!" },
];

const empty: Progress = { stars: 0, points: 0, bestQuiz: 0, cardDone: false };

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
  window.dispatchEvent(new Event("sunny-points"));
  return next;
}

export function unlockedRewards(points: number) {
  return rewards.filter((reward) => points >= reward.need);
}

export function nextReward(points: number) {
  return rewards.find((reward) => points < reward.need) ?? null;
}

export function addPoints(count: number) {
  const before = readProgress().points;
  const after = before + count;
  const next = writeProgress({ points: after, stars: after });
  const unlocked = rewards.filter((reward) => before < reward.need && after >= reward.need);
  return { before, after: next.points, unlocked };
}
