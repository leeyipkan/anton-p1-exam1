(function () {
  var DATA = window.ANTON_DATA;
  var VIEWS = ["play", "today", "plan", "words", "practice", "four", "write"];
  var PRACTICE = ["choice", "punct", "measure", "listen", "ancient"];
  var PRACTICE_LABEL = {
    choice: "選擇",
    punct: "標點",
    measure: "量詞",
    listen: "聽一聽",
    ancient: "記認圖"
  };
  var KEY = {
    start: "anton-p1-start",
    done: "anton-p1-done",
    favs: "anton-p1-favs",
    timer: "anton-p1-timer",
    game: "anton-p1-game"
  };
  var TIMER_MS = 15 * 60 * 1000;
  var main = document.getElementById("app");
  var quizState = {};
  var speakToken = 0;
  var keepScroll = false;
  var padBound = false;

  var state = {
    view: "today",
    day: 1,
    practice: "choice",
    flash: { lesson: "all", focusOnly: true, index: 0 },
    build: { time: "", person: "", place: "", action: "" },
    outputMode: "build",
    presetText: "",
    char: "八",
    strokes: [],
    match: {},
    rowOrder: {},
    lab: {},
    pendingSpeak: "",
    hint: "",
    scrollTo: "",
    play: { id: "", index: 0, correct: 0, phase: "home", picked: "", token: 0, spoken: -1 }
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function loadJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function storageWorks() {
    try {
      localStorage.setItem("anton-p1-probe", "1");
      localStorage.removeItem("anton-p1-probe");
      return true;
    } catch (err) {
      return false;
    }
  }

  function todayISO() {
    var d = new Date();
    var z = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  }

  function formatDate(iso) {
    var parts = String(iso).split("-");
    if (parts.length !== 3) return iso;
    return parts[0] + "年" + Number(parts[1]) + "月" + Number(parts[2]) + "日";
  }

  function parseISO(iso) {
    var parts = String(iso).split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function ensureStart() {
    var current = "";
    try { current = localStorage.getItem(KEY.start) || ""; } catch (err) { current = ""; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(current)) {
      current = todayISO();
      try { localStorage.setItem(KEY.start, current); } catch (err) { /* ignore */ }
    }
    return current;
  }

  function daysSince(start) {
    var a = parseISO(start);
    var b = new Date();
    b.setHours(0, 0, 0, 0);
    return Math.floor((b.getTime() - a.getTime()) / 86400000);
  }

  function loadDone() {
    var data = loadJSON(KEY.done, {});
    return data && typeof data === "object" ? data : {};
  }

  function setDayDone(day, checked) {
    var done = loadDone();
    if (checked) done[String(day)] = true;
    else delete done[String(day)];
    saveJSON(KEY.done, done);
    var line = document.getElementById("suggest-line");
    if (line) line.textContent = suggestText();
  }

  function isDone(day) {
    return !!loadDone()[String(day)];
  }

  function calendarDay() {
    return Math.min(Math.max(daysSince(ensureStart()), 0), 6) + 1;
  }

  function suggestedDayNumber() {
    var done = loadDone();
    var cal = calendarDay();
    if (!done[String(cal)]) return cal;
    var i;
    for (i = cal + 1; i <= 7; i += 1) if (!done[String(i)]) return i;
    for (i = 1; i < cal; i += 1) if (!done[String(i)]) return i;
    return null;
  }

  function suggestText() {
    var start = formatDate(ensureStart());
    var cal = calendarDay();
    var sug = suggestedDayNumber();
    var done = loadDone();
    if (!sug) return "由" + start + "開始。七日都做過，可以任意重溫。";
    var earlier = [];
    var i;
    for (i = 1; i < cal; i += 1) if (!done[String(i)]) earlier.push(i);
    var text = "由" + start + "開始，今日時間表係第 " + cal + " 日。";
    if (sug === cal) text += "建議做第 " + sug + " 日。";
    else text += "第 " + cal + " 日已做，建議下一未做：第 " + sug + " 日。";
    if (earlier.length) text += "未做還有第 " + earlier.join("、") + " 日，沒有鎖住。";
    else text += "其他日子沒有鎖住。";
    return text;
  }

  function lessonById(id) {
    var i;
    for (i = 0; i < DATA.lessons.length; i += 1) {
      if (DATA.lessons[i].id === id) return DATA.lessons[i];
    }
    return null;
  }

  function lessonHeading(ls) {
    if (!ls) return "";
    if (ls.altTitle) return ls.num + "《" + ls.title + "》／《" + ls.altTitle + "》";
    return ls.num + "《" + ls.title + "》";
  }

  function dayByNumber(n) {
    var i;
    for (i = 0; i < DATA.days.length; i += 1) {
      if (DATA.days[i].n === n) return DATA.days[i];
    }
    return DATA.days[0];
  }

  function dayWords(day) {
    if (day.review && day.review.length) return day.review.slice();
    var out = [];
    var i;
    var j;
    for (i = 0; i < day.lessonIds.length; i += 1) {
      var ls = lessonById(day.lessonIds[i]);
      if (!ls) continue;
      for (j = 0; j < ls.words.length; j += 1) out.push(ls.words[j]);
    }
    return out;
  }

  function hanCount(text) {
    var matches = String(text).match(/\p{Script=Han}/gu);
    return matches ? matches.length : 0;
  }

  function joinItem(item) {
    var p = item.parts;
    return p[0].text + "，" + p[1].text + p[2].text + p[3].text + "。";
  }

  function voiceRank(voice) {
    if (!voice) return 0;
    var hay = (voice.lang + " " + voice.name).toLowerCase();
    if (/zh-hk|yue|cantonese|hong kong|廣東|香港/.test(hay)) return 3;
    if (/^zh|chinese|中文|普通话|國語|mandarin/.test(hay)) return 2;
    return 0;
  }

  function pickVoice() {
    if (!window.speechSynthesis) return null;
    var voices = window.speechSynthesis.getVoices() || [];
    var best = null;
    var bestRank = 0;
    var i;
    for (i = 0; i < voices.length; i += 1) {
      var rank = voiceRank(voices[i]);
      if (rank > bestRank) {
        best = voices[i];
        bestRank = rank;
      }
    }
    return best;
  }

  function updateVoiceNote() {
    var el = document.getElementById("voice-note");
    if (!el) return;
    if (!window.speechSynthesis) {
      el.textContent = "這部瀏覽器沒有朗讀。請家長讀出聲。";
      return;
    }
    var voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) {
      el.textContent = "";
      return;
    }
    var rank = voiceRank(pickVoice());
    if (rank >= 3) el.textContent = "";
    else if (rank === 2) el.textContent = "未找到廣東話語音，會用其他中文語音。家長可以再讀一次。";
    else el.textContent = "未找到中文語音。請家長讀出聲，或者在系統安裝廣東話語音。";
  }

  function needParentRead() {
    if (!window.speechSynthesis) return true;
    var voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return false;
    return voiceRank(pickVoice()) < 2;
  }

  function makeUtterance(text) {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-HK";
    u.rate = 0.7;
    var voice = pickVoice();
    if (voice && voiceRank(voice) > 0) u.voice = voice;
    return u;
  }

  function speak(text) {
    if (!text) return;
    if (!window.speechSynthesis) {
      updateVoiceNote();
      return;
    }
    var token = ++speakToken;
    window.speechSynthesis.cancel();
    var u = makeUtterance(text);
    window.setTimeout(function () {
      if (token !== speakToken) return;
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(u);
    }, 80);
  }

  function speakAll(list) {
    if (!window.speechSynthesis || !list.length) {
      updateVoiceNote();
      return;
    }
    var token = ++speakToken;
    window.speechSynthesis.cancel();
    var i = 0;
    var next = function () {
      if (token !== speakToken || i >= list.length) return;
      var u = makeUtterance(list[i]);
      i += 1;
      u.onend = function () { window.setTimeout(next, 280); };
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(u);
    };
    window.setTimeout(next, 80);
  }

  function shuffle(list) {
    var arr = list.slice();
    var i;
    for (i = arr.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function getQuiz(scope) {
    if (!quizState[scope]) {
      quizState[scope] = { index: 0, picked: null, spokenIndex: -1, orders: {} };
    }
    return quizState[scope];
  }

  function questionsFor(scope) {
    var ids = [];
    if (scope.indexOf("day-") === 0) {
      ids = dayByNumber(Number(scope.slice(4))).questionIds || [];
    } else if (scope.indexOf("practice-") === 0) {
      ids = DATA.practice[scope.slice(9)] || [];
    } else if (scope === "mc") {
      ids = DATA.mcIds;
    }
    return ids.map(function (id) { return questionById(id); }).filter(Boolean);
  }

  function questionById(id) {
    var q = DATA.questions[id];
    if (!q) return null;
    return Object.assign({ id: id }, q);
  }

  function orderedOptions(scope, q) {
    if (!q.options) return [];
    if (q.fixedOrder || typeof q.options[0] === "object") return q.options.slice();
    var st = getQuiz(scope);
    if (!st.orders[q.id]) st.orders[q.id] = shuffle(q.options.map(function (_, i) { return i; }));
    return st.orders[q.id].map(function (i) { return q.options[i]; });
  }

  function optVal(opt) { return typeof opt === "object" ? opt.letter : opt; }
  function optLabel(opt) { return typeof opt === "object" ? opt.letter + "　" + opt.text : opt; }

  function answerLabel(q) {
    var i;
    for (i = 0; i < q.options.length; i += 1) {
      if (optVal(q.options[i]) === q.answer) return optLabel(q.options[i]);
    }
    return q.answer;
  }

  function glyphSvg(name) {
    if (Object.prototype.hasOwnProperty.call(DATA.glyphs, name)) return DATA.glyphs[name];
    return "";
  }

  function wordsDeck() {
    var out = [];
    var i;
    var j;
    for (i = 0; i < DATA.lessons.length; i += 1) {
      var ls = DATA.lessons[i];
      if (state.flash.lesson !== "all" && state.flash.lesson !== ls.id) continue;
      for (j = 0; j < ls.words.length; j += 1) {
        var w = ls.words[j];
        if (state.flash.focusOnly && !w.focus) continue;
        out.push({ word: w, lesson: ls });
      }
    }
    return out;
  }

  function builtSentence() {
    var b = state.build;
    if (!b.time && !b.person && !b.place && !b.action) return "";
    return (b.time || "____") + "，" + (b.person || "____") + "到" + (b.place || "____") + (b.action || "____") + "。";
  }

  function currentSentence() {
    if (state.outputMode === "preset" && state.presetText) return state.presetText;
    return builtSentence();
  }

  function sentenceComplete(text) {
    return !!text && text.indexOf("____") === -1;
  }

  function loadFavs() {
    var list = loadJSON(KEY.favs, []);
    return Array.isArray(list) ? list.filter(function (item) { return typeof item === "string"; }).slice(0, 6) : [];
  }

  function saveFav(text) {
    if (!sentenceComplete(text)) return;
    var favs = loadFavs().filter(function (item) { return item !== text; });
    favs.unshift(text);
    saveJSON(KEY.favs, favs.slice(0, 6));
  }

  function deleteFav(text) {
    saveJSON(KEY.favs, loadFavs().filter(function (item) { return item !== text; }));
  }

  function defaultTimer() {
    return { running: false, remainingMs: TIMER_MS, endAt: null, finished: false };
  }

  function loadTimer() {
    var t = loadJSON(KEY.timer, null);
    if (!t || typeof t.remainingMs !== "number") return defaultTimer();
    return t;
  }

  function saveTimer(t) { saveJSON(KEY.timer, t); }

  function timerLeft(t) {
    if (t.running && t.endAt) return Math.max(0, t.endAt - Date.now());
    return Math.max(0, t.remainingMs);
  }

  function formatMs(ms) {
    var total = Math.ceil(ms / 1000);
    var m = Math.floor(total / 60);
    var s = total % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function paintTimer() {
    var t = loadTimer();
    var left = timerLeft(t);
    if (t.running && left <= 0) {
      t.running = false;
      t.remainingMs = 0;
      t.endAt = null;
      t.finished = true;
      saveTimer(t);
      left = 0;
    }
    var display = document.getElementById("timer-display");
    var btn = document.getElementById("timer-toggle");
    var msg = document.getElementById("timer-msg");
    if (display) display.textContent = formatMs(left);
    if (btn) btn.textContent = t.running ? "暫停" : "開始";
    if (msg) msg.textContent = t.finished && left === 0 ? "十五分鐘到了，可以收工。" : "";
  }

  function startOrPauseTimer() {
    var t = loadTimer();
    if (t.running) {
      t.remainingMs = timerLeft(t);
      t.running = false;
      t.endAt = null;
      saveTimer(t);
      return;
    }
    if (t.remainingMs <= 0) t = defaultTimer();
    t.running = true;
    t.finished = false;
    t.endAt = Date.now() + t.remainingMs;
    saveTimer(t);
  }

  function resetTimer() {
    saveTimer(defaultTimer());
  }

  function wordCards(words) {
    return '<div class="word-grid">' + words.map(function (w) {
      var badge = w.focus ? '<span class="badge">重點</span>' : "";
      var note = w.note ? '<p class="note">' + esc(w.note) + "</p>" : "";
      return '<article class="word-card">' +
        '<button type="button" class="word" data-action="speak" data-text="' + esc(w.word) + '">' + esc(w.word) + badge + "</button>" +
        '<p class="example">' + esc(w.example) + "</p>" + note +
        '<button type="button" data-action="speak" data-text="' + esc(w.example) + '">聽例句</button>' +
        "</article>";
    }).join("") + "</div>";
  }

  function patternList(lines) {
    if (!lines || !lines.length) return "";
    return '<section class="card"><h3>讀一讀</h3><div class="row-actions">' +
      lines.map(function (line) {
        return '<button type="button" data-action="speak" data-text="' + esc(line) + '">' + esc(line) + "</button>";
      }).join("") +
      "</div></section>";
  }

  function factsHTML(facts) {
    if (!facts || !facts.length) return "";
    return '<div class="facts">' + facts.map(function (f) {
      return '<article class="card"><h3>' + esc(f.title) + "</h3><p>" + esc(f.text) + "</p></article>";
    }).join("") + "</div>";
  }

  function quizHTML(scope) {
    var qs = questionsFor(scope);
    var st = getQuiz(scope);
    if (!qs.length) return "<p>未有題目。</p>";
    if (st.index >= qs.length) {
      return '<div class="card"><p>這組做完。沒有評分，想再練可以再來一次。</p>' +
        '<button type="button" class="primary" data-action="quiz-reset" data-scope="' + esc(scope) + '">再來一次</button></div>';
    }
    var q = qs[st.index];
    var opts = orderedOptions(scope, q);
    var short = q.type === "measure" || q.type === "listen" || (q.type === "punct" && typeof q.options[0] !== "object");
    var buttons = opts.map(function (opt) {
      var value = optVal(opt);
      var cls = "opt";
      if (st.picked) {
        if (value === q.answer) cls += " is-answer";
        else if (value === st.picked) cls += " is-pick";
      }
      return '<button type="button" class="' + cls + '"' + (st.picked ? " disabled" : "") +
        ' data-action="quiz-pick" data-scope="' + esc(scope) + '" data-qid="' + esc(q.id) + '" data-value="' + esc(value) + '">' +
        esc(optLabel(opt)) + "</button>";
    }).join("");
    var extra = "";
    if (q.sentence) extra += '<p class="stem">' + esc(q.sentence) + "</p>";
    if (q.type === "listen") {
      extra += '<p><button type="button" class="primary" data-action="quiz-replay" data-scope="' + esc(scope) + '">聽題目</button></p>';
      if (!st.picked && needParentRead()) {
        extra += '<p class="parent">請家長讀出：' + esc(q.speak) + "</p>";
      } else if (!st.picked) {
        extra += "<p>如果聽不到，請家長讀出聲。</p>";
      }
    }
    var feedback = "";
    if (st.picked) {
      var ok = st.picked === q.answer;
      feedback = '<div class="card">' +
        (ok ? '<p class="fb">這題對了。</p>' : '<p class="fb">參考答案：' + esc(answerLabel(q)) + "。</p>") +
        '<p class="model">例句：' + esc(q.model) + "</p>" +
        (q.note ? "<p>" + esc(q.note) + "</p>" : "") +
        (q.type === "listen" ? "<p>你聽到的是：" + esc(q.speak) + "</p>" : "") +
        (st.index + 1 < qs.length
          ? '<button type="button" class="primary" data-action="quiz-next" data-scope="' + esc(scope) + '">下一題</button>'
          : '<button type="button" class="primary" data-action="quiz-next" data-scope="' + esc(scope) + '">做完這組</button>') +
        "</div>";
    }
    return '<div data-quiz-scope="' + esc(scope) + '">' +
      '<p class="progress">第 ' + (st.index + 1) + " 題，共 " + qs.length + " 題</p>" +
      "<h3>" + esc(q.prompt) + "</h3>" + extra +
      '<div class="option-grid' + (short ? " short" : "") + '">' + buttons + "</div>" +
      feedback + "</div>";
  }

  function rowOrder(boardId, glyph) {
    var key = boardId + ":" + glyph;
    if (!state.rowOrder[key]) state.rowOrder[key] = shuffle(DATA.boards[boardId].slice());
    return state.rowOrder[key];
  }

  function boardHTML(boardId) {
    var glyphs = DATA.boards[boardId];
    var picks = state.match[boardId] || {};
    var rows = glyphs.map(function (glyph) {
      var picked = picks[glyph] || "";
      var buttons = rowOrder(boardId, glyph).map(function (choice) {
        var cls = "";
        if (picked && choice === glyph) cls = "is-answer";
        else if (picked && choice === picked) cls = "is-pick";
        return '<button type="button" class="' + cls + '" data-action="match" data-board="' + esc(boardId) +
          '" data-glyph="' + esc(glyph) + '" data-choice="' + esc(choice) + '">' + esc(choice) + "</button>";
      }).join("");
      var fb = "";
      if (picked) {
        fb = picked === glyph
          ? '<p class="model">對了。例句：' + esc(DATA.glyphSentences[glyph]) + "</p>"
          : '<p>參考答案：' + esc(glyph) + "。例句：" + esc(DATA.glyphSentences[glyph]) + "</p>";
      }
      return '<div class="match-row"><div class="glyph">' + glyphSvg(glyph) + "<p>記認圖</p></div>" +
        '<div><div class="match-options">' + buttons + "</div>" + fb + "</div></div>";
    }).join("");
    return '<section class="card"><h3>記認圖：' + esc(DATA.boardTitles[boardId]) + "</h3>" +
      "<p>這些是記認圖，用來幫忙記字，不是甲骨文拓片。</p>" + rows + "</section>";
  }

  function labState(scope, items) {
    if (!state.lab[scope]) {
      state.lab[scope] = { cursor: 0, itemId: "", order: null, selected: null, assign: {}, checked: false, ok: false };
    }
    var st = state.lab[scope];
    var item = items[st.cursor];
    if (item && st.itemId !== item.id) {
      st.itemId = item.id;
      st.order = shuffle(item.parts.map(function (_, i) { return i; }));
      st.selected = null;
      st.assign = {};
      st.checked = false;
      st.ok = false;
    }
    return st;
  }

  function workedExampleHTML() {
    var item = DATA.example;
    var bits = item.parts.map(function (part) {
      return "<li>" + esc(part.text) + "：" + esc(part.role) + "</li>";
    }).join("");
    var sentence = joinItem(item);
    return '<section class="card"><h3>例子</h3><p class="sentence">' + esc(sentence) + "</p><ul>" + bits + "</ul>" +
      '<button type="button" data-action="speak" data-text="' + esc(sentence) + '">聽一次</button></section>';
  }

  function labellerHTML(scope, items) {
    if (!items.length) return "";
    var st = labState(scope, items);
    if (st.cursor >= items.length) {
      return '<section class="card"><p>這組四素句分完。沒有評分。</p>' +
        '<button type="button" data-action="lab-reset" data-scope="' + esc(scope) + '">再來一次</button></section>';
    }
    var item = items[st.cursor];
    var chunks = st.order.map(function (partIndex) {
      var part = item.parts[partIndex];
      var chosen = st.assign[partIndex] || "";
      var cls = st.selected === partIndex ? "chunk is-on" : "chunk";
      return '<button type="button" class="' + cls + '" data-action="lab-select" data-scope="' + esc(scope) +
        '" data-part="' + partIndex + '">' + esc(part.text) + "</button>" +
        '<p class="assigned">' + (chosen ? esc(chosen) : "未分") + "</p>";
    }).join("");
    var roles = DATA.roles.map(function (pair) {
      return '<button type="button" data-action="lab-assign" data-scope="' + esc(scope) + '" data-role="' + esc(pair[0]) + '">' +
        esc(pair[1] + " " + pair[0]) + "</button>";
    }).join("");
    var result = "";
    if (st.checked) {
      var list = item.parts.map(function (part) {
        return "<li>" + esc(part.text) + "：" + esc(part.role) + "</li>";
      }).join("");
      var sentence = joinItem(item);
      var count = hanCount(sentence);
      var countLine = item.minChars ? "<p>這句有 " + count + " 個字。" + (count >= item.minChars ? "夠十二個字。" : "") + "</p>" : "";
      result = '<div class="card"><p>' + (st.ok ? "分對了。" : "參考分法如下。") + "</p><ul>" + list + "</ul>" +
        '<p class="model">例句：' + esc(sentence) + "</p>" + countLine +
        '<button type="button" data-action="speak" data-text="' + esc(sentence) + '">聽例句</button> ' +
        (st.cursor + 1 < items.length
          ? '<button type="button" class="primary" data-action="lab-next" data-scope="' + esc(scope) + '">下一句</button>'
          : '<button type="button" class="primary" data-action="lab-next" data-scope="' + esc(scope) + '">做完這組</button>') +
        "</div>";
    }
    var hint = state.hint && state.hintScope === scope ? "<p>" + esc(state.hint) + "</p>" : "";
    return '<section class="card"><h3>' + esc(item.tag) + " · 第 " + (st.cursor + 1) + " 句，共 " + items.length + " 句</h3>" +
      "<p>先點一格，再點時間素、人物素、地點素或事情素。</p>" + hint + chunks +
      '<div class="roles">' + roles + "</div>" +
      '<p class="row-actions"><button type="button" class="primary" data-action="lab-check" data-scope="' + esc(scope) + '">對一對</button>' +
      '<button type="button" data-action="lab-shuffle" data-scope="' + esc(scope) + '">再試一次</button></p>' +
      result + "</section>";
  }

  function labItems(ids) {
    return ids.map(function (id) {
      var i;
      for (i = 0; i < DATA.fourItems.length; i += 1) {
        if (DATA.fourItems[i].id === id) return DATA.fourItems[i];
      }
      return null;
    }).filter(Boolean);
  }

  function kiteHTML() {
    var count = hanCount(DATA.kite);
    return '<section class="card"><h3>挑戰題</h3>' +
      "<p>工作紙呢題留空。通順例子有 " + count + " 個字。</p>" +
      '<p class="sentence">' + esc(DATA.kite) + "</p>" +
      "<p>跟住講一次：星期日，我和爸爸到公園放風箏。</p>" +
      '<p class="row-actions"><button type="button" data-action="speak" data-text="' + esc(DATA.kite) + '">聽一次</button>' +
      '<button type="button" data-action="use-preset" data-text="' + esc(DATA.kite) + '">用這句做例子</button></p></section>';
  }

  function bankGroup(key) {
    var group = DATA.banks[key];
    var selected = state.build[key];
    var chips = group.chips.map(function (text) {
      var on = state.outputMode === "build" && selected === text;
      return '<button type="button"' + (on ? ' class="is-on" aria-pressed="true"' : ' aria-pressed="false"') +
        ' data-action="chip" data-group="' + key + '" data-text="' + esc(text) + '">' + esc(text) + "</button>";
    }).join("");
    var easy = "";
    if (group.easy) {
      easy = "<p>易記時間（方便砌句）：</p>" + '<div class="chip-row">' + group.easy.map(function (text) {
        var on = state.outputMode === "build" && selected === text;
        return '<button type="button"' + (on ? ' class="is-on" aria-pressed="true"' : ' aria-pressed="false"') +
          ' data-action="chip" data-group="' + key + '" data-text="' + esc(text) + '">' + esc(text) + "</button>";
      }).join("") + "</div>";
    }
    var sheet = "<ul class=\"sheet-list\">" + group.sheet.map(function (line) {
      return "<li>" + esc(line) + "</li>";
    }).join("") + "</ul>";
    return "<h3>" + esc(group.label) + "</h3>" +
      '<details class="panel"><summary>工作紙原文</summary>' + sheet + "</details>" +
      '<div class="chip-row">' + chips + "</div>" + easy;
  }

  function builderHTML() {
    var sentence = currentSentence();
    var count = sentenceComplete(sentence) ? hanCount(sentence) : 0;
    var hint = state.hint && state.hintScope === "builder" ? "<p>" + esc(state.hint) + "</p>" : "";
    var countLine = "";
    if (sentenceComplete(sentence)) {
      countLine = "<p>有 " + count + " 個字。" +
        (count >= 12 ? "夠十二個字。" : "寫作練習希望有十二個字或以上，可以再加幾個字。這句仍然可以存低。") +
        "</p>";
    }
    var presets = DATA.presets.map(function (line) {
      return '<button type="button" data-action="use-preset" data-text="' + esc(line) + '">' + esc(line) + "</button>";
    }).join("");
    var favs = loadFavs();
    var favHTML = favs.length
      ? '<ul class="fav-list">' + favs.map(function (line) {
        return "<li><span>" + esc(line) + "</span>" +
          '<button type="button" data-action="speak" data-text="' + esc(line) + '">聽</button>' +
          '<button type="button" data-action="delete-fav" data-text="' + esc(line) + '">刪除</button></li>';
      }).join("") + "</ul><p>最多存六句。</p>"
      : "<p>未有存低的句子。</p>";
    return '<section class="card" id="builder"><h3>砌一句</h3>' +
      "<p>句式：（時間），（人物）到（地點）（事情）。</p>" +
      "<p>工作紙有時寫「在家中」「去迪士尼樂園」，那些在分部分練習出現。砌句這裏用「到」。自由配搭可以好好笑，下面有通順例子。</p>" +
      "<p>工作紙印住「兒甥」。口語講姐姐個仔，通常會講「外甥」。溫習跟學校用字「兒甥」，同時知道日常講「外甥」。姪兒、姪女都跟工作紙讀。</p>" +
      bankGroup("time") + bankGroup("person") + bankGroup("place") + bankGroup("action") +
      '<p class="sentence">' + (sentence ? esc(sentence) : "先揀時間、人物、地點、事情。") + "</p>" +
      hint + countLine +
      '<p class="row-actions"><button type="button" class="primary" data-action="speak-built">讀出這句</button>' +
      '<button type="button" data-action="save-fav">存低這句</button>' +
      '<button type="button" data-action="clear-build">清除選擇</button></p>' +
      "<h3>通順例子</h3><div class=\"row-actions\">" + presets + "</div>" +
      "<h3>存低的句子</h3>" + favHTML + "</section>";
  }

  function overviewHTML() {
    var lessons = DATA.lessons.map(function (ls) {
      var focuses = ls.words.filter(function (w) { return w.focus; }).map(function (w) { return w.word; });
      return "<li>" + esc(lessonHeading(ls)) +
        (focuses.length ? "。重點：" + esc(focuses.join("、")) : "") +
        (ls.note ? "。" + esc(ls.note) : "") + "</li>";
    }).join("");
    var gaps = DATA.gaps.map(function (gap) { return "<li>" + esc(gap) + "</li>"; }).join("");
    var store = storageWorks() ? "做完的日子、存低的句子、開始日子同計時，都存在這部裝置。" : "這部瀏覽器未有儲存進度，做完日子未必留到。";
    return '<section class="parent"><h2>家長看這裏</h2>' +
      "<p>每日約十五分鐘。頁頂有計時，可以開始同暫停。答錯會見到參考答案同例句，沒有評分。</p>" +
      "<p>用瀏覽器開本頁。如果朗讀沒有聲音，在資料夾執行 python -m http.server，再用瀏覽器開頁面。最好有廣東話語音。</p>" +
      "<p>" + store + "</p>" +
      "<h3>範圍</h3><ul>" + lessons + "</ul>" +
      "<h3>觀察到未做的部分</h3><p>下面係睇到嘅情況，方便對返工作紙，唔係評語。</p><ul>" + gaps + "</ul>" +
      "<h3>家庭篇用字</h3>" +
      "<p>工作紙印住「兒甥」。口語講姐妹個仔，通常會講「外甥」。溫習跟學校用字「兒甥」。姪兒、姪女照工作紙讀。</p>" +
      "<h3>記認圖</h3><p>瓜、果、竹、米、田、石、山、水的圖是記認圖，不是甲骨文拓片。</p></section>";
  }

  function focusWordsFlat() {
    var out = [];
    var i;
    var j;
    for (i = 0; i < DATA.lessons.length; i += 1) {
      for (j = 0; j < DATA.lessons[i].words.length; j += 1) {
        if (DATA.lessons[i].words[j].focus) out.push(DATA.lessons[i].words[j]);
      }
    }
    return out;
  }

  function eveBox(id, label) {
    var on = loadJSON("anton-p1-eve", {})[id] ? " checked" : "";
    return '<label class="day-done"><input type="checkbox" data-action="toggle-eve" data-id="' + id + '"' + on + ">" + label + "</label>";
  }

  function viewToday() {
    var chips = focusWordsFlat().map(function (w) {
      return '<button type="button" class="word" data-action="speak" data-text="' + esc(w.word) + '">' + esc(w.word) + "</button>";
    }).join("");
    return '<p class="row-actions"><button type="button" class="primary" data-action="nav" data-view="play">去玩小遊戲</button></p>' +
      "<p>每關最多5題，答完有星星，中間要郁。錯咗只顯示答案。</p>" +
      "<h2>今晚三節，做完就瞓</h2>" +
      "<p>10月23日考試。六歲小朋友今晚大約四十分鐘，分三節。中間食飯、休息。眼訓或者喊就停。瞓得好，聽日先記得住。</p>" +
      "<p>頁頂計時預設十五分鐘。第一節、第二節用完撳重置。第三節做到十分鐘可以收。</p>" +
      '<p class="row-actions"><button type="button" class="primary" data-action="print">列印今晚計劃</button></p>' +
      '<section class="card"><h3>1 · 讀圈起嘅詞</h3><p>十五分鐘，放學或者晚飯前。</p>' +
      "<p>我讀一個，你讀一個。讀完我再指五個，你再讀。</p>" +
      '<p class="row-actions"><button type="button" class="primary" data-action="speak-focus">順序讀重點</button>' +
      '<button type="button" data-action="open-focus">逐張翻重點詞</button></p>' +
      '<div class="chip-row eve-words">' + chips + "</div></section>" +
      patternList([
        "我是小學生。",
        "我有新書包。",
        "風兒吹，花兒搖。",
        "魚兒游。",
        "月餅又香又甜。",
        "星期日，我和爸爸到公園放風箏。"
      ]) +
      '<section class="card"><h3>2 · 四素句</h3><p>十五分鐘，晚飯後。</p>' +
      "<p>選擇題已經做得好。今晚練自己講。一句有四樣：幾時、邊個、喺邊、做咩。</p>" +
      "<p>拆三句，再自己講放風箏。要有十二個字以上。</p>" +
      '<p class="sentence">星期日，我和爸爸到公園放風箏。</p>' +
      "<p>十三個字。幾時：星期日。邊個：我和爸爸。喺邊：到公園。做咩：放風箏。</p>" +
      '<p class="row-actions"><button type="button" class="primary" data-action="nav" data-view="four">去拆句同砌句</button></p></section>' +
      '<section class="card"><h3>3 · 標點、量詞、天空</h3><p>十分鐘，瞓前。攰就停。</p>' +
      "<p>錯咗就讀正確嗰句，唔好罰抄。第6課功課未填，所以要補聽四句。</p>" +
      "<p>書用本，花用朵，蘋果用個，小羊用隻。五朵花再認一次。</p>" +
      "<p>講完一件事用句號。問人用問號。「天上。有黑雲」句號放錯位。</p>" +
      '<p class="row-actions"><button type="button" class="primary" data-action="open-practice" data-practice="punct">做標點</button>' +
      '<button type="button" data-action="open-practice" data-practice="measure">做量詞</button>' +
      '<button type="button" data-action="open-practice" data-practice="ancient">認古字</button></p></section>' +
      patternList([
        "天上有白雲。",
        "今天我要上體育課。",
        "下雨了，我們回家去。",
        "天上有月，還有星。"
      ]) +
      "<h3>做到就剔</h3>" +
      eveBox("read", "重點詞讀過一轉") +
      eveBox("say", "六句跟住講過") +
      eveBox("four", "四素句拆過，並講咗放風箏") +
      eveBox("quiz", "標點同量詞做過，錯題讀過正確句") +
      eveBox("sky", "第6課四句讀過") +
      '<section class="card"><h3>聽朝五分鐘</h3><ol><li>起身之後，再聽重點詞一次。</li>' +
      "<li>講一次：星期日，我和爸爸到公園放風箏。</li>" +
      "<li>食早餐。唔好臨出門加新題。</li></ol></section>" +
      '<section class="parent"><h3>默書如果會考圈起嘅字</h3>' +
      "<p>有時間先抄五個：早、好、說、隻、狗。抄唔過十分鐘。寫字頁有筆順。</p>" +
      '<p class="row-actions"><button type="button" data-action="go-write" data-char="早">去寫字</button></p></section>' +
      '<details class="panel parent"><summary>範圍同未做頁</summary>' + overviewHTML() + "</details>";
  }

  function viewPlan() {
    var sug = suggestedDayNumber();
    var cards = DATA.days.map(function (day) {
      var flag = isDone(day.n) ? '<p class="done-flag">做完</p>' : "<p>未做</p>";
      var cls = "card" + (sug === day.n ? " is-suggest" : "");
      return '<article class="' + cls + '"><h3>第 ' + day.n + " 日 · " + esc(day.title) + "</h3>" +
        flag + "<p>" + esc(day.blurb) + "</p>" +
        '<button type="button" data-action="open-day" data-day="' + day.n + '">做這日</button></article>';
    }).join("");
    return "<h2>加練</h2><p>聽日先考。今晚跟住「今晚」三節就夠，呢度唔好追晒七日。</p><p id=\"suggest-line\">" + esc(suggestText()) + "</p>" +
      "<p>如果仲有精神，先揀一日。答錯會見到參考答案，沒有評分。</p>" +
      '<p><button type="button" class="primary" data-action="print">列印今晚計劃</button></p>' +
      cards + overviewHTML();
  }

  function viewWords() {
    var deck = wordsDeck();
    if (state.flash.index >= deck.length) state.flash.index = 0;
    var filters = '<div class="filters"><button type="button" data-action="flash-filter" data-lesson="all"' +
      (state.flash.lesson === "all" ? ' class="is-on"' : "") + ">全部</button>" +
      DATA.lessons.map(function (ls) {
        var on = state.flash.lesson === ls.id ? ' class="is-on"' : "";
        return '<button type="button" data-action="flash-filter" data-lesson="' + esc(ls.id) + '"' + on + ">" + esc(ls.num) + "</button>";
      }).join("") +
      '<button type="button" data-action="flash-focus"' + (state.flash.focusOnly ? ' class="is-on"' : "") + ">只看重點</button></div>";
    if (!deck.length) {
      return "<h2>詞語</h2>" + filters + "<p>這個範圍未有詞。</p>";
    }
    var item = deck[state.flash.index];
    var w = item.word;
    var badge = w.focus ? '<span class="badge">重點</span>' : "";
    return "<h2>詞語</h2><p>點「聽一次」跟住讀。圈出的詞有重點標。</p>" + filters +
      '<article class="card"><p>' + esc(lessonHeading(item.lesson)) + "</p>" +
      '<p class="flash-word">' + esc(w.word) + badge + "</p>" +
      (w.note ? "<p>" + esc(w.note) + "</p>" : "") +
      (item.lesson.note ? "<p>" + esc(item.lesson.note) + "</p>" : "") +
      '<p class="sentence">' + esc(w.example) + "</p>" +
      '<p class="row-actions"><button type="button" class="primary" data-action="speak" data-text="' + esc(w.word) + '">聽一次</button>' +
      '<button type="button" data-action="speak" data-text="' + esc(w.example) + '">聽例句</button></p>' +
      '<p class="row-actions"><button type="button" data-action="flash-move" data-step="-1">上一張</button>' +
      '<button type="button" data-action="flash-move" data-step="1">下一張</button></p>' +
      "<p>第 " + (state.flash.index + 1) + " 張，共 " + deck.length + " 張</p></article>";
  }

  function viewPractice() {
    var tabs = '<div class="filters">' + PRACTICE.map(function (key) {
      return '<button type="button" data-action="practice-type" data-practice="' + key + '"' +
        (state.practice === key ? ' class="is-on"' : "") + ">" + PRACTICE_LABEL[key] + "</button>";
    }).join("") + "</div>";
    var body = state.practice === "ancient"
      ? boardHTML("b4") + boardHTML("b5")
      : quizHTML("practice-" + state.practice);
    return "<h2>練習</h2><p>答錯會見到參考答案同例句，沒有評分。</p>" + tabs + body;
  }

  function viewFour() {
    return "<h2>四素句</h2>" +
      "<p>A 時間素、B 人物素、C 地點素、D 事情素。</p>" +
      "<p>標註卷第一、二部分都穩。今日重點係自己砌一句。挑戰題上次留空。</p>" +
      workedExampleHTML() +
      labellerHTML("all", DATA.fourItems) +
      '<section class="card" id="day-quiz"><h3>選擇</h3>' + quizHTML("mc") + "</section>" +
      kiteHTML() +
      builderHTML();
  }

  function currentChar() {
    var i;
    for (i = 0; i < DATA.chars.length; i += 1) {
      if (DATA.chars[i].ch === state.char) return DATA.chars[i];
    }
    return DATA.chars[0];
  }

  function viewWrite() {
    var ch = currentChar();
    var picker = DATA.chars.map(function (item) {
      var on = item.ch === state.char;
      return '<button type="button" data-action="write-char" data-char="' + esc(item.ch) + '"' +
        (on ? ' class="is-on" aria-pressed="true"' : ' aria-pressed="false"') + ">" + esc(item.ch) + "</button>";
    }).join("");
    var steps = ch.strokes.length
      ? "<ol class=\"strokes\">" + ch.strokes.map(function (step) { return "<li>" + esc(step) + "</li>"; }).join("") + "</ol>"
      : "";
    return "<h2>寫字</h2><p>照住淡色的字寫。筆順俾家長跟住講。</p>" +
      '<div class="char-row">' + picker + "</div>" +
      '<section class="card"><h3>' + esc(ch.ch) + "</h3><p>" + esc(ch.hint) + "</p>" + steps +
      '<canvas id="pad" width="420" height="420" aria-label="寫字板"></canvas>' +
      '<p class="row-actions"><button type="button" data-action="write-undo">撤銷</button>' +
      '<button type="button" data-action="write-clear">清除</button>' +
      '<button type="button" data-action="speak" data-text="' + esc(ch.ch) + '">聽這個字</button></p></section>';
  }

  function gameById(id) {
    var list = DATA.games || [];
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function loadBest() {
    var data = loadJSON(KEY.game, {});
    return data && typeof data === "object" ? data : {};
  }

  function saveBest(id, score) {
    var best = loadBest();
    var prev = Number(best[id]) || 0;
    if (score > prev) {
      best[id] = score;
      saveJSON(KEY.game, best);
    }
  }

  function pipsHTML(n, total) {
    var shown = Math.max(0, Math.min(n, total));
    var html = '<span class="pips" aria-label="' + shown + " 粒星，共 " + total + '">';
    var i;
    for (i = 0; i < total; i += 1) {
      html += '<span class="pip' + (i < shown ? " is-on" : "") + '"></span>';
    }
    return html + "</span>";
  }

  function speakPrompt(item) {
    return String(item.prompt).replace(/____/g, "什麼");
  }

  function syncChrome() {
    document.body.classList.toggle("is-play", state.view === "play");
    var h1 = document.querySelector(".site-head h1");
    if (h1) h1.textContent = state.view === "play" ? "聽日小遊戲" : "聽日考試";
  }

  function advancePlay() {
    var game = gameById(state.play.id);
    state.play.token += 1;
    if (!game) {
      state.play.phase = "home";
      state.play.id = "";
      render();
      return;
    }
    state.play.index += 1;
    state.play.picked = "";
    if (state.play.index >= game.items.length) {
      state.play.phase = "break";
      saveBest(game.id, state.play.correct);
    } else {
      state.play.phase = "ask";
    }
    keepScroll = false;
    render();
  }

  function armAdvance() {
    var token = ++state.play.token;
    window.setTimeout(function () {
      if (token !== state.play.token) return;
      if (state.view !== "play" || state.play.phase !== "good") return;
      advancePlay();
    }, 900);
  }

  function resetPlayHome() {
    state.play.token += 1;
    state.play.id = "";
    state.play.index = 0;
    state.play.correct = 0;
    state.play.phase = "home";
    state.play.picked = "";
    state.play.spoken = -1;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function viewPlay() {
    var best = loadBest();
    var game = gameById(state.play.id);
    if (state.play.phase === "home" || !game) {
      var doors = (DATA.games || []).map(function (g) {
        var score = Number(best[g.id]) || 0;
        return '<button type="button" class="game-door" data-action="play-start" data-id="' + esc(g.id) + '">' +
          '<span class="game-door-title">' + esc(g.title) + "</span>" +
          '<span class="game-door-meta">' + g.items.length + " 題</span>" +
          pipsHTML(score, g.items.length) + "</button>";
      }).join("");
      return "<h2>揀一個遊戲</h2>" +
        "<p>每關最多五題。答完有星星。中間要郁一郁。</p>" +
        doors +
        '<p class="row-actions"><button type="button" data-action="nav" data-view="today">家長計劃</button></p>';
    }
    var total = game.items.length;
    if (state.play.phase === "break" || state.play.index >= total) {
      return "<h2>" + esc(game.title) + " 完</h2>" +
        pipsHTML(state.play.correct, total) +
        '<p class="game-score">今次 ' + state.play.correct + " / " + total + "</p>" +
        '<p class="game-move">' + esc(game.move) + "</p>" +
        '<p class="row-actions"><button type="button" class="primary" data-action="play-home">返去揀關</button></p>';
    }
    var item = game.items[state.play.index];
    if (state.play.phase === "ask" && state.play.spoken !== state.play.index) {
      state.play.spoken = state.play.index;
      state.pendingSpeak = speakPrompt(item);
    }
    var progress = '<p class="game-progress">第 ' + (state.play.index + 1) + " / " + total + "</p>" +
      pipsHTML(state.play.correct, total);
    var prompt = '<p class="game-prompt">' + esc(item.prompt) + "</p>";
    var stop = '<button type="button" data-action="play-stop">停一停</button>';
    if (state.play.phase === "good") {
      return progress + prompt +
        '<p class="game-feedback">掂</p>' +
        '<p class="sentence">' + esc(item.say) + "</p>" +
        '<p class="row-actions"><button type="button" class="primary" data-action="play-next">下一題</button>' + stop + "</p>";
    }
    if (state.play.phase === "bad") {
      return progress + prompt +
        '<p class="game-answer">答案係「' + esc(item.answer) + '」</p>' +
        '<p class="sentence">' + esc(item.say) + "</p>" +
        '<p class="row-actions"><button type="button" class="primary" data-action="play-next">下一題</button>' +
        '<button type="button" data-action="speak" data-text="' + esc(item.say) + '">聽一次</button>' +
        stop + "</p>";
    }
    var options = item.options.map(function (opt) {
      return '<button type="button" class="game-choice" data-action="play-pick" data-value="' + esc(opt) + '">' + esc(opt) + "</button>";
    }).join("");
    return progress + prompt +
      '<div class="game-choices">' + options + "</div>" +
      '<p class="row-actions"><button type="button" data-action="speak" data-text="' + esc(speakPrompt(item)) + '">聽一次</button>' +
      stop + "</p>";
  }

  function viewHTML() {
    if (!DATA) return "<p>資料未載入。</p>";
    if (state.view === "play") return viewPlay();
    if (state.view === "plan") return viewPlan();
    if (state.view === "words") return viewWords();
    if (state.view === "practice") return viewPractice();
    if (state.view === "four") return viewFour();
    if (state.view === "write") return viewWrite();
    return viewToday();
  }

  function fillPrint() {
    var root = document.getElementById("print-plan");
    if (!root) return;
    var words = focusWordsFlat().map(function (w) { return w.word; }).join("、");
    var gaps = DATA.gaps.map(function (gap) { return "<li>" + esc(gap) + "</li>"; }).join("");
    root.innerHTML = "<h1>聽日考試 · 今晚三節</h1>" +
      "<p>Anton · 聖公會奉基小學 · 一年級上學期中文 · 10月23日</p>" +
      "<h2>1. 讀圈起嘅詞（15分鐘）</h2><p>" + esc(words) + "</p>" +
      "<p>六句：我是小學生。我有新書包。風兒吹，花兒搖。魚兒游。月餅又香又甜。星期日，我和爸爸到公園放風箏。</p>" +
      "<h2>2. 四素句（15分鐘）</h2><p>幾時、邊個、喺邊、做咩。拆三句，再講放風箏。</p>" +
      "<h2>3. 標點、量詞、天空（10分鐘）</h2>" +
      "<p>天上有白雲。今天我要上體育課。下雨了，我們回家去。天上有月，還有星。</p>" +
      "<p>書用本，花用朵，蘋果用個，小羊用隻。問人用問號。</p>" +
      "<h2>聽朝五分鐘</h2><p>再聽重點詞一次，講一次放風箏，然後食早餐。</p>" +
      "<h2>未做頁</h2><ul>" + gaps + "</ul>";
  }

  function navUpdate() {
    var buttons = document.querySelectorAll(".nav button[data-view]");
    Array.prototype.forEach.call(buttons, function (btn) {
      var on = btn.getAttribute("data-view") === state.view;
      if (on) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function flushPendingSpeak() {
    if (!state.pendingSpeak) return;
    var text = state.pendingSpeak;
    state.pendingSpeak = "";
    speak(text);
  }

  function drawPad() {
    var canvas = document.getElementById("pad");
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var cssW = rect.width || 320;
    var cssH = rect.height || cssW;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = "#f4efe4";
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.strokeStyle = "rgba(29,26,22,0.45)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, cssW - 20, cssH - 20);
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(cssW / 2, 10);
    ctx.lineTo(cssW / 2, cssH - 10);
    ctx.moveTo(10, cssH / 2);
    ctx.lineTo(cssW - 10, cssH / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#1d1a16";
    ctx.font = Math.floor(cssW * 0.62) + 'px "Songti TC","PMingLiU",Palatino,serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(state.char, cssW / 2, cssH / 2 + cssH * 0.02);
    ctx.restore();
    ctx.strokeStyle = "#1d1a16";
    ctx.fillStyle = "#1d1a16";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    state.strokes.forEach(function (stroke) {
      if (!stroke.length) return;
      if (stroke.length === 1) {
        ctx.beginPath();
        ctx.arc(stroke[0].x, stroke[0].y, 4, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      var i;
      for (i = 1; i < stroke.length; i += 1) ctx.lineTo(stroke[i].x, stroke[i].y);
      ctx.stroke();
    });
  }

  function bindPad(canvas) {
    if (canvas.getAttribute("data-bound") === "1") return;
    canvas.setAttribute("data-bound", "1");
    var drawing = false;
    var pos = function (event) {
      var r = canvas.getBoundingClientRect();
      return { x: event.clientX - r.left, y: event.clientY - r.top };
    };
    canvas.addEventListener("pointerdown", function (event) {
      if (event.button != null && event.button !== 0) return;
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      drawing = true;
      state.strokes.push([pos(event)]);
      drawPad();
    });
    canvas.addEventListener("pointermove", function (event) {
      if (!drawing) return;
      var stroke = state.strokes[state.strokes.length - 1];
      stroke.push(pos(event));
      drawPad();
    });
    var end = function () { drawing = false; };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
  }

  function afterRender() {
    syncChrome();
    navUpdate();
    flushPendingSpeak();
    var canvas = document.getElementById("pad");
    if (canvas) {
      bindPad(canvas);
      window.requestAnimationFrame(drawPad);
    }
    fillPrint();
    updateVoiceNote();
    paintTimer();
  }

  function render() {
    var y = keepScroll ? window.scrollY : 0;
    var scrollTo = state.scrollTo;
    state.scrollTo = "";
    main.innerHTML = viewHTML();
    afterRender();
    if (scrollTo) {
      var el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ block: "start" });
    } else if (keepScroll) {
      window.scrollTo(0, y);
    } else {
      window.scrollTo(0, 0);
    }
    keepScroll = false;
  }

  function go(view) {
    if (VIEWS.indexOf(view) === -1) view = "play";
    state.play.token += 1;
    if (window.speechSynthesis && view !== state.view) window.speechSynthesis.cancel();
    if (location.hash === "#" + view) {
      state.view = view;
      keepScroll = false;
      render();
      return;
    }
    location.hash = view;
  }

  function onQuizPick(btn) {
    var scope = btn.getAttribute("data-scope");
    var st = getQuiz(scope);
    if (st.picked) return;
    var q = questionById(btn.getAttribute("data-qid"));
    if (!q) return;
    st.picked = btn.getAttribute("data-value");
    state.pendingSpeak = q.model;
    keepScroll = true;
    render();
  }

  function onLabCheck(scope) {
    var items = scope.indexOf("day-") === 0
      ? labItems(dayByNumber(Number(scope.slice(4))).labItemIds || [])
      : DATA.fourItems;
    var st = labState(scope, items);
    var item = items[st.cursor];
    if (!item) return;
    var filled = item.parts.every(function (_, index) { return !!st.assign[index]; });
    if (!filled) {
      state.hint = "四格都分好先對。";
      state.hintScope = scope;
      keepScroll = true;
      render();
      return;
    }
    st.ok = item.parts.every(function (part, index) { return st.assign[index] === part.role; });
    st.checked = true;
    state.hint = "";
    state.pendingSpeak = joinItem(item);
    keepScroll = true;
    render();
  }

  document.body.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    if (action === "nav") {
      go(btn.getAttribute("data-view"));
      return;
    }
    if (action === "open-day") {
      state.day = Number(btn.getAttribute("data-day")) || 1;
      if (state.view !== "today") go("today");
      else {
        keepScroll = false;
        render();
      }
      return;
    }
    if (action === "speak") {
      speak(btn.getAttribute("data-text"));
      return;
    }
    if (action === "speak-focus") {
      speakAll(focusWordsFlat().map(function (word) { return word.word; }));
      return;
    }
    if (action === "open-focus") {
      state.flash.focusOnly = true;
      state.flash.lesson = "all";
      state.flash.index = 0;
      go("words");
      return;
    }
    if (action === "open-practice") {
      var opened = btn.getAttribute("data-practice");
      if (PRACTICE.indexOf(opened) !== -1) state.practice = opened;
      go("practice");
      return;
    }
    if (action === "speak-day") {
      var day = dayByNumber(Number(btn.getAttribute("data-day")));
      var list = [];
      dayWords(day).forEach(function (word) {
        list.push(word.word);
        if (word.focus) list.push(word.word);
      });
      speakAll(list);
      return;
    }
    if (action === "quiz-pick") {
      onQuizPick(btn);
      return;
    }
    if (action === "quiz-next") {
      var quiz = getQuiz(btn.getAttribute("data-scope"));
      quiz.index += 1;
      quiz.picked = null;
      keepScroll = true;
      render();
      return;
    }
    if (action === "quiz-reset") {
      quizState[btn.getAttribute("data-scope")] = null;
      keepScroll = true;
      render();
      return;
    }
    if (action === "quiz-replay") {
      var replayScope = btn.getAttribute("data-scope");
      var replayQuiz = getQuiz(replayScope);
      var replayQ = questionsFor(replayScope)[replayQuiz.index];
      if (replayQ) speak(replayQ.speak || replayQ.model);
      return;
    }
    if (action === "match") {
      var board = btn.getAttribute("data-board");
      var glyph = btn.getAttribute("data-glyph");
      var choice = btn.getAttribute("data-choice");
      if (!state.match[board]) state.match[board] = {};
      state.match[board][glyph] = choice;
      state.pendingSpeak = DATA.glyphSentences[glyph] || glyph;
      keepScroll = true;
      render();
      return;
    }
    if (action === "lab-select") {
      var selectScope = btn.getAttribute("data-scope");
      var selectItems = selectScope.indexOf("day-") === 0
        ? labItems(dayByNumber(Number(selectScope.slice(4))).labItemIds || [])
        : DATA.fourItems;
      var selectState = labState(selectScope, selectItems);
      if (selectState.checked) return;
      selectState.selected = Number(btn.getAttribute("data-part"));
      state.hint = "";
      keepScroll = true;
      render();
      return;
    }
    if (action === "lab-assign") {
      var assignScope = btn.getAttribute("data-scope");
      var assignItems = assignScope.indexOf("day-") === 0
        ? labItems(dayByNumber(Number(assignScope.slice(4))).labItemIds || [])
        : DATA.fourItems;
      var assignState = labState(assignScope, assignItems);
      if (assignState.checked) return;
      if (assignState.selected == null) {
        state.hint = "先點一格，再點時間素、人物素、地點素或事情素。";
        state.hintScope = assignScope;
        keepScroll = true;
        render();
        return;
      }
      assignState.assign[assignState.selected] = btn.getAttribute("data-role");
      assignState.selected = null;
      state.hint = "";
      keepScroll = true;
      render();
      return;
    }
    if (action === "lab-check") {
      onLabCheck(btn.getAttribute("data-scope"));
      return;
    }
    if (action === "lab-shuffle") {
      var shuffleScope = btn.getAttribute("data-scope");
      var shuffleItems = shuffleScope.indexOf("day-") === 0
        ? labItems(dayByNumber(Number(shuffleScope.slice(4))).labItemIds || [])
        : DATA.fourItems;
      var shuffleState = labState(shuffleScope, shuffleItems);
      var shuffleItem = shuffleItems[shuffleState.cursor];
      if (!shuffleItem) return;
      shuffleState.order = shuffle(shuffleItem.parts.map(function (_, i) { return i; }));
      shuffleState.selected = null;
      shuffleState.assign = {};
      shuffleState.checked = false;
      shuffleState.ok = false;
      keepScroll = true;
      render();
      return;
    }
    if (action === "lab-next") {
      var nextScope = btn.getAttribute("data-scope");
      if (state.lab[nextScope]) {
        state.lab[nextScope].cursor += 1;
        state.lab[nextScope].itemId = "";
      }
      keepScroll = true;
      render();
      return;
    }
    if (action === "lab-reset") {
      state.lab[btn.getAttribute("data-scope")] = null;
      keepScroll = true;
      render();
      return;
    }
    if (action === "chip") {
      var group = btn.getAttribute("data-group");
      var text = btn.getAttribute("data-text");
      if (state.build[group] === text && state.outputMode === "build") state.build[group] = "";
      else state.build[group] = text;
      state.outputMode = "build";
      state.hint = "";
      keepScroll = true;
      render();
      return;
    }
    if (action === "use-preset") {
      state.outputMode = "preset";
      state.presetText = btn.getAttribute("data-text");
      state.hint = "";
      if (!btn.closest("#builder")) state.scrollTo = "builder";
      keepScroll = true;
      render();
      return;
    }
    if (action === "jump") {
      var target = document.getElementById(btn.getAttribute("data-target"));
      if (target) target.scrollIntoView({ block: "start" });
      return;
    }
    if (action === "speak-built") {
      var spoken = currentSentence();
      if (!sentenceComplete(spoken)) {
        state.hint = "未揀齊。可以先讀通順例子。";
        state.hintScope = "builder";
        keepScroll = true;
        render();
        return;
      }
      state.hint = "";
      speak(spoken);
      return;
    }
    if (action === "save-fav") {
      var saving = currentSentence();
      if (!sentenceComplete(saving)) {
        state.hint = "四樣都揀齊，或揀一句通順例子，先存低。";
        state.hintScope = "builder";
        keepScroll = true;
        render();
        return;
      }
      state.hint = "";
      saveFav(saving);
      keepScroll = true;
      render();
      return;
    }
    if (action === "delete-fav") {
      deleteFav(btn.getAttribute("data-text"));
      keepScroll = true;
      render();
      return;
    }
    if (action === "clear-build") {
      state.build = { time: "", person: "", place: "", action: "" };
      state.outputMode = "build";
      state.presetText = "";
      keepScroll = true;
      render();
      return;
    }
    if (action === "write-char") {
      state.char = btn.getAttribute("data-char") || "八";
      state.strokes = [];
      keepScroll = true;
      render();
      return;
    }
    if (action === "go-write") {
      state.char = btn.getAttribute("data-char") || state.char;
      state.strokes = [];
      go("write");
      return;
    }
    if (action === "write-undo") {
      state.strokes.pop();
      drawPad();
      return;
    }
    if (action === "write-clear") {
      state.strokes = [];
      drawPad();
      return;
    }
    if (action === "flash-filter") {
      state.flash.lesson = btn.getAttribute("data-lesson") || "all";
      state.flash.index = 0;
      keepScroll = true;
      render();
      return;
    }
    if (action === "flash-focus") {
      state.flash.focusOnly = !state.flash.focusOnly;
      state.flash.index = 0;
      keepScroll = true;
      render();
      return;
    }
    if (action === "flash-move") {
      var deck = wordsDeck();
      if (!deck.length) return;
      var step = Number(btn.getAttribute("data-step")) || 0;
      state.flash.index = (state.flash.index + step + deck.length) % deck.length;
      keepScroll = true;
      render();
      return;
    }
    if (action === "practice-type") {
      var nextPractice = btn.getAttribute("data-practice");
      if (PRACTICE.indexOf(nextPractice) !== -1) state.practice = nextPractice;
      keepScroll = false;
      render();
      return;
    }
    if (action === "timer-toggle") {
      startOrPauseTimer();
      paintTimer();
      return;
    }
    if (action === "timer-reset") {
      resetTimer();
      paintTimer();
      return;
    }
    if (action === "play-start") {
      var started = gameById(btn.getAttribute("data-id"));
      if (!started) return;
      state.play.token += 1;
      state.play.id = started.id;
      state.play.index = 0;
      state.play.correct = 0;
      state.play.phase = "ask";
      state.play.picked = "";
      state.play.spoken = -1;
      keepScroll = false;
      render();
      return;
    }
    if (action === "play-pick") {
      var round = gameById(state.play.id);
      if (!round || state.play.phase !== "ask") return;
      var current = round.items[state.play.index];
      if (!current) return;
      var value = btn.getAttribute("data-value");
      state.play.picked = value;
      state.pendingSpeak = current.say;
      if (value === current.answer) {
        state.play.correct += 1;
        state.play.phase = "good";
        render();
        armAdvance();
      } else {
        state.play.phase = "bad";
        render();
      }
      return;
    }
    if (action === "play-next") {
      if (state.play.phase !== "good" && state.play.phase !== "bad") return;
      advancePlay();
      return;
    }
    if (action === "play-stop" || action === "play-home") {
      resetPlayHome();
      keepScroll = false;
      render();
      return;
    }
    if (action === "print") window.print();
  });

  document.body.addEventListener("change", function (event) {
    var target = event.target;
    if (target && target.getAttribute("data-action") === "toggle-day") {
      setDayDone(target.getAttribute("data-day"), target.checked);
      keepScroll = true;
      render();
    }
    if (target && target.getAttribute("data-action") === "toggle-eve") {
      var eve = loadJSON("anton-p1-eve", {});
      var eveId = target.getAttribute("data-id");
      if (target.checked) eve[eveId] = true;
      else delete eve[eveId];
      saveJSON("anton-p1-eve", eve);
    }
  });

  window.addEventListener("hashchange", function () {
    var view = location.hash.replace("#", "");
    if (VIEWS.indexOf(view) === -1) view = "play";
    state.play.token += 1;
    state.view = view;
    keepScroll = false;
    render();
  });

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = updateVoiceNote;
  }
  window.setInterval(paintTimer, 250);

  var examPick = document.getElementById("exam-pick");
  if (examPick) {
    var resetExamPick = function () { examPick.value = "zh"; };
    resetExamPick();
    window.addEventListener("pageshow", resetExamPick);
    examPick.addEventListener("change", function () {
      if (examPick.value !== "en") return;
      var path = location.pathname;
      var marker = path.indexOf("/chinese");
      if (marker !== -1) {
        window.location.href = (path.slice(0, marker) || "") + "/";
        return;
      }
      window.location.href = "https://leeyipkan.github.io/anton-p1-exam1/";
    });
  }

  ensureStart();
  var suggested = suggestedDayNumber();
  state.day = suggested || 1;
  var initial = location.hash.replace("#", "");
  state.view = VIEWS.indexOf(initial) === -1 ? "play" : initial;
  if (!location.hash) history.replaceState(null, "", "#play");
  render();
})();
