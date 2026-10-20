import { questions, type Skill } from "@/lib/content";

export type AttemptSkill = Skill | "rhyme";

export type Attempt = {
  id: string;
  skill: AttemptSkill;
  prompt: string;
  ok: boolean;
  at: number;
};

const KEY = "sunny-class-attempts";

export const skillInfo: Record<AttemptSkill, { label: string; emoji: string; tip: string }> = {
  greetings: {
    label: "打招呼、名同年紀",
    emoji: "🎂",
    tip: "再練 What is your name?、How old are you?、Good morning。",
  },
  people: {
    label: "學校嘅人",
    emoji: "🏫",
    tip: "再練 He / She / We，同 Mr、Mrs、Miss。",
  },
  bag: {
    label: "書包同數字",
    emoji: "🎒",
    tip: "再練 I have / He has，同 a / an。",
  },
  phonics: {
    label: "拼音",
    emoji: "🔤",
    tip: "聽完先揀開頭字母：h m y、b g t、p k -en。",
  },
  marks: {
    label: "標點",
    emoji: "💥",
    tip: "問句用 ?，大叫用 !，普通句子用 .，名字前面用逗號。",
  },
  rhyme: {
    label: "童謠次序",
    emoji: "🥁",
    tip: "記住 one two glue，nine ten pen。",
  },
};

export function readAttempts(): Attempt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Attempt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logAttempt(attempt: Omit<Attempt, "at">) {
  const next = [...readAttempts(), { ...attempt, at: Date.now() }].slice(-400);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("sunny-points"));
  return next;
}

export type SkillStat = {
  skill: AttemptSkill;
  label: string;
  emoji: string;
  tip: string;
  tries: number;
  correct: number;
  rate: number;
};

export type MissedQuestion = {
  id: string;
  prompt: string;
  skill: AttemptSkill;
  misses: number;
  tries: number;
  explain: string;
};

export type Summary = {
  tries: number;
  correct: number;
  skills: SkillStat[];
  familiar: SkillStat | null;
  shaky: SkillStat | null;
  missed: MissedQuestion[];
};

export function summarize(attempts: Attempt[]): Summary {
  const skills = (Object.keys(skillInfo) as AttemptSkill[]).map((skill) => {
    const rows = attempts.filter((item) => item.skill === skill);
    const correct = rows.filter((item) => item.ok).length;
    return {
      skill,
      ...skillInfo[skill],
      tries: rows.length,
      correct,
      rate: rows.length ? correct / rows.length : 0,
    };
  });

  const played = skills.filter((item) => item.tries > 0);
  const byBest = [...played].sort((a, b) => b.rate - a.rate || b.tries - a.tries);
  const weak = played
    .filter((item) => item.correct < item.tries)
    .sort((a, b) => a.rate - b.rate || b.tries - a.tries);

  let familiar: SkillStat | null = byBest[0] ?? null;
  let shaky: SkillStat | null = weak[0] ?? null;
  if (familiar && shaky && familiar.skill === shaky.skill) {
    if (familiar.rate >= 0.8) shaky = null;
    else familiar = null;
  }

  const missedMap = new Map<string, MissedQuestion>();
  for (const attempt of attempts) {
    const current = missedMap.get(attempt.id) ?? {
      id: attempt.id,
      prompt: attempt.prompt,
      skill: attempt.skill,
      misses: 0,
      tries: 0,
      explain: explainFor(attempt.id),
    };
    current.tries += 1;
    if (!attempt.ok) current.misses += 1;
    missedMap.set(attempt.id, current);
  }

  const missed = [...missedMap.values()]
    .filter((item) => item.misses > 0)
    .sort((a, b) => b.misses - a.misses || b.tries - a.tries)
    .slice(0, 3);

  return {
    tries: attempts.length,
    correct: attempts.filter((item) => item.ok).length,
    skills,
    familiar,
    shaky,
    missed,
  };
}

function explainFor(id: string) {
  if (id === "rhyme-order") return "順序係 glue、floor、ticks、straight、pen。";
  return questions.find((item) => item.id === id)?.explain ?? "";
}
