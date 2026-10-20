const marks = new Set(["?", ".", "!", ","]);

export function isBlank(question: { prompt: string }) {
  return question.prompt.includes("___");
}

export function matchesBlank(answer: string, typed: string) {
  const given = typed.trim().replace(/\s+/g, " ");
  if (!given) return false;
  if (marks.has(answer)) return given === answer;
  return given.toLowerCase() === answer.toLowerCase();
}
