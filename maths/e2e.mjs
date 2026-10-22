import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://127.0.0.1:8765/maths/";
const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const GAMES = ["count", "circle", "compare", "sequence", "oddeven", "pattern", "order", "bond", "shape", "mix", "unit1", "seqodd", "patorder"];

function solveQuestion(mode) {
  const COLORS = { red: "紅色", blue: "藍色", green: "綠色", yellow: "黃色", orange: "橙色", purple: "紫色" };
  const OBJECTS = { 皮球: "球", 罐頭: "圓柱", 派對帽: "圓錐", 鞋盒: "角柱", 雪糕筒: "圓錐", 課本: "角柱", 兩盒果汁疊起: "角柱" };
  const SHAPE_PROP = { 球: "會滾，疊不穩", 圓柱: "會滾，疊得穩", 圓錐: "會滾，疊不穩", 角柱: "不會滾，疊得穩", 角錐: "不會滾，疊不穩" };
  function shapeFromSvg(svg) {
    const html = svg.innerHTML;
    if (html.indexOf("#ef6c4a") >= 0) return "球";
    if (html.indexOf("#6a45b0") >= 0) return "圓柱";
    if (html.indexOf("#f9a825") >= 0) return "圓錐";
    if (html.indexOf("#1e88e5") >= 0) return "角柱";
    if (html.indexOf("#43a047") >= 0) return "角錐";
    return "";
  }
  const prompt = document.querySelector("h2") ? document.querySelector("h2").textContent : "";
  const choices = () => Array.from(document.querySelectorAll(".choice"));
  const clickChoice = (label) => {
    const button = choices().find((item) => item.textContent.trim() === label);
    if (!button) throw new Error("找不到選項 " + label + "｜" + prompt);
    button.click();
  };
  const clickNum = (n) => {
    const button = document.querySelector('[data-num="' + n + '"]');
    if (!button) throw new Error("找不到數字 " + n + "｜" + prompt);
    button.click();
  };
  const dots = () => Array.from(document.querySelectorAll(".dot"));

  if (prompt.startsWith("圈出")) {
    const target = Number(prompt.match(/圈出 (\d+)/)[1]);
    const total = dots().length;
    let want = target;
    if (mode === "wrong" || mode === "under") want = Math.max(1, target - 1);
    if (mode === "over") want = total;
    if (mode !== "empty") {
      for (let i = 0; i < want; i++) dots()[i].click();
    }
    return { prompt, expected: String(target), kind: "circle" };
  }

  let expected = "";
  if (prompt.startsWith("由 ")) {
    const base = Number(prompt.match(/由 (\d+)/)[1]);
    expected = String(base + document.querySelectorAll(".pip.on").length);
  } else if (prompt.startsWith("數一數")) {
    expected = String(document.querySelectorAll(".pip.on").length);
  } else if (prompt.includes("還欠多少")) {
    const want = Number(prompt.match(/想要 (\d+)/)[1]);
    const have = Number(prompt.match(/現在有 (\d+)/)[1]);
    expected = String(want - have);
  } else if (prompt.includes("空格是多少")) {
    const texts = Array.from(document.querySelectorAll(".seq span")).map((item) => item.textContent.trim());
    const idx = texts.findIndex((item) => item === "□" || item === "?");
    const nums = texts.map((item) => (item === "□" || item === "?" ? null : Number(item)));
    let step = null;
    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] != null && nums[i + 1] != null) {
        step = nums[i + 1] - nums[i];
        break;
      }
    }
    const answer = nums[idx - 1] != null ? nums[idx - 1] + step : nums[idx + 1] - step;
    expected = String(answer);
  } else if (prompt.includes("前面有多少個")) {
    const name = prompt.replace("前面有多少個？", "");
    const kids = Array.from(document.querySelectorAll(".kid"));
    expected = String(kids.findIndex((kid) => COLORS[kid.className.replace("kid ", "").trim()] === name));
  } else if (prompt.includes("合成為") && prompt.includes("□")) {
    const parts = prompt.match(/(\d+) 和 □ 合成為 (\d+)/);
    expected = String(Number(parts[2]) - Number(parts[1]));
  } else if (prompt.includes("分解為") && prompt.includes("□")) {
    const parts = prompt.match(/(\d+) 分解為 (\d+) 和 □/);
    expected = String(Number(parts[1]) - Number(parts[2]));
  } else if (prompt.includes("+ □")) {
    const parts = prompt.match(/(\d+) \+ □ = (\d+)/);
    expected = String(Number(parts[2]) - Number(parts[1]));
  } else if (prompt.includes("− □")) {
    const parts = prompt.match(/(\d+) − □ = (\d+)/);
    expected = String(Number(parts[1]) - Number(parts[2]));
  } else if (prompt.includes("= □")) {
    const parts = prompt.match(/(\d+) − (\d+) = □/);
    expected = String(Number(parts[1]) - Number(parts[2]));
  } else if (prompt.includes("哪個數合成")) {
    const parts = prompt.match(/(\d+) 和以下哪個數合成為 (\d+)/);
    expected = String(Number(parts[2]) - Number(parts[1]));
  } else if (prompt.includes("結果與其他的不相同")) {
    const sums = choices().map((item) => {
      const parts = item.textContent.match(/(\d+) \+ (\d+)/);
      return { label: item.textContent.trim(), sum: Number(parts[1]) + Number(parts[2]) };
    });
    const counts = {};
    sums.forEach((item) => { counts[item.sum] = (counts[item.sum] || 0) + 1; });
    expected = sums.find((item) => counts[item.sum] === 1).label;
  } else if (prompt.includes("哪項是正確")) {
    const hit = choices().map((item) => item.textContent.trim()).find((label) => {
      const made = label.match(/(\d+) 和 (\d+) 合成為 (\d+)/);
      if (made) return Number(made[1]) + Number(made[2]) === Number(made[3]);
      const split = label.match(/(\d+) 分解為 (\d+) 和 (\d+)/);
      if (split) return Number(split[2]) + Number(split[3]) === Number(split[1]);
      return false;
    });
    expected = hit;
  } else if (prompt.includes("順數還是倒數")) {
    const nums = Array.from(document.querySelectorAll(".seq span")).map((item) => Number(item.textContent));
    expected = nums[1] > nums[0] ? "順數" : "倒數";
  } else if (prompt.includes("由小到大")) {
    expected = choices().map((item) => item.textContent.trim()).find((label) => {
      const nums = label.split("、").map(Number);
      return nums.every((n, i) => i === 0 || n > nums[i - 1]);
    });
  } else if (prompt.includes("奇數還是偶數")) {
    const sample = prompt.match(/例如 (\d+)/) || prompt.match(/(\d+) 是奇數/);
    const n = Number(sample[1]) + (prompt.includes("多 1") ? 1 : 0);
    expected = n % 2 ? "奇數" : "偶數";
  } else if (prompt.includes("哪些是")) {
    const odd = prompt.includes("奇數");
    const labels = choices().map((item) => item.textContent.trim()).filter((label) => (Number(label) % 2 === 1) === odd);
    expected = labels.join("、");
    if (mode === "empty") return { prompt, expected, kind: "multi" };
    if (mode === "wrong") {
      choices()[0].click();
      return { prompt, expected, kind: "multi" };
    }
    labels.forEach((label) => clickChoice(label));
    return { prompt, expected, kind: "multi" };
  } else if (prompt.includes("分成數量相等")) {
    const n = Number(prompt.match(/(\d+) 粒/)[1]);
    expected = n % 2 === 0 ? "可以" : "不可以";
  } else if (prompt.includes("哪一邊較多")) {
    const left = document.querySelectorAll(".pip.rose").length;
    const right = document.querySelectorAll(".pip.sky").length;
    expected = left > right ? "甲" : "乙";
  } else if (prompt.includes("哪一邊較少")) {
    const left = document.querySelectorAll(".pip.rose").length;
    const right = document.querySelectorAll(".pip.sky").length;
    expected = left < right ? "甲" : "乙";
  } else if (prompt.includes("哪個數較大")) {
    const pair = prompt.match(/比較 (\d+) 和 (\d+)/);
    expected = String(Math.max(Number(pair[1]), Number(pair[2])));
  } else if (prompt.includes("多還是少")) {
    const pair = prompt.match(/(\d+) 比 (\d+)/);
    expected = Number(pair[1]) > Number(pair[2]) ? "多" : "少";
  } else if (prompt.includes("大還是小")) {
    const pair = prompt.match(/(\d+) 比 (\d+)/);
    expected = Number(pair[1]) > Number(pair[2]) ? "大" : "小";
  } else if (prompt.includes("數量怎樣")) {
    expected = "一樣多";
  } else if (prompt.includes("下一個是什麼顏色")) {
    const chip = document.querySelector(".chip");
    const id = chip.className.replace("chip", "").trim();
    expected = COLORS[id];
  } else if (prompt.includes("第 ") && prompt.includes("什麼顏色")) {
    const at = Number(prompt.match(/第 (\d+)/)[1]) - 1;
    const kid = document.querySelectorAll(".kid")[at];
    expected = COLORS[kid.className.replace("kid ", "").trim()];
  } else if (prompt.includes("誰排第 1")) {
    const kid = document.querySelector(".kid");
    expected = COLORS[kid.className.replace("kid ", "").trim()];
  } else if (prompt.includes("又疊得穩，又滾得動")) {
    expected = "圓柱";
  } else if (prompt.includes("比較像哪一種")) {
    const word = prompt.match(/「(.+)」/)[1];
    expected = OBJECTS[word];
  } else if (prompt.includes("這是哪一種")) {
    expected = shapeFromSvg(document.querySelector(".solo svg"));
  } else if (prompt.includes("可以怎樣")) {
    expected = SHAPE_PROP[shapeFromSvg(document.querySelector(".solo svg"))];
  } else if (prompt.includes("不同類")) {
    const names = Array.from(document.querySelectorAll(".fig-card svg")).map(shapeFromSvg);
    expected = names.find((name) => names.filter((item) => item === name).length === 1);
  } else {
    throw new Error("未懂題目：" + prompt);
  }

  if (!expected) throw new Error("計不到答案：" + prompt);
  if (mode === "empty") return { prompt, expected, kind: "other" };
  if (document.querySelector(".pads")) {
    const right = Number(expected);
    clickNum(mode === "wrong" ? (right === 0 ? 1 : right - 1) : right);
    return { prompt, expected, kind: "pad" };
  }
  if (mode === "wrong") {
    const other = choices().map((item) => item.textContent.trim()).find((label) => label !== expected);
    clickChoice(other);
  } else {
    clickChoice(expected);
  }
  return { prompt, expected, kind: "choice" };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "maths-e2e-"));
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--remote-debugging-port=9333",
    `--user-data-dir=${profile}`,
    "about:blank"
  ], { stdio: "ignore" });
  const checks = [];
  const pageErrors = [];
  let send = null;
  let ws = null;

  function record(name, error) {
    checks.push({ name, ok: !error, error: error ? String(error.message || error) : "" });
    if (error) console.error("FAIL", name, error.message || error);
    else console.log("PASS", name);
  }

  try {
    let version = null;
    for (let i = 0; i < 40 && !version; i++) {
      try {
        version = await (await fetch("http://127.0.0.1:9333/json/version")).json();
      } catch (err) {
        await sleep(200);
      }
    }
    if (!version) throw new Error("Chrome 未開到");
    const pages = await (await fetch("http://127.0.0.1:9333/json/list")).json();
    const page = pages.find((item) => item.type === "page");
    if (!page) throw new Error("Chrome 沒有分頁");
    ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve);
      ws.addEventListener("error", reject);
    });
    let nextId = 0;
    const pending = new Map();
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.method === "Runtime.exceptionThrown") {
        pageErrors.push(message.params.exceptionDetails.text + " " + (message.params.exceptionDetails.exception && message.params.exceptionDetails.exception.description || ""));
      }
      if (message.id && pending.has(message.id)) {
        const job = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) job.reject(new Error(JSON.stringify(message.error)));
        else job.resolve(message.result);
      }
    });
    send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Network.enable");
    await send("Network.setCacheDisabled", { cacheDisabled: true });

    async function open() {
      await send("Page.navigate", { url: BASE + "?e2e=" + Date.now() });
      for (let i = 0; i < 40; i++) {
        const ready = await evalValue("document.readyState === 'complete' && !!document.querySelector('#app button')");
        if (ready) return;
        await sleep(100);
      }
      throw new Error("頁面未載入");
    }

    async function evalValue(expression) {
      const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.text + " " + (result.exceptionDetails.exception && result.exceptionDetails.exception.description || expression));
      }
      return result.result.value;
    }

    async function install() {
      await evalValue("window.__solve = " + solveQuestion.toString() + "; true");
    }

    const text = () => evalValue("document.body.innerText");
    const stars = () => evalValue("document.querySelector('.stars').textContent");
    const click = (selector) => evalValue(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw new Error('缺少 ' + ${JSON.stringify(selector)}); el.click(); return true; })()`);
    const clearStore = () => evalValue("localStorage.removeItem('anton-p1-maths-v1')");

    async function home() {
      await click('[data-nav="home"]');
    }

    async function answer(mode) {
      return evalValue("window.__solve(" + JSON.stringify(mode) + ")");
    }

    async function playFive(mode) {
      const before = Number((await stars()).replace(/\D/g, ""));
      const seen = [];
      for (let i = 0; i < 5; i++) {
        const body = await text();
        if (!body.includes("第 " + (i + 1) + " / 5 題")) throw new Error("題號不對：" + body.slice(0, 180));
        const solved = await answer(mode);
        seen.push(solved.prompt);
        await click("#check");
        const feedback = await evalValue("document.querySelector('.feedback') && document.querySelector('.feedback').className + '|' + document.querySelector('.feedback').innerText");
        if (!feedback) throw new Error("沒有回饋：" + solved.prompt);
        const right = mode === "right";
        if (right && !feedback.startsWith("feedback ok")) throw new Error("答對卻判錯：" + solved.prompt + " " + feedback);
        if (!right && !feedback.startsWith("feedback wait")) throw new Error("答錯卻判對：" + solved.prompt + " " + feedback);
        if (right && (solved.kind === "pad" || solved.kind === "circle" || solved.kind === "multi")) {
          const bits = solved.kind === "multi" ? solved.expected.split("、") : [solved.expected];
          bits.forEach((bit) => {
            if (bit && !feedback.includes(bit)) throw new Error("解釋未有答案 " + bit + "：" + feedback);
          });
        }
        await click("#next");
      }
      const end = await text();
      if (!end.includes("這一轉")) throw new Error("未到休息：" + end.slice(0, 180));
      const got = Number((await stars()).replace(/\D/g, ""));
      const added = mode === "right" ? 5 : 0;
      if (got !== before + added) throw new Error("星星由 " + before + " 變成 " + got + "，應加 " + added);
      if (mode === "right" && !end.includes("這一轉 5 星")) throw new Error(end.slice(0, 200));
      if (mode !== "right" && !end.includes("這一轉 0 星")) throw new Error(end.slice(0, 200));
      return seen;
    }

    await open();
    await install();
    await clearStore();
    await open();
    await install();

    await (async () => {
      try {
        const body = await text();
        const night = new Date().getHours() >= 20;
        const note = night ? "今晚已經夜" : "今日可以先玩一轉";
        if (!body.includes(note)) throw new Error(body.slice(0, 240));
        if (!body.includes("開始：數一數")) throw new Error("建議遊戲不對");
        if ((await stars()) !== "0 星") throw new Error(await stars());
        const current = await evalValue("document.querySelector('.nav button[aria-current=\"page\"]').textContent");
        if (current !== "玩") throw new Error(current);
        record("主頁同今晚建議", null);
      } catch (error) { record("主頁同今晚建議", error); }
    })();

    await (async () => {
      try {
        await click('[data-nav="plan"]');
        const body = await text();
        ["10月23日", "10月24日", "10月25日", "10月26日", "10月27日朝早", "鉛筆、橡皮、間尺", "塗滿圓圈", "多圈會錯"].forEach((line) => {
          if (!body.includes(line)) throw new Error("日程缺 " + line);
        });
        if ((await evalValue("document.querySelector('.nav button[aria-current=\"page\"]').textContent")) !== "日程") throw new Error("日程未標示");
        await click('[data-start="shape"]');
        if (!(await text()).includes("第 1 / 5 題")) throw new Error("日程未開到練習");
        if ((await evalValue("document.querySelector('.nav button[aria-current=\"page\"]').textContent")) !== "玩") throw new Error("做題時玩頁未標示");
        await home();
        record("日程可以開練習", null);
      } catch (error) { record("日程可以開練習", error); }
    })();

    await (async () => {
      try {
        await click('[data-nav="skills"]');
        const count = await evalValue("document.querySelectorAll('[data-start]').length");
        if (count !== 10) throw new Error("課題數 " + count);
        await click('[data-nav="scope"]');
        const body = await text();
        ["2026年10月27日", "20 以內的數", "2 至 18", "角柱、角錐、圓柱、圓錐、球", "未開始"].forEach((line) => {
          if (!body.includes(line)) throw new Error("範圍缺 " + line);
        });
        record("課題同範圍", null);
      } catch (error) { record("課題同範圍", error); }
    })();

    for (const id of GAMES) {
      await (async () => {
        try {
          await home();
          if (id === "seqodd" || id === "patorder") await click('[data-nav="plan"]');
          else if (!(id === "unit1" || id === "bond" || id === "shape" || id === "mix")) await click('[data-nav="skills"]');
          await click('[data-start="' + id + '"]');
          await playFive("right");
          await click('[data-start="' + id + '"]');
          if (!(await text()).includes("第 1 / 5 題")) throw new Error("再玩一轉未回到第一題");
          await home();
          record("答對一整轉 " + id, null);
        } catch (error) { record("答對一整轉 " + id, error); await home().catch(() => {}); }
      })();
    }

    for (const id of ["count", "circle", "compare", "oddeven", "bond", "shape"]) {
      await (async () => {
        try {
          await home();
          if (["bond", "shape"].includes(id)) await click('[data-start="' + id + '"]');
          else {
            await click('[data-nav="skills"]');
            await click('[data-start="' + id + '"]');
          }
          await playFive("wrong");
          record("答錯一整轉 " + id, null);
        } catch (error) { record("答錯一整轉 " + id, error); }
      })();
    }

    await (async () => {
      try {
        await home();
        await click('[data-nav="skills"]');
        await click('[data-start="count"]');
        await click("#check");
        if (await evalValue("!!document.querySelector('.feedback')")) throw new Error("未選答案卻有回饋");
        if (!(await text()).includes("第 1 / 5 題")) throw new Error("空白檢查跳了題");
        await home();
        await click('[data-nav="skills"]');
        await click('[data-start="circle"]');
        await click("#check");
        if (await evalValue("!!document.querySelector('.feedback')")) throw new Error("沒有圈點卻當錯");
        const before = await stars();
        await answer("over");
        await click("#check");
        const over = await evalValue("document.querySelector('.feedback').className");
        if (over !== "feedback wait") throw new Error("多圈卻是 " + over);
        if ((await stars()) !== before) throw new Error("多圈加了星");
        await click("#next");
        await answer("under");
        await click("#check");
        if ((await evalValue("document.querySelector('.feedback').className")) !== "feedback wait") throw new Error("少圈未判錯");
        record("空白答案、多圈、少圈", null);
      } catch (error) { record("空白答案、多圈、少圈", error); }
    })();

    await (async () => {
      try {
        let found = false;
        for (let round = 0; round < 4 && !found; round++) {
          await home();
          await click('[data-nav="skills"]');
          await click('[data-start="oddeven"]');
          for (let i = 0; i < 5 && !found; i++) {
            const prompt = await evalValue("document.querySelector('h2').textContent");
            if (prompt.includes("哪些是")) {
              const before = await stars();
              await answer("wrong");
              await click("#check");
              if ((await evalValue("document.querySelector('.feedback').className")) !== "feedback wait") throw new Error("少選卻判對");
              if ((await stars()) !== before) throw new Error("少選加了星");
              found = true;
            } else {
              await answer("right");
              await click("#check");
              await click("#next");
            }
          }
        }
        if (!found) throw new Error("四轉都沒有多選題");
        record("多選少選一個", null);
      } catch (error) { record("多選少選一個", error); }
    })();

    await (async () => {
      try {
        await clearStore();
        await open();
        await install();
        await click('[data-start="mix"]');
        await answer("right");
        await click("#check");
        const held = await stars();
        await home();
        if ((await stars()) !== held) throw new Error("中途離開星星變了");
        await open();
        await install();
        if ((await stars()) !== held) throw new Error("重新載入未保留星星");
        await click('[data-nav="scope"]');
        if (!(await text()).includes("混合 5 題：1／1")) throw new Error(await text());
        await click("#reset");
        if ((await stars()) !== "0 星") throw new Error(await stars());
        if (!(await text()).includes("未開始")) throw new Error("清空後仍有紀錄");
        record("離開、重新載入、清空", null);
      } catch (error) { record("離開、重新載入、清空", error); }
    })();

    await (async () => {
      try {
        await evalValue("localStorage.setItem('anton-p1-maths-v1', '{')");
        await open();
        await install();
        if (!(await text()).includes("10月27日")) throw new Error("壞 JSON 令頁面空白");
        await evalValue("localStorage.setItem('anton-p1-maths-v1', '[]')");
        await open();
        await install();
        await click('[data-start="bond"]');
        await answer("right");
        await click("#check");
        if ((await evalValue("document.querySelector('.feedback').className")) !== "feedback ok") throw new Error("陣列存檔後答對失敗");
        if ((await stars()) !== "1 星") throw new Error(await stars());
        await evalValue("localStorage.setItem('anton-p1-maths-v1', JSON.stringify({ stars: 'no', tried: { count: 'bad', shape: { ok: 'x', n: 2 } } }))");
        await open();
        await install();
        await click('[data-nav="scope"]');
        const body = await text();
        if (!body.includes("立體圖形：0／2")) throw new Error(body.slice(0, 400));
        if (body.includes("練習：")) throw new Error("壞紀錄顯示了不明課題");
        await home();
        await click('[data-start="shape"]');
        await answer("right");
        await click("#check");
        if (!(await text()).includes("對了")) throw new Error("壞紀錄後不能作答");
        await clearStore();
        record("壞掉的儲存仍可玩", null);
      } catch (error) { record("壞掉的儲存仍可玩", error); }
    })();

    await (async () => {
      try {
        await open();
        await install();
        await clearStore();
        await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
        await open();
        await install();
        const width = await evalValue("JSON.stringify({ inner: window.innerWidth, scroll: document.documentElement.scrollWidth })");
        const size = JSON.parse(width);
        if (size.scroll > size.inner) throw new Error("手機橫向溢出 " + width);
        await click('[data-start="bond"]');
        await evalValue("document.querySelector('#check').scrollIntoView({ block: 'end' })");
        const covered = await evalValue(`(() => { const c = document.querySelector('#check').getBoundingClientRect(); const n = document.querySelector('.nav').getBoundingClientRect(); return c.bottom > n.top + 1; })()`);
        if (covered) throw new Error("檢查鍵被底欄擋住");
        await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
        await open();
        await install();
        const desktop = JSON.parse(await evalValue("JSON.stringify({ inner: window.innerWidth, scroll: document.documentElement.scrollWidth })"));
        if (desktop.scroll > desktop.inner) throw new Error("電腦橫向溢出");
        await click('[data-start="mix"]');
        await click("#speak");
        record("手機同電腦版面", null);
      } catch (error) { record("手機同電腦版面", error); }
    })();

    await clearStore();
    const failed = checks.filter((item) => !item.ok);
    console.log("\n" + checks.length + " checks, " + failed.length + " failed, page errors " + pageErrors.length);
    if (pageErrors.length) console.log(pageErrors.slice(0, 8).join("\\n"));
    if (failed.length || pageErrors.length) process.exitCode = 1;
  } finally {
    if (ws) ws.close();
    chrome.kill();
    await sleep(300);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (err) { /* Chrome may still be releasing the profile. */ }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
