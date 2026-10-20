import fs from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL || "http://127.0.0.1:43123";
const CHROME = process.env.CHROME_PATH || "/usr/bin/google-chrome";

const expectedAnswers = {
  "How old are you?": "I am six years old.",
  "What is your name?": "My name is Lily.",
  "It is 8 o'clock in the morning. What do you say?": "Good morning.",
  "It is 2 o'clock in the afternoon. What do you say?": "Good afternoon.",
  "A new friend says: Nice to meet you.": "Nice to meet you too.",
  "How do you spell the name Lily?": "L-I-L-Y",
  "Jack is seven. Ken is six. Who is older?": "Jack",
  "Which card is correct?": "Dear Lily, Happy birthday! From Ken",
  "This is Wendy. ___ is my classmate.": "She",
  "This is Ted. ___ is our group leader.": "He",
  "Kate and Wendy are together. ___ are in Class 1A.": "We",
  "Kate talks about her own friend: She is ___ best friend.": "my",
  "Sue helps the teacher. Sue is a girl. She is the ___.": "monitress",
  "The English teacher is a man. We call him ___.": "Mr Brown",
  "Which sentence is correct?": "My name is Judy Lee.",
  "Miss Ma is not married. Mrs Hill is married. Which title is for a married woman?": "Mrs",
  "I ___ a pencil.": "have",
  "She ___ an eraser.": "has",
  "He ___ two water bottles.": "has",
  "Choose a or an: ___ orange": "an",
  "Choose a or an: ___ book": "a",
  "Choose a or an: ___ umbrella": "an",
  "What is the word for 8?": "eight",
  "One eraser. Three ___.": "erasers",
  "I have one pen. I can also say: I have ___ pen.": "a",
  "What is your name___": "?",
  "Help___": "!",
  "I am six years old___": ".",
  "You are great ___ Super Boy.": ",",
  "Which word starts with h?": "happy",
  "Which word starts with m?": "morning",
  "Which word starts with y?": "your",
  "Which word starts with b?": "boy",
  "Which word starts with t?": "ten",
  "Which word has the -en sound?": "pen",
  "Which word starts with p?": "pencil",
  "Which word starts with g?": "girl",
};

const expectedExplains = {
  "How old are you?": "For an age, say I am ... years old.",
  "Kate talks about her own friend: She is ___ best friend.":
    "Your own friend uses my. The class teacher uses our: He is our English teacher.",
  "You are great ___ Super Boy.": "Put a comma before a name: You are great, Super Boy.",
  "Choose a or an: ___ book": "Say a book.",
  "Choose a or an: ___ orange": "Words that start with a, e, i, o, or u usually use an: an orange, an eraser, an apple.",
};

const rhyme = [
  "One, two, take out your glue.",
  "Three, four, touch the floor.",
  "Five, six, write some ticks.",
  "Seven, eight, sit up straight.",
  "Nine, ten, put down your pen.",
];

const rewards = [
  { need: 30, emoji: "🧽", name: "Runaway eraser" },
  { need: 60, emoji: "🎩", name: "Birthday hat" },
  { need: 100, emoji: "🧣", name: "Flying cape" },
  { need: 150, emoji: "👑", name: "Cake crown" },
  { need: 220, emoji: "🎒", name: "Golden bag" },
  { need: 300, emoji: "🏅", name: "Super medal" },
];

const levels = [
  { name: "Birthday classroom", skill: "greetings", label: "Greetings, names, and ages" },
  { name: "Cake-hat teacher", skill: "people", label: "People at school" },
  { name: "Bag escape", skill: "bag", label: "School bag and numbers" },
  { name: "Letter circus", skill: "phonics", label: "Letter sounds" },
  { name: "Punctuation fight", skill: "marks", label: "Punctuation" },
];

function grab(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
  if (!match) throw new Error(`missing ${name}`);
  return JSON.parse(`"${match[1]}"`);
}

function loadContent() {
  const src = fs.readFileSync(new URL("../lib/content.ts", import.meta.url), "utf8");
  const progress = fs.readFileSync(new URL("../lib/progress.ts", import.meta.url), "utf8");
  const body = src.split("export const questions: Question[] = [")[1].split("export const games")[0];
  const questions = body
    .split(/\n  \{/)
    .slice(1)
    .map((block) => {
      const choices = [...block.match(/choices:\s*\[([\s\S]*?)\]/)[1].matchAll(/"((?:\\.|[^"\\])*)"/g)].map((item) =>
        JSON.parse(`"${item[1]}"`),
      );
      return {
        id: grab(block, "id"),
        unit: Number(block.match(/unit:\s*(\d+)/)[1]),
        skill: grab(block, "skill"),
        prompt: grab(block, "prompt"),
        hint: grab(block, "hint"),
        answer: grab(block, "answer"),
        explain: grab(block, "explain"),
        choices,
      };
    });
  const rhymeBlock = src.split("export const rhyme = [")[1].split("];")[0];
  const rhymeLines = [...rhymeBlock.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((item) => JSON.parse(`"${item[1]}"`));
  const needs = [...progress.matchAll(/need:\s*(\d+)/g)].map((item) => Number(item[1]));
  return { questions, rhymeLines, needs, src };
}

