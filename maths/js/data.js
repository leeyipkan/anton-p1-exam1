/* Original Primary 1 maths practice for the 27 Oct 2026 assessment.
   New questions on the stated skills. Not textbook or worksheet items. */
(function (root) {
  var SHAPE = {
    ball: { name: "球", roll: true, stack: false },
    cyl: { name: "圓柱", roll: true, stack: true },
    cone: { name: "圓錐", roll: true, stack: false },
    prism: { name: "角柱", roll: false, stack: true },
    pyra: { name: "角錐", roll: false, stack: false }
  };
  var SHAPE_KEYS = ["ball", "cyl", "cone", "prism", "pyra"];
  var COLORS = [
    { id: "red", name: "紅色" },
    { id: "blue", name: "藍色" },
    { id: "green", name: "綠色" },
    { id: "yellow", name: "黃色" },
    { id: "orange", name: "橙色" },
    { id: "purple", name: "紫色" }
  ];

  function rand(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function pick(list) {
    return list[rand(0, list.length - 1)];
  }

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = rand(0, i);
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function uniqNums(count, min, max) {
    var seen = {};
    var out = [];
    var guard = 0;
    while (out.length < count && guard < 80) {
      var n = rand(min, max);
      if (!seen[n]) {
        seen[n] = true;
        out.push(n);
      }
      guard++;
    }
    return out;
  }

  function letters(n) {
    return "ABCDEFG".slice(0, n).split("");
  }

  function choice(prompt, say, visual, pairs, answerLabel, because) {
    var order = shuffle(pairs);
    var options = order.map(function (pair, i) {
      return { id: letters(order.length)[i], label: pair.label, html: pair.html || "" };
    });
    var answer = "";
    options.forEach(function (opt) {
      if (opt.label === answerLabel) answer = opt.id;
    });
    return {
      kind: "choice",
      prompt: prompt,
      say: say || prompt,
      visual: visual || "",
      options: options,
      answer: answer,
      because: because
    };
  }

  function multi(prompt, say, visual, labels, answerLabels, because) {
    var options = shuffle(labels).map(function (label, i) {
      return { id: letters(labels.length)[i], label: String(label) };
    });
    var answers = [];
    options.forEach(function (opt) {
      if (answerLabels.indexOf(opt.label) >= 0) answers.push(opt.id);
    });
    return {
      kind: "multi",
      prompt: prompt,
      say: say || prompt,
      visual: visual || "",
      options: options,
      answers: answers,
      because: because
    };
  }

  function pad(prompt, say, visual, answer, because) {
    return {
      kind: "pad",
      prompt: prompt,
      say: say || prompt,
      visual: visual || "",
      answer: String(answer),
      because: because
    };
  }

  function fig(kind) {
    var body = {
      ball: '<circle cx="40" cy="42" r="26" fill="#ef6c4a"/><circle cx="31" cy="32" r="8" fill="#ffd7cc"/>',
      cyl: '<rect x="22" y="24" width="36" height="34" fill="#6a45b0"/><ellipse cx="40" cy="58" rx="18" ry="8" fill="#5e35b1"/><ellipse cx="40" cy="24" rx="18" ry="8" fill="#9575cd"/>',
      cone: '<polygon points="40,12 64,58 16,58" fill="#f9a825"/><ellipse cx="40" cy="58" rx="24" ry="9" fill="#fb8c00"/>',
      prism: '<polygon points="40,14 66,28 66,54 40,68 14,54 14,28" fill="#1e88e5"/><polygon points="40,14 66,28 40,42 14,28" fill="#90caf9"/>',
      pyra: '<polygon points="40,12 68,62 12,62" fill="#43a047"/><polygon points="40,12 40,62 68,62" fill="#2e7d32"/>'
    };
    return '<svg class="fig" viewBox="0 0 80 80" aria-hidden="true">' + (body[kind] || "") + "</svg>";
  }

  function frames(n) {
    var total = n > 10 ? 20 : 10;
    var html = '<div class="frames">';
    for (var i = 0; i < total; i++) {
      if (i % 10 === 0) html += '<div class="frame">';
      html += '<i class="pip' + (i < n ? " on" : "") + '"></i>';
      if (i % 10 === 9 || i === total - 1) html += "</div>";
    }
    html += "</div>";
    return html;
  }

  function looseDots(n, color) {
    var html = '<div class="loose">';
    for (var i = 0; i < n; i++) html += '<i class="pip on ' + color + '"></i>';
    html += "</div>";
    return html;
  }

  function propLine(shape) {
    var roll = shape.roll ? "會滾" : "不會滾";
    var stack = shape.stack ? "疊得穩" : "疊不穩";
    return roll + "，" + stack;
  }

  function makeCount() {
    if (Math.random() < 0.45) {
      var base = Math.random() < 0.5 ? 5 : 10;
      var extra = rand(1, base === 10 ? 8 : 5);
      var total = base + extra;
      return pad(
        "由 " + base + " 開始數，再數下面這些。一共有多少？",
        "由 " + base + " 開始數，再數這些點。一共有多少？",
        '<p class="badge">已經有 ' + base + "</p>" + looseDots(extra, "teal"),
        total,
        base + " 再數 " + extra + "，是 " + total + "。"
      );
    }
    var n = rand(1, 20);
    return pad(
      "數一數，有多少粒？",
      "數一數，有多少粒？",
      frames(n),
      n,
      "有 " + n + " 粒。" + (n > 10 ? " 十格滿了是 10，再數 " + (n - 10) + "。" : "")
    );
  }

  function makeCircle() {
    var total = rand(12, 20);
    var target = rand(5, total - 2);
    return {
      kind: "circle",
      prompt: "圈出 " + target + " 粒。要剛剛好，多一粒或少一粒都不算對。",
      say: "圈出 " + target + " 粒。",
      total: total,
      target: target,
      answer: String(target),
      because: "題目要 " + target + " 粒。多圈或少圈，這題都不算對。"
    };
  }

  function makeCompare() {
    var left = rand(1, 14);
    var right = rand(1, 14);
    if (Math.random() < 0.75 && left === right) right = left === 14 ? left - 1 : left + 1;
    var visual =
      '<div class="cmp"><div><p>甲</p>' + looseDots(left, "rose") + "<b>" + left + '</b></div><div><p>乙</p>' + looseDots(right, "sky") + "<b>" + right + "</b></div></div>";
    var roll = rand(1, 5);
    if (left === right) {
      return choice(
        "甲和乙的數量怎樣？",
        "甲和乙的數量怎樣？",
        visual,
        [
          { label: "一樣多" },
          { label: "甲較多" },
          { label: "乙較多" }
        ],
        "一樣多",
        "兩邊都是 " + left + "，一樣多。"
      );
    }
    if (roll === 1) {
      var more = left > right ? "甲" : "乙";
      return choice("哪一邊較多？", "哪一邊較多？", visual, [{ label: "甲" }, { label: "乙" }], more, more + "有 " + Math.max(left, right) + "，較多。");
    }
    if (roll === 2) {
      var fewer = left < right ? "甲" : "乙";
      return choice("哪一邊較少？", "哪一邊較少？", visual, [{ label: "甲" }, { label: "乙" }], fewer, fewer + "有 " + Math.min(left, right) + "，較少。");
    }
    if (roll === 3) {
      var bigger = left > right ? String(left) : String(right);
      return choice(
        "比較 " + left + " 和 " + right + "，哪個數較大？",
        "哪個數較大？",
        visual,
        [{ label: String(left) }, { label: String(right) }],
        bigger,
        bigger + " 較大。"
      );
    }
    if (roll === 4) {
      var word = left > right ? "多" : "少";
      return choice(
        left + " 比 " + right + "（多還是少）？",
        left + " 比 " + right + "，是多還是少？",
        visual,
        [{ label: "多" }, { label: "少" }],
        word,
        left + " 比 " + right + word + "。"
      );
    }
    var size = left > right ? "大" : "小";
    return choice(
      left + " 比 " + right + "（大還是小）？",
      left + " 比 " + right + "，是大還是小？",
      visual,
      [{ label: "大" }, { label: "小" }],
      size,
      left + " 比 " + right + size + "。"
    );
  }

  function sequence(step) {
    var start = step > 0 ? rand(1, 20 - step * 4) : rand(1 + Math.abs(step) * 4, 20);
    var nums = [];
    for (var i = 0; i < 5; i++) nums.push(start + i * step);
    return nums;
  }

  function makeSequence() {
    var step = Math.random() < 0.5 ? 1 : -1;
    var nums = sequence(step);
    var hide = rand(0, 4);
    var shown = nums.map(function (n, i) {
      return i === hide ? "□" : String(n);
    });
    var name = step > 0 ? "順數" : "倒數";
    return pad(
      shown.join(" 、 ") + "　空格是多少？",
      "找找空格裏的數。",
      '<p class="seq">' + shown.map(function (n) {
        return "<span>" + n + "</span>";
      }).join("") + "</p>",
      nums[hide],
      "這是" + name + "。空格是 " + nums[hide] + "。"
    );
  }

  function makeDirection() {
    var step = Math.random() < 0.5 ? 1 : -1;
    var nums = sequence(step);
    var name = step > 0 ? "順數" : "倒數";
    return choice(
      nums.join(" 、 ") + "　這是順數還是倒數？",
      "這是順數還是倒數？",
      '<p class="seq">' + nums.map(function (n) { return "<span>" + n + "</span>"; }).join("") + "</p>",
      [{ label: "順數" }, { label: "倒數" }],
      name,
      "一個比一個" + (step > 0 ? "大" : "小") + "，是" + name + "。"
    );
  }

  function makeSort() {
    var nums = uniqNums(4, 1, 20);
    var asc = nums.slice().sort(function (a, b) { return a - b; });
    var desc = asc.slice().reverse();
    var swapped = asc.slice();
    var tmp = swapped[0];
    swapped[0] = swapped[1];
    swapped[1] = tmp;
    var labels = [asc.join("、"), desc.join("、"), swapped.join("、")];
    if (labels[1] === labels[2]) labels[2] = asc.slice().reverse().join("、") + " ";
    return choice(
      "把 " + shuffle(nums).join("、") + " 由小到大排。",
      "由小到大，怎樣排？",
      "",
      labels.map(function (label) { return { label: label.trim() }; }),
      asc.join("、"),
      "由小到大是 " + asc.join("、") + "。"
    );
  }

  function makeOddEven() {
    var n = rand(1, 20);
    var name = n % 2 ? "奇數" : "偶數";
    return choice(
      n + " 是奇數還是偶數？",
      n + " 是奇數還是偶數？",
      frames(n),
      [{ label: "奇數" }, { label: "偶數" }],
      name,
      n + " 是" + name + "。" + (n % 2 ? " 單數不能分成兩份一樣多。" : " 雙數可以分成兩份一樣多。")
    );
  }

  function makeOddList() {
    var nums = [];
    var guard = 0;
    while (guard < 30) {
      nums = uniqNums(6, 1, 20);
      var odds = nums.filter(function (n) { return n % 2 === 1; });
      if (odds.length >= 2 && odds.length <= 4) break;
      guard++;
    }
    var wantOdd = Math.random() < 0.5;
    var picked = nums.filter(function (n) { return wantOdd ? n % 2 === 1 : n % 2 === 0; });
    var name = wantOdd ? "奇數" : "偶數";
    return multi(
      "以下哪些是" + name + "？可選多於一個。",
      "哪些是" + name + "？",
      "",
      nums.map(String),
      picked.map(String),
      name + "有 " + picked.join("、") + "。"
    );
  }

  function makePlusOne() {
    var n = rand(1, 19);
    var next = n + 1;
    var name = next % 2 ? "奇數" : "偶數";
    var from = n % 2 ? "奇數" : "偶數";
    return choice(
      from + "多 1，是奇數還是偶數？例如 " + n + " 多 1。",
      from + "多 1，是奇數還是偶數？",
      "",
      [{ label: "奇數" }, { label: "偶數" }],
      name,
      n + " 是" + from + "，多 1 是 " + next + "，是" + name + "。"
    );
  }

  function makeFair() {
    var n = rand(2, 18);
    var ok = n % 2 === 0;
    return choice(
      n + " 粒可以分成數量相等的兩份嗎？",
      n + " 粒，可以分成一樣多的兩份嗎？",
      frames(n),
      [{ label: "可以" }, { label: "不可以" }],
      ok ? "可以" : "不可以",
      ok ? n + " 是偶數，每份 " + n / 2 + " 粒。" : n + " 是奇數，不能分成兩份一樣多。"
    );
  }

  function makePattern() {
    if (Math.random() < 0.5) {
      var a = pick(COLORS);
      var b = pick(COLORS.filter(function (c) { return c.id !== a.id; }));
      var seq = [a, b, a, b, a];
      var visual = '<p class="chips">' + seq.slice(0, 4).map(function (c) {
        return '<i class="chip ' + c.id + '"></i>';
      }).join("") + '<i class="chip hole">?</i></p>';
      return choice(
        "依規律，下一個是什麼顏色？",
        "依規律，下一個是什麼顏色？",
        visual,
        [{ label: a.name }, { label: b.name }],
        a.name,
        "一" + a.name + "、一" + b.name + "，下一個是" + a.name + "。"
      );
    }
    var step = pick([1, 2, -1, -2]);
    var start = step > 0 ? rand(1, 20 - step * 4) : rand(1 + Math.abs(step) * 4, 20);
    var nums = [];
    for (var i = 0; i < 5; i++) nums.push(start + i * step);
    return pad(
      nums.slice(0, 4).join(" 、 ") + " 、 □　空格是多少？",
      "依規律，空格是多少？",
      '<p class="seq">' + nums.slice(0, 4).map(function (n) { return "<span>" + n + "</span>"; }).join("") + "<span>?</span></p>",
      nums[4],
      "每次" + (step > 0 ? "加 " + step : "減 " + Math.abs(step)) + "，空格是 " + nums[4] + "。"
    );
  }

  function makeOrder() {
    var row = shuffle(COLORS).slice(0, rand(6, 6));
    var visual = '<div class="queue">' + row.map(function (c, i) {
      return '<span class="kid ' + c.id + '"></span>';
    }).join("") + "</div>";
    var roll = rand(1, 3);
    if (roll === 1) {
      var at = rand(0, row.length - 1);
      return choice(
        "由左至右，第 " + (at + 1) + " 個是什麼顏色？",
        "第 " + (at + 1) + " 個是什麼顏色？",
        visual,
        row.map(function (c) { return { label: c.name }; }),
        row[at].name,
        "第 " + (at + 1) + " 個是" + row[at].name + "。"
      );
    }
    if (roll === 2) {
      var who = rand(1, row.length - 1);
      return pad(
        row[who].name + "前面有多少個？",
        row[who].name + "前面有多少個？",
        visual,
        who,
        row[who].name + "排第 " + (who + 1) + "，前面有 " + who + " 個。"
      );
    }
    return choice(
      "誰排第 1？",
      "誰排第 1？",
      visual,
      row.slice(0, 4).map(function (c) { return { label: c.name }; }),
      row[0].name,
      "最左的是第 1，是" + row[0].name + "。"
    );
  }

  function bondParts(maxWhole) {
    var whole = rand(2, maxWhole || 18);
    var a = rand(1, whole - 1);
    return { whole: whole, a: a, b: whole - a };
  }

  function makeBond() {
    var p = bondParts(18);
    var roll = rand(1, 6);
    if (roll === 1) {
      return pad(p.a + " 和 □ 合成為 " + p.whole + "。", p.a + " 和幾多合成為 " + p.whole + "？", "", p.b, p.a + " 和 " + p.b + " 合成為 " + p.whole + "。");
    }
    if (roll === 2) {
      return pad(p.whole + " 分解為 " + p.a + " 和 □。", p.whole + " 分解為 " + p.a + " 和幾多？", "", p.b, p.whole + " 分解為 " + p.a + " 和 " + p.b + "。");
    }
    if (roll === 3) {
      return pad(p.a + " + □ = " + p.whole, p.a + " 加幾多等於 " + p.whole + "？", "", p.b, p.a + " 加 " + p.b + " 等於 " + p.whole + "。");
    }
    if (roll === 4) {
      return pad(p.whole + " − " + p.a + " = □", p.whole + " 減 " + p.a + " 等於幾多？", "", p.b, p.whole + " 減 " + p.a + " 等於 " + p.b + "。");
    }
    if (roll === 5) {
      var x = rand(1, p.whole - 1);
      return pad(p.whole + " − □ = " + (p.whole - x), p.whole + " 減幾多等於 " + (p.whole - x) + "？", "", x, p.whole + " 減 " + x + " 等於 " + (p.whole - x) + "。");
    }
    var have = rand(1, p.whole - 1);
    return pad(
      "想要 " + p.whole + " 個，現在有 " + have + " 個。還欠多少？",
      "還欠多少個？",
      looseDots(have, "teal"),
      p.whole - have,
      "還欠 " + (p.whole - have) + " 個，因為 " + have + " 加 " + (p.whole - have) + " 是 " + p.whole + "。"
    );
  }

  function makeBondChoice() {
    var p = bondParts(18);
    var wrongA = p.a === p.whole - 1 ? 1 : p.a + 1;
    if (wrongA === p.b) wrongA = p.b === 1 ? 2 : p.b - 1;
    var labels = shuffle([String(p.b), String(wrongA), String(Math.min(18, p.b + 2)), "1"].filter(function (v, i, arr) {
      return arr.indexOf(v) === i;
    })).slice(0, 4);
    if (labels.indexOf(String(p.b)) < 0) labels[0] = String(p.b);
    return choice(
      p.a + " 和以下哪個數合成為 " + p.whole + "？",
      p.a + " 和哪個數合成為 " + p.whole + "？",
      "",
      labels.map(function (label) { return { label: label }; }),
      String(p.b),
      p.a + " 和 " + p.b + " 合成為 " + p.whole + "。"
    );
  }

  function makeSameSum() {
    var whole = rand(6, 16);
    var goods = [];
    var guard = 0;
    while (goods.length < 3 && guard < 30) {
      var a = rand(1, whole - 1);
      var text = a + " + " + (whole - a);
      var flip = (whole - a) + " + " + a;
      if (goods.indexOf(text) < 0 && goods.indexOf(flip) < 0) goods.push(text);
      guard++;
    }
    if (goods.length < 3) return null;
    var other = whole === 16 ? whole - 1 : whole + 1;
    var bad = "";
    for (var i = 0; i < 12 && !bad; i++) {
      var badA = rand(1, other - 1);
      var textBad = badA + " + " + (other - badA);
      if (goods.indexOf(textBad) < 0) bad = textBad;
    }
    if (!bad) return null;
    return choice(
      "哪一項的結果與其他的不相同？",
      "哪一項的結果不同？",
      "",
      goods.concat([bad]).map(function (label) { return { label: label }; }),
      bad,
      "其他各項都是 " + whole + "。" + bad + " 是 " + other + "。"
    );
  }

  function makeTrueBond() {
    var p = bondParts(13);
    var truth = p.a + " 和 " + p.b + " 合成為 " + p.whole + "。";
    var pool = [
      p.a + " 和 " + p.b + " 合成為 " + (p.whole + 1) + "。",
      p.whole + " 分解為 " + p.a + " 和 " + (p.b + 1) + "。",
      p.whole + " 分解為 1 和 " + p.whole + "。",
      (p.a + 1) + " 和 " + p.b + " 合成為 " + p.whole + "。"
    ];
    var lies = [];
    pool.forEach(function (line) {
      if (line !== truth && lies.indexOf(line) < 0) lies.push(line);
    });
    if (lies.length < 3) return null;
    return choice(
      "以下哪項是正確的？",
      "哪一句是正確的？",
      "",
      [truth].concat(lies.slice(0, 3)).map(function (label) { return { label: label }; }),
      truth,
      truth
    );
  }

  function makeShapeName() {
    var key = pick(SHAPE_KEYS);
    var shape = SHAPE[key];
    var options = SHAPE_KEYS.map(function (k) { return { label: SHAPE[k].name }; });
    return choice(
      "這是哪一種立體圖形？",
      "這是哪一種立體圖形？",
      '<div class="solo">' + fig(key) + "</div>",
      options,
      shape.name,
      "這是" + shape.name + "。" + propLine(shape) + "。"
    );
  }

  function makeShapeProp() {
    var key = pick(SHAPE_KEYS);
    var shape = SHAPE[key];
    var answer = propLine(shape);
    var all = ["會滾，疊得穩", "會滾，疊不穩", "不會滾，疊得穩", "不會滾，疊不穩"];
    return choice(
      "這個圖形可以怎樣？",
      "這個圖形會滾嗎？疊得穩嗎？",
      '<div class="solo">' + fig(key) + "</div>",
      all.map(function (label) { return { label: label }; }),
      answer,
      shape.name + answer + "。"
    );
  }

  function makeBoth() {
    return choice(
      "哪一種又疊得穩，又滾得動？",
      "哪一種又疊得穩，又滾得動？",
      '<div class="fig-row">' + ["cyl", "ball", "prism", "cone"].map(fig).join("") + "</div>",
      [{ label: "圓柱" }, { label: "球" }, { label: "角柱" }, { label: "圓錐" }],
      "圓柱",
      "圓柱有平面，所以疊得穩；有圓面，所以滾得動。"
    );
  }

  function makeOddShape() {
    var same = pick(["prism", "pyra", "cyl"]);
    var different = pick(SHAPE_KEYS.filter(function (k) { return k !== same; }));
    var keys = shuffle([same, same, same, different]);
    var answer = "";
    var cards = keys.map(function (key, i) {
      var letter = letters(4)[i];
      if (key === different) answer = SHAPE[key].name;
      return '<div class="fig-card"><b>' + letter + "</b>" + fig(key) + "</div>";
    }).join("");
    var names = keys.map(function (key) { return SHAPE[key].name; });
    var unique = [];
    names.forEach(function (name) {
      if (unique.indexOf(name) < 0) unique.push(name);
    });
    return choice(
      "哪一個與其他的不同類？",
      "哪一個圖形不同類？",
      '<div class="fig-grid">' + cards + "</div>",
      unique.map(function (label) { return { label: label }; }),
      answer,
      "不同類的是" + answer + "。"
    );
  }

  function makeObject() {
    var items = [
      { word: "皮球", shape: "球" },
      { word: "罐頭", shape: "圓柱" },
      { word: "派對帽", shape: "圓錐" },
      { word: "鞋盒", shape: "角柱" },
      { word: "雪糕筒", shape: "圓錐" },
      { word: "課本", shape: "角柱" },
      { word: "兩盒果汁疊起", shape: "角柱" }
    ];
    var item = pick(items);
    return choice(
      "「" + item.word + "」比較像哪一種立體圖形？",
      item.word + "像哪一種立體圖形？",
      "",
      SHAPE_KEYS.map(function (k) { return { label: SHAPE[k].name }; }),
      item.shape,
      item.word + "比較像" + item.shape + "。"
    );
  }

  var MAKERS = {
    count: [makeCount, makeCircle],
    circle: [makeCircle],
    compare: [makeCompare],
    sequence: [makeSequence, makeDirection, makeSort],
    oddeven: [makeOddEven, makeOddList, makePlusOne, makeFair],
    pattern: [makePattern],
    order: [makeOrder],
    bond: [makeBond, makeBondChoice, makeSameSum, makeTrueBond],
    shape: [makeShapeName, makeShapeProp, makeBoth, makeOddShape, makeObject]
  };

  var GROUPS = {
    count: ["count"],
    circle: ["circle"],
    compare: ["compare"],
    sequence: ["sequence"],
    oddeven: ["oddeven"],
    pattern: ["pattern"],
    order: ["order"],
    bond: ["bond"],
    shape: ["shape"],
    unit1: ["count", "compare", "sequence", "oddeven", "pattern", "order"],
    seqodd: ["sequence", "oddeven"],
    patorder: ["pattern", "order"],
    mix: ["count", "compare", "sequence", "oddeven", "pattern", "order", "bond", "shape"]
  };

  function makeOne(groupId) {
    var families = GROUPS[groupId] || GROUPS.mix;
    var family = pick(families);
    return pick(MAKERS[family])();
  }

  function makeRound(groupId) {
    var out = [];
    var guard = 0;
    while (out.length < 5 && guard < 40) {
      var q = makeOne(groupId);
      var ok = q && q.prompt && q.because;
      if (ok && q.kind === "choice") ok = q.answer && q.options.some(function (o) { return o.id === q.answer; });
      if (ok && q.kind === "multi") ok = q.answers && q.answers.length > 0;
      if (ok && q.kind === "pad") ok = /^\d+$/.test(q.answer);
      if (ok && q.kind === "circle") ok = q.target > 0 && q.target < q.total;
      if (ok) out.push(q);
      guard++;
    }
    return out;
  }

  function selfTest() {
    var problems = [];
    Object.keys(GROUPS).forEach(function (id) {
      for (var r = 0; r < 40; r++) {
        var round = makeRound(id);
        if (round.length !== 5) problems.push(id + " length " + round.length);
        round.forEach(function (q) {
          if (q.kind === "choice") {
            var labels = q.options.map(function (o) { return o.label; });
            if (new Set(labels).size !== labels.length) problems.push(id + " dup " + labels.join("|"));
          }
        });
      }
    });
    return problems;
  }

  var games = [
    { id: "count", title: "數一數", text: "十格、由 5 或 10 再數" },
    { id: "circle", title: "圈剛剛好", text: "多圈或少圈都不算對" },
    { id: "compare", title: "比較多少", text: "較多、較少、較大、較小" },
    { id: "sequence", title: "順數倒數", text: "填空、分辨、由小到大" },
    { id: "oddeven", title: "奇數偶數", text: "單雙、多 1、分成兩份" },
    { id: "pattern", title: "依規律", text: "顏色和數的規律" },
    { id: "order", title: "排第幾", text: "第 1、前面有幾個" },
    { id: "bond", title: "合成分解", text: "2 至 18、加和減" },
    { id: "shape", title: "立體圖形", text: "五種圖形、疊和滾" },
    { id: "mix", title: "混合 5 題", text: "三個單元都有" }
  ];

  root.MATHS = {
    games: games,
    groups: GROUPS,
    makeRound: makeRound,
    selfTest: selfTest,
    fig: fig
  };
})(typeof window !== "undefined" ? window : globalThis);
