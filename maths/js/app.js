(function () {
  var KEY = "anton-p1-maths-v1";
  var MOVES = [
    "企起身，伸個懶腰，再坐低。",
    "跳 5 下，然後飲口水。",
    "行去窗邊望一望，再返嚟。",
    "用力眨 5 下眼，搖搖手腕。"
  ];
  var main = document.getElementById("app");
  var pill = document.getElementById("star-pill");
  var state = {
    view: "home",
    game: "",
    round: [],
    index: 0,
    phase: "ask",
    picked: "",
    many: {},
    dots: {},
    roundStars: 0,
    ok: false
  };

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      return raw && typeof raw === "object" ? raw : {};
    } catch (err) {
      return {};
    }
  }

  function plainStore(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return data;
  }

  function writeStore(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (err) { /* ignore */ }
  }

  function stars() {
    return Number(load().stars) || 0;
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function speak(text) {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = "zh-HK";
    utter.rate = 0.92;
    window.speechSynthesis.speak(utter);
  }

  function today() {
    var now = new Date();
    return { month: now.getMonth() + 1, date: now.getDate() };
  }

  function suggested() {
    var t = today();
    if (t.month !== 10) return { id: "mix", note: "而家唔係考試週，玩混合 5 題就得。" };
    if (t.date <= 22) {
      if (new Date().getHours() >= 20) {
        return { id: "count", note: "今晚已經夜。可以聽朝先玩。如果仲想玩，數一數 5 題就收。" };
      }
      return { id: "count", note: "今日可以先玩一轉數一數。累了就停。" };
    }
    if (t.date === 23) return { id: "unit1", note: "今日玩數、比較、順數倒數同奇偶。一轉就夠。" };
    if (t.date === 24) return { id: "seqodd", note: "今日玩順數倒數同奇數偶數。" };
    if (t.date === 25) return { id: "patorder", note: "今日玩規律同排第幾。" };
    if (t.date === 26) return { id: "bond", note: "今日玩合成分解。聽日先玩圖形。" };
    if (t.date === 27) return { id: "shape", note: "考試日。朝早玩一轉圖形，有時間再混合 5 題。" };
    return { id: "mix", note: "評估已過。想保持手感，就玩混合 5 題。" };
  }

  function gameTitle(id) {
    var found = MATHS.games.filter(function (g) { return g.id === id; })[0];
    if (found) return found.title;
    if (id === "unit1") return "20 以內的數";
    if (id === "seqodd") return "順數同奇偶";
    if (id === "patorder") return "規律同次序";
    return "練習";
  }

  function render() {
    pill.textContent = stars() + " 星";
    var navView = state.view === "play" || state.view === "skills" ? "home" : state.view;
    document.querySelectorAll(".nav button").forEach(function (btn) {
      if (btn.getAttribute("data-nav") === navView) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
    if (state.view === "plan") main.innerHTML = planHTML();
    else if (state.view === "scope") main.innerHTML = scopeHTML();
    else if (state.view === "skills") main.innerHTML = skillsHTML();
    else if (state.view === "play") main.innerHTML = playHTML();
    else main.innerHTML = homeHTML();
    var focus = main.querySelector("[data-focus]");
    if (focus) focus.focus();
  }

  function homeHTML() {
    var tip = suggested();
    return (
      '<section class="card"><p class="lead">' + esc(tip.note) + "</p>" +
      '<button type="button" class="big main" data-start="' + esc(tip.id) + '"><strong>開始：' + esc(gameTitle(tip.id)) + "</strong><span>5 題，大約幾分鐘</span></button></section>" +
      '<div class="grid">' +
      '<button type="button" class="big" data-start="unit1"><strong>20 以內的數</strong><span>數、比較、順倒、奇偶、規律、次序</span></button>' +
      '<button type="button" class="big" data-start="bond"><strong>合成分解</strong><span>2 至 18，加和減</span></button>' +
      '<button type="button" class="big" data-start="shape"><strong>立體圖形</strong><span>五種圖形、疊同滾</span></button>' +
      '<button type="button" class="big" data-start="mix"><strong>混合 5 題</strong><span>三個單元都有</span></button>' +
      "</div>" +
      '<p><button type="button" class="ghost" data-nav="skills">揀一個課題</button></p>'
    );
  }

  function skillsHTML() {
    return (
      '<section class="card"><h2>揀一個課題</h2><div class="list">' +
      MATHS.games.map(function (g) {
        return '<button type="button" data-start="' + g.id + '"><strong>' + esc(g.title) + "</strong><span>" + esc(g.text) + "</span></button>";
      }).join("") +
      "</div></section>"
    );
  }

  function planHTML() {
    var rows = [
      ["10月23日", "數、比較、順數倒數、奇偶", "unit1"],
      ["10月24日", "順數倒數、奇數偶數", "seqodd"],
      ["10月25日", "規律、排第幾", "patorder"],
      ["10月26日", "合成分解", "bond"],
      ["10月27日朝早", "立體圖形，有時間再混合", "shape"]
    ];
    return (
      '<section class="card"><h2>去到 27 日</h2><p class="lead">每晚一轉，5 題。累了就停。做得對先有星，錯了不會扣星。</p><div class="list">' +
      rows.map(function (row) {
        return '<button type="button" data-start="' + row[2] + '"><strong>' + row[0] + "</strong><span>" + row[1] + "</span></button>";
      }).join("") +
      "</div></section>" +
      '<section class="card"><h2>帶去考試</h2><ul><li>鉛筆、橡皮、間尺</li><li>木顏色筆要輕便</li><li>選擇題要塗滿圓圈，不要只打勾</li><li>圈數量要剛剛好，多圈會錯</li></ul></section>'
    );
  }

  function scopeHTML() {
    var data = load();
    var tried = plainStore(data.tried);
    var lines = Object.keys(tried).map(function (id) {
      var row = tried[id];
      if (!row || typeof row !== "object") return "";
      var ok = Number(row.ok);
      var n = Number(row.n);
      if (!Number.isFinite(n)) return "";
      return "<li>" + esc(gameTitle(id)) + "：" + (Number.isFinite(ok) ? ok : 0) + "／" + n + "</li>";
    }).join("");
    return (
      '<section class="card"><h2>評估重點</h2><p class="muted">2026年10月27日 · 一年級數學科評估一</p>' +
      "<ul><li>單元一　20 以內的數：數數、順數、倒數、奇數、偶數、比較數量、規律、排次序</li>" +
      "<li>單元二　2 至 18 的合成和分解，包括加和減</li>" +
      "<li>單元三　角柱、角錐、圓柱、圓錐、球；邊個疊得穩，邊個滾得動</li>" +
      "<li>A 冊同作業第 1 至 9 課，補充第 1 至 5 課</li></ul>" +
      "<p>呢度嘅題目係按呢個範圍新編，不是課本原題。</p></section>" +
      '<section class="card"><h2>做過幾多</h2>' + (lines ? "<ul>" + lines + "</ul>" : "<p>未開始。</p>") +
      '<button type="button" class="ghost" id="reset">清空星星</button></section>'
    );
  }

  function current() {
    return state.round[state.index];
  }

  function playHTML() {
    if (state.phase === "break") {
      return (
        '<section class="qcard"><p class="q-top">這一轉 ' + state.roundStars + " 星</p>" +
        '<p class="move">' + esc(MOVES[state.roundStars % MOVES.length]) + "</p>" +
        '<div class="row"><button type="button" class="check" data-start="' + esc(state.game) + '">再玩一轉</button>' +
        '<button type="button" class="ghost" data-nav="home">返主頁</button></div></section>'
      );
    }
    var q = current();
    if (!q) return '<section class="card"><p>未能出題。</p></section>';
    return (
      '<section class="qcard"><div class="q-top"><span>第 ' + (state.index + 1) + " / 5 題</span>" +
      '<button type="button" class="speak" id="speak">讀出來</button></div>' +
      "<h2>" + esc(q.prompt) + "</h2>" +
      visualHTML(q) +
      answerHTML(q) +
      feedbackHTML(q) +
      '<button type="button" class="ghost" data-nav="home">返主頁</button></section>'
    );
  }

  function visualHTML(q) {
    if (q.kind === "circle") {
      var html = '<div class="dots">';
      for (var i = 0; i < q.total; i++) {
        html += '<button type="button" class="dot" data-dot="' + i + '" aria-pressed="' + (state.dots[i] ? "true" : "false") + '" aria-label="點 ' + (i + 1) + '"></button>';
      }
      return html + "</div>";
    }
    return q.visual || "";
  }

  function answerHTML(q) {
    if (state.phase === "feedback") return "";
    if (q.kind === "choice" || q.kind === "multi") {
      return '<div class="choices">' + q.options.map(function (opt) {
        var on = q.kind === "multi" ? !!state.many[opt.id] : state.picked === opt.id;
        return '<button type="button" class="choice" data-pick="' + esc(opt.id) + '" aria-pressed="' + (on ? "true" : "false") + '">' +
          (opt.html || "") + esc(opt.label) + "</button>";
      }).join("") + '</div><button type="button" class="check" id="check">檢查</button>';
    }
    if (q.kind === "pad") {
      var html = '<div class="pads">';
      for (var n = 0; n <= 20; n++) {
        html += '<button type="button" data-num="' + n + '" aria-pressed="' + (state.picked === String(n) ? "true" : "false") + '">' + n + "</button>";
      }
      return html + '</div><button type="button" class="check" id="check">檢查</button>';
    }
    return '<button type="button" class="check" id="check">檢查</button>';
  }

  function feedbackHTML(q) {
    if (state.phase !== "feedback") return "";
    var cls = state.ok ? "ok" : "wait";
    var title = state.ok ? "對了" : "再看一次";
    return '<div class="feedback ' + cls + '"><strong>' + title + "</strong><p>" + esc(q.because) +
      '</p><button type="button" class="check" id="next" data-focus="1">' + (state.index === 4 ? "這一轉完了" : "下一題") + "</button></div>";
  }

  function start(id) {
    state.view = "play";
    state.game = id;
    state.round = MATHS.makeRound(id);
    state.index = 0;
    state.phase = "ask";
    state.roundStars = 0;
    clearPicks();
    render();
    var q = current();
    if (q) speak(q.say);
  }

  function clearPicks() {
    state.picked = "";
    state.many = {};
    state.dots = {};
    state.ok = false;
  }

  function selectedCount(q) {
    if (q.kind === "choice" || q.kind === "pad") return state.picked ? 1 : 0;
    if (q.kind === "multi") return Object.keys(state.many).filter(function (id) { return state.many[id]; }).length;
    return Object.keys(state.dots).filter(function (id) { return state.dots[id]; }).length;
  }

  function isRight(q) {
    if (q.kind === "choice" || q.kind === "pad") return state.picked === q.answer;
    if (q.kind === "multi") {
      var got = Object.keys(state.many).filter(function (id) { return state.many[id]; }).sort();
      var want = q.answers.slice().sort();
      return got.join() === want.join();
    }
    var count = Object.keys(state.dots).filter(function (id) { return state.dots[id]; }).length;
    return String(count) === q.answer;
  }

  function mark(q) {
    if (!q) return;
    if (selectedCount(q) === 0) {
      speak("先選一個答案。");
      return;
    }
    state.ok = isRight(q);
    state.phase = "feedback";
    var data = plainStore(load());
    var starsN = Number(data.stars);
    if (!Number.isFinite(starsN) || starsN < 0) starsN = 0;
    var tried = plainStore(data.tried);
    var prev = tried[state.game];
    var row = prev && typeof prev === "object"
      ? { ok: Number(prev.ok) || 0, n: Number(prev.n) || 0 }
      : { ok: 0, n: 0 };
    row.n += 1;
    if (state.ok) {
      row.ok += 1;
      state.roundStars += 1;
      starsN += 1;
    }
    tried[state.game] = row;
    data.stars = starsN;
    data.tried = tried;
    writeStore(data);
    render();
    speak((state.ok ? "對了。" : "再看一次。") + q.because);
  }

  function next() {
    if (state.index >= 4) {
      state.phase = "break";
      render();
      speak(MOVES[state.roundStars % MOVES.length]);
      return;
    }
    state.index += 1;
    state.phase = "ask";
    clearPicks();
    render();
    var q = current();
    if (q) speak(q.say);
  }

  document.body.addEventListener("click", function (event) {
    var nav = event.target.closest("[data-nav]");
    if (nav) {
      state.view = nav.getAttribute("data-nav");
      render();
      return;
    }
    var startBtn = event.target.closest("[data-start]");
    if (startBtn) {
      start(startBtn.getAttribute("data-start"));
      return;
    }
    if (event.target.id === "reset") {
      try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ }
      render();
      return;
    }
    if (event.target.id === "speak") {
      var q = current();
      if (q) speak(q.say);
      return;
    }
    var pick = event.target.closest("[data-pick]");
    if (pick && state.phase === "ask") {
      var qPick = current();
      var id = pick.getAttribute("data-pick");
      if (qPick.kind === "multi") state.many[id] = !state.many[id];
      else state.picked = id;
      render();
      return;
    }
    var num = event.target.closest("[data-num]");
    if (num && state.phase === "ask") {
      state.picked = num.getAttribute("data-num");
      render();
      return;
    }
    var dot = event.target.closest("[data-dot]");
    if (dot && state.phase === "ask") {
      var dotId = dot.getAttribute("data-dot");
      state.dots[dotId] = !state.dots[dotId];
      render();
      return;
    }
    if (event.target.id === "check") mark(current());
    if (event.target.id === "next") next();
  });

  render();
})();