function assertContent() {
  const { questions, rhymeLines, needs, src } = loadContent();
  if (questions.length !== 37) throw new Error(`expected 37 questions, found ${questions.length}`);
  if (Object.keys(expectedAnswers).length !== questions.length) throw new Error("spec is missing a question");
  const counts = {};
  for (const question of questions) {
    counts[question.skill] = (counts[question.skill] ?? 0) + 1;
    if (expectedAnswers[question.prompt] !== question.answer) {
      throw new Error(`answer mismatch for ${question.id}: ${question.answer}`);
    }
    if (expectedExplains[question.prompt] && expectedExplains[question.prompt] !== question.explain) {
      throw new Error(`explain mismatch for ${question.id}`);
    }
    if (!question.choices.includes(question.answer)) throw new Error(`${question.id} answer is not a choice`);
    if (question.prompt.includes("___") && question.prompt.split("___").length !== 2) {
      throw new Error(`${question.id} should have one gap`);
    }
    if (new Set(question.choices).size !== question.choices.length) throw new Error(`${question.id} has a repeated choice`);
    if (![1, 2, 4].includes(question.unit)) throw new Error(`${question.id} is outside Units 1, 2, and 4`);
  }
  const expectedCounts = { greetings: 8, people: 8, bag: 9, phonics: 8, marks: 4 };
  for (const [skill, count] of Object.entries(expectedCounts)) {
    if (counts[skill] !== count) throw new Error(`skill counts ${JSON.stringify(counts)}`);
  }
  if (JSON.stringify(rhymeLines) !== JSON.stringify(rhyme)) throw new Error("rhyme order mismatch");
  if (JSON.stringify(needs) !== JSON.stringify(rewards.map((item) => item.need))) throw new Error("reward thresholds mismatch");
  if (src.includes("id: 3")) throw new Error("Unit 3 is still in the content");
  const blanks = questions.filter((question) => question.prompt.includes("___"));
  if (blanks.length !== 18) throw new Error(`expected 18 fill-in questions, found ${blanks.length}`);
  return new Map(questions.map((question) => [question.prompt, question]));
}

function assertEnglish(text, where) {
  const hit = text.match(/[\u4e00-\u9fff]/);
  if (hit) {
    const at = text.indexOf(hit[0]);
    throw new Error(`${where} still has Chinese: ${text.slice(Math.max(0, at - 30), at + 30).replace(/\s+/g, " ")}`);
  }
}

function loadSpoken() {
  const src = fs.readFileSync(new URL("../lib/tell.ts", import.meta.url), "utf8");
  const body = src.split("const spoken")[1].split("export function choiceLabel")[0];
  const lines = new Map();
  const found = [
    ...body.matchAll(
      /\n  ([a-z]\d+): \{\n    ask: "((?:\\.|[^"\\])*)",\n    tell: "((?:\\.|[^"\\])*)",\n  \}/g,
    ),
  ];
  for (const match of found) {
    const id = match[1];
    const question = JSON.parse(`"${match[2]}"`);
    const answer = JSON.parse(`"${match[3]}"`);
    if (!question.endsWith("?")) throw new Error(`${id} question is not something you can ask: ${question}`);
    if (!/[.!?]$/.test(answer)) throw new Error(`${id} answer is not a sentence: ${answer}`);
    if (/\bblank\b/i.test(`${question} ${answer}`)) throw new Error(`${id} still says blank`);
    lines.set(id, { ask: question, tell: answer });
  }
  if (lines.size === 0) throw new Error("no spoken lines parsed");
  return lines;
}

const spoken = loadSpoken();
const bank = assertContent();
if (spoken.size !== bank.size) throw new Error(`spoken lines ${spoken.size}, questions ${bank.size}`);
for (const question of bank.values()) {
  if (!spoken.has(question.id)) throw new Error(`no spoken line for ${question.id}`);
}
const bySkill = new Map();
for (const question of bank.values()) {
  const list = bySkill.get(question.skill) ?? [];
  list.push(question);
  bySkill.set(question.skill, list);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});
const page = await browser.newPage();
page.setDefaultTimeout(30000);
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("dialog", async (dialog) => {
  pageErrors.push(`dialog: ${dialog.message()}`);
  await dialog.dismiss();
});

const failures = [];

