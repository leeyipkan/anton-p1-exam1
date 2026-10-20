import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL || "http://127.0.0.1:43123";
const CHROME = process.env.CHROME_PATH || "/usr/bin/google-chrome";

const answers = {
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

const routes = ["/", "/play", "/learn", "/scope", "/quiz", "/write", "/report"];

function assertEnglish(text, where) {
  const hit = text.match(/[\u4e00-\u9fff]/);
  if (hit) {
    const at = text.indexOf(hit[0]);
    const snippet = text.slice(Math.max(0, at - 40), at + 40).replace(/\s+/g, " ");
    throw new Error(`${where} still has Chinese: ${snippet}`);
  }
}

async function readCopy(page) {
  return page.evaluate(() => {
    const bits = [document.body.innerText, document.title];
    document.querySelectorAll("[aria-label], [placeholder], [title]").forEach((el) => {
      bits.push(el.getAttribute("aria-label") || "");
      bits.push(el.getAttribute("placeholder") || "");
      bits.push(el.getAttribute("title") || "");
    });
    return bits.join("\n");
  });
}

async function clickText(page, text) {
  const clicked = await page.evaluate((needle) => {
    const nodes = [...document.querySelectorAll("button, a")];
    const node = nodes.find((item) => item.textContent.replace(/\s+/g, " ").includes(needle));
    if (!node) return false;
    node.click();
    return true;
  }, text);
  if (!clicked) throw new Error(`Could not click ${text}`);
}

async function answerOne(page, correct) {
  await page.waitForSelector("h2");
  const prompt = await page.$eval("h2", (el) => el.textContent.trim());
  const answer = answers[prompt];
  if (!answer) throw new Error(`No answer stored for: ${prompt}`);
  const choices = await page.$$eval("button[lang='en']", (els) =>
    els.map((el) => el.textContent.trim()).filter(Boolean),
  );
  const pick = correct ? answer : choices.find((choice) => choice !== answer);
  if (!pick) throw new Error(`No choice for ${prompt}`);
  await clickText(page, pick);
  return { prompt, pick };
}

async function playLevel(page, levelName, correct) {
  await clickText(page, levelName);
  for (let step = 0; step < 5; step += 1) {
    await page.waitForFunction(
      () => [...document.querySelectorAll("button[lang='en']")].some((el) => el.textContent.trim()),
    );
    await answerOne(page, correct);
    const next = step === 4 ? "See the cake score" : "Next square";
    await page.waitForFunction((label) => document.body.innerText.includes(label), {}, next);
    await clickText(page, next);
  }
  await page.waitForFunction(() => document.body.innerText.includes("Score report"));
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

const page = await browser.newPage();
page.setDefaultTimeout(25000);
const failures = [];

async function check(name, fn) {
  try {
    await fn();
    console.log(`ok  ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${name}: ${message}`);
    console.error(`FAIL ${name}: ${message}`);
  }
}

try {
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });

  for (const route of routes) {
    await check(`english ${route}`, async () => {
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
      await page.waitForFunction(() => document.body.innerText.length > 40);
      assertEnglish(await readCopy(page), route);
    });
  }

  await check("home copy", async () => {
    await page.goto(BASE, { waitUntil: "networkidle0" });
    const text = await readCopy(page);
    for (const line of ["School Dash", "Start playing", "Word cards", "Ten minutes a day", "Points"]) {
      if (!text.includes(line)) throw new Error(`missing ${line}`);
    }
  });

  await check("greetings level all correct", async () => {
    await page.goto(`${BASE}/play`, { waitUntil: "networkidle0" });
    await page.waitForFunction(() => document.body.innerText.includes("Birthday classroom"));
    await playLevel(page, "Birthday classroom", true);
    const text = await readCopy(page);
    assertEnglish(text, "greetings finish");
    if (!text.includes("5 / 5 correct")) throw new Error(text.slice(0, 400));
    if (!text.includes("Most familiar")) throw new Error("missing familiar");
    if (!text.includes("Greetings, names, and ages")) throw new Error("missing greetings skill");
    if (!text.includes("No shaky type yet")) throw new Error("expected no shaky skill yet");
    if (!text.includes("This level +115")) throw new Error("expected +115 for a perfect streak level");
  });

  await check("phonics level all wrong", async () => {
    await clickText(page, "Back to the map");
    await page.waitForFunction(() => document.body.innerText.includes("Letter circus"));
    await playLevel(page, "Letter circus", false);
    const text = await readCopy(page);
    assertEnglish(text, "phonics finish");
    if (!text.includes("0 / 5 correct")) throw new Error("expected 0 of 5");
    if (!text.includes("Needs more practice")) throw new Error("missing shaky heading");
    if (!text.includes("Letter sounds")) throw new Error("expected letter sounds as the miss");
    if (!text.includes("Greetings, names, and ages")) throw new Error("familiar skill should stay greetings");
  });

  await check("rhyme in order", async () => {
    await clickText(page, "Back to the map");
    await page.waitForFunction(() => document.body.innerText.includes("Floor rhyme"));
    await clickText(page, "Floor rhyme");
    const lines = [
      "One, two, take out your glue.",
      "Three, four, touch the floor.",
      "Five, six, write some ticks.",
      "Seven, eight, sit up straight.",
      "Nine, ten, put down your pen.",
    ];
    for (const line of lines) {
      await page.waitForFunction((needle) => document.body.innerText.includes(needle), {}, line);
      await clickText(page, line);
    }
    await clickText(page, "Done. Check it");
    await page.waitForFunction(() => document.body.innerText.includes("5 / 5 correct"));
    const text = await readCopy(page);
    assertEnglish(text, "rhyme finish");
  });

  await check("word card spelling", async () => {
    await page.goto(`${BASE}/learn`, { waitUntil: "networkidle0" });
    await clickText(page, "Spell it");
    await page.waitForFunction(() => document.body.innerText.includes("M-O-R-N-I-N-G"));
    assertEnglish(await readCopy(page), "learn after spell");
  });

  await check("birthday card points", async () => {
    await page.goto(`${BASE}/write`, { waitUntil: "networkidle0" });
    await clickText(page, "Dear Lily,");
    await page.waitForFunction(() => document.body.innerText.includes("all three parts"));
    const inputs = await page.$$("input");
    await inputs[0].click({ clickCount: 3 });
    await inputs[0].type("Lily");
    await inputs[1].click({ clickCount: 3 });
    await inputs[1].type("Ken");
    await page.waitForFunction(() => document.body.innerText.includes("Happy birthday!"));
    await clickText(page, "I finished it");
    await page.waitForFunction(() => document.body.innerText.includes("Reward +20 points"));
    await page.waitForFunction(() => document.body.innerText.includes("Saved"));
    assertEnglish(await readCopy(page), "write");
  });

  await check("quiz answers one question", async () => {
    await page.goto(`${BASE}/quiz`, { waitUntil: "networkidle0" });
    await clickText(page, "Start");
    await page.waitForSelector("h3");
    const prompt = await page.$eval("h3", (el) => el.textContent.trim());
    const answer = answers[prompt];
    if (!answer) throw new Error(`quiz prompt missing: ${prompt}`);
    await clickText(page, answer);
    await page.waitForFunction(() => document.body.innerText.includes("Yes!"));
    assertEnglish(await readCopy(page), "quiz");
  });

  await check("scope checklist stays checked", async () => {
    await page.goto(`${BASE}/scope`, { waitUntil: "networkidle0" });
    await page.click("input[type=checkbox]");
    await page.waitForFunction(() => document.body.innerText.includes("Revision list 1/14"));
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForFunction(() => document.body.innerText.includes("Revision list 1/14"));
    const checked = await page.$eval("input[type=checkbox]", (el) => el.checked);
    if (!checked) throw new Error("checkbox did not persist");
    assertEnglish(await readCopy(page), "scope");
    if (await readCopy(page).then((text) => text.includes("Chapter 3") && text.includes("out of this exam")) === false) {
      throw new Error("scope should say chapter 3 is out");
    }
  });

  await check("report page", async () => {
    await page.goto(`${BASE}/report`, { waitUntil: "networkidle0" });
    const text = await readCopy(page);
    assertEnglish(text, "report");
    for (const line of ["Most familiar", "Needs more practice", "Missed most often", "Letter sounds"]) {
      if (!text.includes(line)) throw new Error(`report missing ${line}`);
    }
  });

  await check("phone layout does not overflow", async () => {
    await page.setViewport({ width: 390, height: 844 });
    for (const route of ["/", "/play", "/learn", "/write"]) {
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle0" });
      const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (extra > 4) throw new Error(`${route} overflows by ${extra}px`);
      assertEnglish(await readCopy(page), `mobile ${route}`);
    }
    await page.goto(BASE, { waitUntil: "networkidle0" });
    const text = await readCopy(page);
    if (!text.includes("School Dash")) throw new Error("mobile home title missing");
    if (!text.includes("Home") || !text.includes("Dash")) throw new Error("mobile nav missing");
  });
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\n${failures.length} failed`);
  process.exit(1);
}
console.log("\nall e2e checks passed");