async function check(name, fn) {
  const start = pageErrors.length;
  try {
    await fn();
    if (pageErrors.length > start) throw new Error(pageErrors.slice(start).join(" | "));
    console.log(`ok  ${name}`);
  } catch (error) {
    const shot = `/tmp/e2e-${name.replace(/[^\w]+/g, "-").slice(0, 40)}.png`;
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
    const snippet = await page.evaluate(() => document.body?.innerText?.slice(0, 500) ?? "").catch(() => "");
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${name}: ${message}\n${snippet}`);
    console.error(`FAIL ${name}: ${message}`);
  }
}

async function readCopy() {
  return page.evaluate(() => {
    const bits = [document.body.innerText, document.title];
    document.querySelectorAll("[aria-label], [placeholder], [title]").forEach((el) => {
      bits.push(el.getAttribute("aria-label") || "", el.getAttribute("placeholder") || "", el.getAttribute("title") || "");
    });
    return bits.join("\n");
  });
}

async function goto(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0" });
  await page.waitForSelector("header");
}

async function reset() {
  await goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
}

function matchesChoice(value, needle) {
  return value === needle || value.startsWith(`${needle} `);
}

async function clickExact(text) {
  const result = await page.evaluate((needle) => {
    const nodes = [...document.querySelectorAll("button, a")];
    const node =
      nodes.find((item) => item.textContent.trim() === needle) ??
      nodes.find((item) => item.textContent.trim().startsWith(`${needle} `));
    if (!node) return "missing";
    if (node.disabled) return "disabled";
    node.click();
    return "clicked";
  }, text);
  if (result !== "clicked") throw new Error(`click ${JSON.stringify(text)}: ${result}`);
}

async function clickIncludes(text) {
  const ok = await page.evaluate((needle) => {
    const nodes = [...document.querySelectorAll("button, a")].filter((item) => item.textContent.includes(needle) && !item.disabled);
    nodes.sort((a, b) => a.textContent.length - b.textContent.length);
    if (!nodes[0]) return false;
    nodes[0].click();
    return true;
  }, text);
  if (!ok) throw new Error(`Could not click ${text}`);
}

async function waitText(text) {
  await page.waitForFunction((needle) => document.body.innerText.includes(needle), {}, text);
}

async function pointsOf() {
  return page.evaluate(() => {
    const raw = localStorage.getItem("sunny-class-progress");
    if (!raw) return 0;
    return JSON.parse(raw).points ?? 0;
  });
}

async function waitHeader(points) {
  await page.waitForFunction((expected) => {
    const pill = [...document.querySelectorAll("header p")].map((el) => el.textContent).join(" ");
    return new RegExp(`🪙\\s*${expected}(?!\\d)`).test(pill);
  }, {}, points);
}

async function setField(index, value) {
  await page.evaluate((index, value) => {
    const input = document.querySelectorAll("input:not([type=checkbox])")[index];
    const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
    proto.set.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, index, value);
}

async function setSelect(index, value) {
  await page.evaluate((index, value) => {
    const select = document.querySelectorAll("select")[index];
    const proto = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value");
    proto.set.call(select, value);
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }, index, value);
}

async function openLevel(name) {
  await clickIncludes(name);
  await page.waitForSelector("h2");
}

async function promptOf() {
  return page.$eval("[data-prompt]", (el) => el.getAttribute("data-prompt"));
}

function typedBlank(question, correct) {
  if (correct) return /[A-Za-z]/.test(question.answer) ? question.answer.toLowerCase() : question.answer;
  return question.choices.find((item) => item !== question.answer);
}

async function assertShape(question) {
  const blank = question.prompt.includes("___");
  const hasGap = (await page.$("input[aria-label='Missing word']")) !== null;
  if (blank !== hasGap) throw new Error(`${question.prompt} gap ${hasGap}, expected ${blank}`);
  if (!blank) return;
  const leaked = await page.evaluate((choices) => {
    const buttons = [...document.querySelectorAll("button")].map((item) => item.textContent.trim());
    return choices.filter((choice) => buttons.some((text) => text === choice || text.startsWith(`${choice} `)));
  }, question.choices);
  if (leaked.length) throw new Error(`${question.prompt} still shows choices: ${leaked.join(", ")}`);
}

async function fillGap(text) {
  await page.$eval(
    "input[aria-label='Missing word']",
    (el, value) => {
      const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      proto.set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    },
    text,
  );
  await page.waitForFunction(() => {
    const button = [...document.querySelectorAll("button")].find((item) => item.textContent.trim() === "Check the gap");
    return button && !button.disabled;
  });
  await clickExact("Check the gap");
}

async function deckTotal() {
  return page.evaluate(() => {
    const pill = [...document.querySelectorAll("p")].map((el) => el.textContent).find((text) => /\d+\/\d+/.test(text));
    return Number(pill.match(/(\d+)\/(\d+)/)[2]);
  });
}

async function answerDash(correct) {
  const prompt = await promptOf();
  const question = bank.get(prompt);
  if (!question) throw new Error(`unknown prompt ${prompt}`);
  await waitText(question.hint);
  const choice = correct ? question.answer : question.choices.find((item) => item !== question.answer);
  const before = await pointsOf();
  const ask = await page.$eval("[data-ask]", (el) => el.textContent.trim());
  const script = spoken.get(question.id);
  if (ask !== `Say to him: ${script.ask}`) throw new Error(`say line for ${prompt}: ${ask}`);
  await assertShape(question);
  if (question.prompt.includes("___")) await fillGap(typedBlank(question, correct));
  else await clickExact(choice);
  await waitText(question.explain);
  if (question.prompt.includes("___")) {
    const filled = await page.$eval("[data-filled]", (el) => el.textContent.trim());
    if (filled !== question.answer) throw new Error(`filled answer for ${prompt} was ${filled}`);
  } else {
    const marked = await page.evaluate(() => {
      const green = [...document.querySelectorAll("button")].find((item) => item.className.includes("border-emerald-500"));
      return green ? green.textContent.trim() : "";
    });
    if (!matchesChoice(marked, question.answer)) throw new Error(`green answer for ${prompt} was ${marked}`);
  }
  const told = await page.$eval("[data-tell]", (el) => el.textContent.trim());
  if (told !== `Tell him: ${script.tell}`) throw new Error(`tell line for ${prompt}: ${told}`);
  const after = await pointsOf();
  if (question.prompt.includes("___")) {
    const guard = await page.evaluate(() => {
      const input = document.querySelector("input[aria-label='Missing word']");
      if (!input?.disabled) return "still-open";
      const node = [...document.querySelectorAll("button")].find((item) => item.textContent.trim() === "Check the gap");
      if (node && !node.disabled) {
        node.click();
        return "not-disabled";
      }
      return "blocked";
    });
    if (guard !== "blocked") throw new Error(`a second gap answer was accepted for ${prompt}: ${guard}`);
    if ((await pointsOf()) !== after) throw new Error(`points changed after a blocked gap on ${prompt}`);
  } else if (!correct) {
    const guard = await page.evaluate((needle) => {
      const nodes = [...document.querySelectorAll("button")];
      const node =
        nodes.find((item) => item.textContent.trim() === needle) ??
        nodes.find((item) => item.textContent.trim().startsWith(`${needle} `));
      if (!node?.disabled) return "not-disabled";
      node.click();
      return "blocked";
    }, question.answer);
    if (guard !== "blocked") throw new Error(`a second click was accepted for ${prompt}`);
    if ((await pointsOf()) !== after) throw new Error(`points changed after a blocked click on ${prompt}`);
  }
  return { prompt, question, before, after };
}

async function playRound(level, choose) {
  await openLevel(level.name);
  return answerLevel(level, choose);
}

async function answerLevel(level, choose) {
  const total = await deckTotal();
  const expectedTotal = Math.min(5, bySkill.get(level.skill).length);
  if (total !== expectedTotal) throw new Error(`${level.name} dealt ${total}, expected ${expectedTotal}`);
  let streak = 0;
  let round = 0;
  let correctCount = 0;
  const start = await pointsOf();
  const seen = [];
  const outcomes = [];
  for (let step = 0; step < total; step += 1) {
    const prompt = await promptOf();
    if (step === 0) {
      await page.click("button[aria-label='Read the question']");
      if ((await promptOf()) !== prompt) throw new Error("reading the question changed it");
    }
    const correct = choose(prompt, step, total);
    const result = await answerDash(correct);
    if (correct) {
      const next = streak + 1;
      const bonus = next >= 3 ? 10 : next === 2 ? 5 : 0;
      if (result.after - result.before !== 10 + bonus) {
        throw new Error(`${prompt} scored ${result.after - result.before}, expected ${10 + bonus}`);
      }
      await waitText(`+${10 + bonus} points`);
      if (next > 1) await waitText(`streak ${next}`);
      streak = next;
      round += 10 + bonus;
      correctCount += 1;
    } else {
      if (result.after !== result.before) throw new Error(`${prompt} awarded points for a miss`);
      await page.waitForFunction(() => !document.body.innerText.includes("streak "));
      streak = 0;
    }
    seen.push(prompt);
    outcomes.push({ prompt, correct });
    const nextLabel = step === total - 1 ? "See the cake score" : "Next square";
    await clickExact(nextLabel);
    if (step < total - 1) {
      await page.waitForFunction((prev) => document.querySelector("[data-prompt]")?.getAttribute("data-prompt") !== prev, {}, prompt);
    }
  }
  const perfect = correctCount === total;
  const expectedRound = round + (perfect ? 30 : 0);
  const expectedPoints = start + expectedRound;
  await waitText(`${correctCount} / ${total} correct`);
  await waitText(`This level +${expectedRound}`);
  await waitText(`Total points ${expectedPoints}`);
  const title = perfect ? "Flying cake hero" : correctCount >= Math.ceil(total / 2) ? "Eraser hero" : "Bag still open";
  await waitText(title);
  await waitText(perfect ? "All correct! You can fly now!" : "Play again. Points still add up.");
  await waitText(`So far, ${level.label}:`);
  if (correctCount === 0 && !(await readCopy()).includes("🍌")) throw new Error("a missed level should show the silly hero");
  if ((await pointsOf()) !== expectedPoints) throw new Error("stored points do not match the level score");
  await waitHeader(expectedPoints);
  const text = await readCopy();
  for (const reward of rewards) {
    const crossed = start < reward.need && expectedPoints >= reward.need;
    const label = `New reward ${reward.emoji} ${reward.name}`;
    if (crossed !== text.includes(label)) throw new Error(`${crossed ? "missing" : "unexpected"} ${label}`);
  }
  assertEnglish(text, level.name);
  return { total, correctCount, seen, outcomes, points: expectedPoints };
}

async function backToMap() {
  await clickExact("Back to the map");
  await waitText("School Dash");
}

async function bestLine(levelName) {
  return page.evaluate((name) => {
    const button = [...document.querySelectorAll("button")].find((item) => item.textContent.includes(name));
    return button?.innerText.match(/Best .+/)?.[0] ?? "";
  }, levelName);
}

try {
  await page.setViewport({ width: 1280, height: 900 });

  await check("content spec matches the question bank", async () => {
    if (bank.size !== 37) throw new Error("bank was not loaded");
  });

  await check("every page is English on desktop and phone", async () => {
    await reset();
    for (const width of [1280, 390]) {
      await page.setViewport({ width, height: width === 390 ? 844 : 900 });
      for (const route of ["/", "/play", "/learn", "/scope", "/quiz", "/write", "/report"]) {
        await goto(route);
        await page.waitForFunction(() => document.body.innerText.length > 40);
        assertEnglish(await readCopy(), route);
        const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (extra > 4) throw new Error(`${route} at ${width}px overflows by ${extra}px`);
      }
    }
    await page.setViewport({ width: 1280, height: 900 });
  });

  await check("home doors, empty score, and navigation", async () => {
    await reset();
    const home = await readCopy();
    for (const line of ["School Dash", "Start playing", "Word cards", "Exam scope", "Practice quiz", "Birthday card", "Score report", "Ten minutes a day", "Points 0", "Next reward 🧽 in 30", "Best quiz 0/8", "Birthday card not yet", "30 more for 🧽 Runaway eraser", "Unlock at 30"]) {
      if (!home.includes(line)) throw new Error(`home missing ${line}`);
    }
    if (home.includes("The eraser stays and helps you.")) throw new Error("a locked reward showed its owned line");
    const doors = [
      ["Word cards", "/learn"],
      ["Exam scope", "/scope"],
      ["Practice quiz", "/quiz"],
      ["Birthday card", "/write"],
      ["Score report", "/report"],
      ["Start playing", "/play"],
    ];
    for (const [label, path] of doors) {
      await goto("/");
      await clickIncludes(label);
      await page.waitForFunction((expected) => location.pathname === expected, {}, path);
    }
    for (const [label, path] of [
      ["Home", "/"],
      ["Scope", "/scope"],
      ["Words", "/learn"],
      ["Dash", "/play"],
      ["Quiz", "/quiz"],
      ["Write", "/write"],
    ]) {
      await clickExact(label);
      await page.waitForFunction((expected) => location.pathname === expected, {}, path);
    }
    await page.evaluate(() => document.querySelector("header a").click());
    await page.waitForFunction(() => location.pathname === "/");
    await page.setViewport({ width: 390, height: 844 });
    await goto("/learn");
    await clickExact("Home");
    await page.waitForFunction(() => location.pathname === "/");
    if (!(await readCopy()).includes("Home") || !(await readCopy()).includes("Dash")) throw new Error("phone nav missing");
    await page.setViewport({ width: 1280, height: 900 });
  });

  await check("word cards for every unit", async () => {
    await reset();
    await goto("/learn");
    const units = [
      ["Unit 1", "morning", "What is your name? My name is Lily.", "starts with h"],
      ["Unit 2", "classmate", "This is Wendy. She is my classmate.", "starts with b"],
      ["Unit 4", "school bag", "I have a pen. He has an eraser. She has three pencils.", "ends with -en"],
    ];
    for (const [unit, word, pattern, sound] of units) {
      await clickIncludes(unit);
      await waitText(word);
      await waitText(pattern);
      await waitText(sound);
      const words = await page.$$eval("article h2", (els) => els.map((el) => el.textContent.trim()));
      if (!words.includes(word)) throw new Error(`${unit} did not list ${word}`);
      for (const item of words) {
        await page.evaluate((item) => {
          const article = [...document.querySelectorAll("article")].find((el) => el.querySelector("h2")?.textContent.trim() === item);
          [...article.querySelectorAll("button")].find((button) => button.textContent.includes("Spell it")).click();
        }, item);
        await waitText(item.split("").join("-").toUpperCase());
        await page.evaluate((item) => {
          const article = [...document.querySelectorAll("article")].find((el) => el.querySelector("h2")?.textContent.trim() === item);
          [...article.querySelectorAll("button")].filter((button) => button.textContent.trim() !== "").at(-1).click();
        }, item);
        await page.waitForFunction((item) => {
          const article = [...document.querySelectorAll("article")].find((el) => el.querySelector("h2")?.textContent.trim() === item);
          return [...article.querySelectorAll("button")].some((button) => button.textContent.includes("Spell it"));
        }, {}, item);
      }
      await page.evaluate((sound) => {
        [...document.querySelectorAll("button")].find((button) => button.textContent.includes(sound)).click();
      }, sound);
      if (page.url().includes("/learn") === false) throw new Error("phonics click left the word page");
    }
    if ((await readCopy()).includes("Unit 3")) throw new Error("Unit 3 appeared on the word cards");
    assertEnglish(await readCopy(), "learn");
  });

  await check("scope checklist, rhyme, and bad saved data", async () => {
    await reset();
    await goto("/scope");
    const scope = await readCopy();
    for (const line of ["What this English exam covers", "Chapter 3 is out of this exam", "Jack Poon", "Kate Wood", "Super Boy", "How the paper usually asks", "The night before", "Revision list 0/14"]) {
      if (!scope.includes(line)) throw new Error(`scope missing ${line}`);
    }
    if (scope.includes("Unit 3")) throw new Error("scope listed Unit 3 as a unit");
    rhyme.forEach((line, index) => {
      if (!scope.includes(`${index + 1}. ${line}`)) throw new Error(`rhyme line ${index + 1} missing`);
    });
    const boxes = await page.$$("input[type=checkbox]");
    if (boxes.length !== 14) throw new Error(`expected 14 checklist rows, found ${boxes.length}`);
    for (let index = 0; index < boxes.length; index += 1) {
      await page.evaluate((index) => document.querySelectorAll("input[type=checkbox]")[index].click(), index);
    }
    await waitText("Revision list 14/14");
    await page.evaluate(() => document.querySelector("input[type=checkbox]").click());
    await waitText("Revision list 13/14");
    await page.reload({ waitUntil: "networkidle0" });
    await waitText("Revision list 13/14");
    const flags = await page.$$eval("input[type=checkbox]", (els) => els.map((el) => el.checked));
    if (flags[0] || flags.slice(1).some((flag) => !flag)) throw new Error("checklist did not persist");
    for (let index = 1; index < 14; index += 1) {
      await page.evaluate((index) => document.querySelectorAll("input[type=checkbox]")[index].click(), index);
    }
    await waitText("Revision list 0/14");
    await page.reload({ waitUntil: "networkidle0" });
    await waitText("Revision list 0/14");
    await page.evaluate(() => localStorage.setItem("sunny-class-checklist", JSON.stringify(["u1w", "not-a-real-id"])));
    await page.reload({ waitUntil: "networkidle0" });
    await waitText("Revision list 1/14");
    if (!(await page.$eval("input[type=checkbox]", (el) => el.checked))) throw new Error("known id was dropped");
    for (const raw of ["{", "{\"a\":1}", "null"]) {
      await page.evaluate((raw) => localStorage.setItem("sunny-class-checklist", raw), raw);
      await page.reload({ waitUntil: "networkidle0" });
      await waitText("What this English exam covers");
      await waitText("Revision list 0/14");
    }
  });

  await check("writing cards, names, people, and the comic", async () => {
    await reset();
    await goto("/write");
    await clickExact("dear lily\nhappy birthday\nfrom ken");
    await waitText("Look at the green card. Dear and the names need capital letters.");
    await clickExact("From Lily,\nDear Ken\nBirthday happy");
    await waitText("Look at the green card. Dear and the names need capital letters.");
    await clickExact("Dear Lily,\nHappy birthday!\nFrom Ken");
    await waitText("This card has all three parts, and the names start with capitals.");
    await setField(0, "lily");
    await setField(1, "Ken");
    if ((await readCopy()).includes("I finished it")) throw new Error("a lowercase name was accepted");
    await setField(0, "Lily");
    await setField(1, "ken");
    if ((await readCopy()).includes("I finished it")) throw new Error("a lowercase writer name was accepted");
    await setField(0, "Lily1");
    await setField(1, "Ken");
    if ((await readCopy()).includes("I finished it")) throw new Error("a number in a name was accepted");
    await setField(0, "Lily Wong");
    await setField(1, "Ken Chan");
    await waitText("Dear Lily Wong,");
    await waitText("From Ken Chan");
    await clickExact("Read the card");
    await clickExact("I finished it");
    await waitText("Reward +20 points");
    await waitText("Saved");
    if ((await pointsOf()) !== 20) throw new Error("the first card did not add 20");
    await waitHeader(20);
    await setField(1, "Ken");
    await waitText("I finished it");
    await clickExact("I finished it");
    if ((await pointsOf()) !== 20) throw new Error("editing the card paid the bonus again");
    await page.reload({ waitUntil: "networkidle0" });
    await setField(0, "Lily");
    await setField(1, "Ken");
    await clickExact("I finished it");
    await waitText("Saved");
    if ((await readCopy()).includes("Reward +20 points")) throw new Error("reloading paid the card bonus again");
    if ((await pointsOf()) !== 20) throw new Error("points changed on the second visit");
    await setField(2, "amy");
    await waitText("A name starts with a capital letter, like Amy or Tom.");
    await setField(2, "Amy");
    await setField(3, "Tom");
    await setSelect(0, "eight");
    await setSelect(1, "She");
    await setSelect(2, "best friend");
    await waitText("My name is Amy.");
    await waitText("I am eight years old.");
    await waitText("This is Tom.");
    await waitText("She is my best friend.");
    await clickExact("Read the four lines");
    await clickExact("you are great, super boy.");
    await waitText("Look at the green line. Put a comma before Super Boy.");
    await clickExact("You are great Super Boy");
    await waitText("Look at the green line. Put a comma before Super Boy.");
    await clickExact("You are great, Super Boy!");
    await waitText("The comma sits before the name, and the shout ends with !.");
    await goto("/");
    if (!(await readCopy()).includes("Birthday card done")) throw new Error("home did not mark the card done");
    if (!(await readCopy()).includes("Points 20")) throw new Error("home points did not include the card");
  });

  await check("dash map, leaving early, and a refresh", async () => {
    await reset();
    await goto("/play");
    for (const level of levels) {
      if (!(await readCopy()).includes(level.name)) throw new Error(`map missing ${level.name}`);
      if ((await bestLine(level.name)) !== "Best not played") throw new Error(`${level.name} should be unplayed`);
    }
    if ((await bestLine("Floor rhyme")) !== "Best not played") throw new Error("rhyme should be unplayed");
    await page.setViewport({ width: 390, height: 844 });
    await openLevel("Birthday classroom");
    const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (extra > 4) throw new Error(`question screen overflows by ${extra}px`);
    await clickExact("← Map");
    await waitText("Best not played");
    await page.setViewport({ width: 1280, height: 900 });
    await openLevel("Birthday classroom");
    await answerDash(true);
    if ((await pointsOf()) !== 10) throw new Error("the first answer should be +10");
    await clickExact("← Map");
    if ((await bestLine("Birthday classroom")) !== "Best not played") throw new Error("an unfinished level saved a best score");
    await page.reload({ waitUntil: "networkidle0" });
    await waitText("School Dash");
    if ((await pointsOf()) !== 10) throw new Error("refresh dropped the points");
    if ((await bestLine("Birthday classroom")) !== "Best not played") throw new Error("refresh invented a best score");
    await waitHeader(10);
  });

  await check("perfect, mixed, and missed levels", async () => {
    await reset();
    await goto("/play");
    const perfect = await playRound(levels[0], () => true);
    if (perfect.points !== 115 || perfect.correctCount !== 5) throw new Error(`perfect level was ${perfect.points}`);
    await backToMap();
    if ((await bestLine("Birthday classroom")) !== "Best 5 cakes") throw new Error("perfect best score was not saved");
    await playRound(levels[4], (_prompt, step) => step === 0);
    await backToMap();
    if ((await bestLine("Punctuation fight")) !== "Best 1 cakes") throw new Error("one correct mark should save 1 cake");
    await reset();
    await goto("/play");
    await playRound(levels[0], (_prompt, step) => step < 4);
    await waitText("No shaky type yet");
    await waitText("Most familiar");
    await waitText("Missed most often");
    if ((await readCopy()).includes("No clear strength yet")) throw new Error("4 of 5 should still count as familiar");
    await backToMap();
    await reset();
    await goto("/play");
    await playRound(levels[0], (_prompt, step) => step < 3);
    await waitText("No clear strength yet");
    await waitText("Needs more practice");
    await waitText("Greetings, names, and ages");
    await reset();
    await goto("/play");
    await playRound(levels[3], () => false);
    await waitText("No clear strength yet");
    await waitText("Letter sounds");
    await backToMap();
    if ((await bestLine("Letter circus")) !== "Best 0 cakes") throw new Error("a zero score looked unplayed");
    await playRound(levels[3], () => false);
    await waitText("So far, Letter sounds: 0 correct out of 10.");
    const misses = await page.evaluate(() =>
      [...document.querySelectorAll("li")]
        .map((item) => item.innerText.match(/missed (\d+) time/))
        .filter(Boolean)
        .map((match) => Number(match[1])),
    );
    if (misses[0] < 2) throw new Error(`expected a repeated miss, saw ${misses.join(",")}`);
    for (let index = 1; index < misses.length; index += 1) {
      if (misses[index] > misses[index - 1]) throw new Error("missed questions are out of order");
    }
  });

  await check("best score never falls and the full report opens", async () => {
    await reset();
    await goto("/play");
    await playRound(levels[1], () => true);
    await clickExact("Play this level again");
    await page.waitForSelector("h2");
    await answerLevel(levels[1], (_prompt, step) => step === 0);
    await backToMap();
    if ((await bestLine("Cake-hat teacher")) !== "Best 5 cakes") throw new Error("a worse replay replaced the best score");
    await clickIncludes("Cake-hat teacher");
    await clickExact("← Map");
    await clickIncludes("See the report after you play");
    await page.waitForFunction(() => location.pathname === "/report");
    await waitText("People at school");
    await goto("/play");
    await playRound(levels[2], () => true);
    await clickExact("Full report");
    await page.waitForFunction(() => location.pathname === "/report");
    await waitText("School bag and numbers");
    await clickExact("Back to the dash");
    await page.waitForFunction(() => location.pathname === "/play");
  });

  await check("rhyme wrong order then right order", async () => {
    await reset();
    await goto("/play");
    await clickIncludes("Floor rhyme");
    await waitText("Rhyme floor");
    const blocked = await page.evaluate(() => [...document.querySelectorAll("button")].find((item) => item.textContent.includes("Done. Check it")).disabled);
    if (!blocked) throw new Error("the rhyme check should wait for five lines");
    for (const line of [...rhyme].reverse()) await clickExact(line);
    await clickExact("Done. Check it");
    await waitText("0 / 5 correct");
    await waitText("This level +5");
    await waitText("Bag still open");
    await waitText("Play again. Points still add up.");
    if ((await pointsOf()) !== 5) throw new Error("a wrong rhyme should still add 5");
    if ((await readCopy()).includes("New reward")) throw new Error("5 points unlocked a reward");
    await backToMap();
    if ((await bestLine("Floor rhyme")) !== "Best 0 cakes") throw new Error("wrong rhyme should save 0 cakes");
    await clickIncludes("Floor rhyme");
    for (const line of rhyme) await clickExact(line);
    await clickExact("Done. Check it");
    await waitText("5 / 5 correct");
    await waitText("This level +30");
    await waitText("Flying cake hero");
    await waitText("New reward 🧽 Runaway eraser");
    await waitText("The order ends with glue, floor, ticks, straight, pen.");
    if ((await pointsOf()) !== 35) throw new Error(`rhyme total should be 35, was ${await pointsOf()}`);
    await backToMap();
    if ((await bestLine("Floor rhyme")) !== "Best 5 cakes") throw new Error("correct rhyme should save 5 cakes");
  });

  await check("three perfect levels unlock every reward", async () => {
    await reset();
    await goto("/play");
    await playRound(levels[0], () => true);
    await backToMap();
    await playRound(levels[1], () => true);
    await backToMap();
    await playRound(levels[2], () => true);
    if ((await pointsOf()) !== 345) throw new Error(`three perfect levels should be 345, was ${await pointsOf()}`);
    await backToMap();
    await waitText("Every reward is unlocked!");
    for (const reward of rewards) {
      if (!(await readCopy()).includes(reward.name)) throw new Error(`shelf missing ${reward.name}`);
    }
    await page.reload({ waitUntil: "networkidle0" });
    if ((await bestLine("Birthday classroom")) !== "Best 5 cakes") throw new Error("best score did not survive reload");
    if ((await bestLine("Letter circus")) !== "Best not played") throw new Error("an unplayed level changed");
    await goto("/");
    const home = await readCopy();
    if (!home.includes("Points 345") || !home.includes("Every reward is unlocked")) throw new Error("home did not show a full shelf");
  });

  await check("report picks the stronger skill and the busier tie", async () => {
    await reset();
    await goto("/play");
    await playRound(levels[0], () => true);
    await backToMap();
    await playRound(levels[1], () => true);
    await waitText("Most familiar");
    const familiar = await page.evaluate(() => document.querySelector("article h3")?.textContent ?? "");
    if (!familiar.includes("Greetings, names, and ages")) throw new Error(`tie should stay with greetings, saw ${familiar}`);
    await backToMap();
    await playRound(levels[1], () => true);
    const nextFamiliar = await page.evaluate(() => document.querySelector("article h3")?.textContent ?? "");
    if (!nextFamiliar.includes("People at school")) throw new Error(`more tries should win the tie, saw ${nextFamiliar}`);
    await waitText("No shaky type yet");
  });

  await check("quiz scores 0, 5, 6, and a perfect 8", async () => {
    await reset();
    await goto("/quiz");
    if ((await readCopy()).includes("Play again")) throw new Error("a new quiz should start with Start");
    const rounds = [
      { correct: 5, points: 50, best: 5, tone: "That is fine. Listen to the answer, then try again.", perfect: false },
      { correct: 6, points: 110, best: 6, tone: "Nice work. Play again, or try another game.", perfect: false },
      { correct: 8, points: 210, best: 8, tone: "Nice work. Play again, or try another game.", perfect: true },
      { correct: 0, points: 210, best: 8, tone: "That is fine. Listen to the answer, then try again.", perfect: false },
    ];
    for (const [index, round] of rounds.entries()) {
      await clickExact(index === 0 ? "Start" : "Play again");
      await page.waitForSelector("[data-prompt]");
      let score = 0;
      for (let step = 0; step < 8; step += 1) {
        const prompt = await promptOf();
        const question = bank.get(prompt);
        if (!question) throw new Error(`quiz prompt missing from the bank: ${prompt}`);
        const ask = await page.$eval("[data-ask]", (el) => el.textContent.trim());
        const script = spoken.get(question.id);
        if (ask !== `Say to him: ${script.ask}`) throw new Error(`quiz say line for ${prompt}: ${ask}`);
        await assertShape(question);
        if (step === 0) await page.click("button[aria-label='Read the question']");
        const right = step < round.correct;
        if (question.prompt.includes("___")) {
          await fillGap(typedBlank(question, right));
          if (right) {
            await waitText("Yes!");
            score += 1;
          } else {
            await waitText("Look at the correct answer.");
            await waitText(question.explain);
          }
          const filled = await page.$eval("[data-filled]", (el) => el.textContent.trim());
          if (filled !== question.answer) throw new Error(`quiz filled answer for ${prompt} was ${filled}`);
        } else if (right) {
          await clickExact(question.answer);
          await waitText("Yes!");
          score += 1;
        } else {
          await clickExact(question.choices.find((choice) => choice !== question.answer));
          await waitText("Look at the correct answer.");
          await waitText(question.explain);
        }
        const told = await page.$eval("[data-tell]", (el) => el.textContent.trim());
        if (told !== `Tell him: ${script.tell}`) throw new Error(`quiz tell line for ${prompt}: ${told}`);
        const before = await pointsOf();
        await page.evaluate((needle) => {
          const node = [...document.querySelectorAll("button")].find((item) => item.textContent.trim() === needle);
          node?.click();
        }, question.choices.find((choice) => choice !== (right ? "" : question.answer)) ?? question.answer);
        if ((await pointsOf()) !== before) throw new Error("a quiz answer could be changed");
        await clickExact(step === 7 ? "See the score" : "Next question");
        if (step < 7) {
          await page.waitForFunction((prev) => document.querySelector("[data-prompt]")?.getAttribute("data-prompt") !== prev, {}, prompt);
        }
      }
      await waitText(`This round: ${score}/8`);
      await waitText(round.tone);
      const text = await readCopy();
      if (text.includes("Perfect round +20 points") !== round.perfect) throw new Error(`perfect line for ${score}`);
      if ((await pointsOf()) !== round.points) throw new Error(`quiz points ${await pointsOf()} expected ${round.points}`);
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("sunny-class-progress")).bestQuiz);
      if (saved !== round.best) throw new Error(`best quiz ${saved} expected ${round.best}`);
    }
    await goto("/");
    const home = await readCopy();
    if (!home.includes("Best quiz 8/8") || !home.includes("Points 210")) throw new Error(`home after quiz: ${home.slice(0, 300)}`);
    if (!home.includes("10 more for 🎒 Golden bag") && !home.includes("Next reward 🎒 in 10")) {
      throw new Error("210 points should be 10 away from the golden bag");
    }
  });

  await check("every question can be answered right and wrong", async () => {
    await reset();
    await goto("/play");
    for (const level of levels) {
      const prompts = bySkill.get(level.skill).map((question) => question.prompt);
      const right = new Set();
      const wrong = new Set();
      let guard = 0;
      while ((right.size < prompts.length || wrong.size < prompts.length) && guard < 30) {
        guard += 1;
        const round = await playRound(level, (prompt) => wrong.has(prompt));
        for (const item of round.outcomes) {
          if (item.correct) right.add(item.prompt);
          else wrong.add(item.prompt);
        }
        await backToMap();
      }
      const missedRight = prompts.filter((prompt) => !right.has(prompt));
      const missedWrong = prompts.filter((prompt) => !wrong.has(prompt));
      if (missedRight.length || missedWrong.length) {
        throw new Error(`${level.name} uncovered right ${missedRight.length} wrong ${missedWrong.length} after ${guard} rounds`);
      }
    }
    await goto("/report");
    assertEnglish(await readCopy(), "report after full coverage");
    await waitText("Most familiar");
    await waitText("Needs more practice");
    await waitText("Missed most often");
    const header = await pointsOf();
    await waitHeader(header);
  });

  await check("broken saved games do not crash a page", async () => {
    await reset();
    await page.evaluate(() => {
      localStorage.setItem("sunny-class-progress", "{");
      localStorage.setItem("sunny-class-attempts", "{");
      localStorage.setItem("sunny-dash-best", "[1,2]");
      localStorage.setItem("sunny-class-checklist", "{");
    });
    for (const route of ["/", "/play", "/learn", "/scope", "/quiz", "/write", "/report"]) {
      await goto(route);
      await page.waitForFunction(() => document.body.innerText.length > 40);
      assertEnglish(await readCopy(), `corrupt ${route}`);
    }
    await goto("/play");
    await waitText("Best not played");
  });
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} failed`);
  process.exit(1);
}
console.log("\nall e2e checks passed");
