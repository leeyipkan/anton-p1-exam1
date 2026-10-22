/* Study scope for Anton P1 Chinese. Original practice, not textbook pages. */
(function () {
  var lessons = [
    {
      id: "l1",
      num: "第一課",
      title: "開學了",
      note: "",
      words: [
        { word: "我", example: "我是小學生。" },
        { word: "真", example: "上學真快樂。" },
        { word: "上學", example: "我背着書包上學去。" },
        { word: "書包", example: "我有新書包。" },
        { word: "老師", example: "老師早！" },
        { word: "同學", example: "同學好！", note: "詞語表這個詞有剔，當已經看過，快讀即可。" },
        { word: "背着", example: "我自己背着書包。" },
        { word: "快樂", example: "我真快樂。" },
        { word: "學校", example: "學校裏有老師、同學。" },
        { word: "小學生", example: "我是小學生。" }
      ]
    },
    {
      id: "l2",
      num: "第二課",
      title: "我讀一年級了",
      note: "圈出的重點：早、好、說、每天、長大。",
      words: [
        { word: "早", example: "老師早！", focus: true },
        { word: "好", example: "同學好！", focus: true },
        { word: "看", example: "我看鐘。" },
        { word: "說", example: "我說：「老師早！」", focus: true },
        { word: "年級", example: "我讀一年級。" },
        { word: "學會", example: "我學會自己起床。" },
        { word: "每天", example: "我每天上學。", focus: true },
        { word: "長大", example: "我長大了。", focus: true },
        { word: "已經", example: "我已經是小學生。" },
        { word: "自己", example: "我自己起床。" },
        { word: "起床", example: "我每天自己起床。" }
      ]
    },
    {
      id: "l4",
      num: "第四課",
      title: "小羊數數",
      note: "圈出的重點：隻、你、小羊、一起、數來數去。",
      words: [
        { word: "隻", example: "一隻小羊。", focus: true },
        { word: "你", example: "你來數一數。", focus: true },
        { word: "小羊", example: "小羊在看書。", focus: true },
        { word: "一起", example: "我們一起數。", focus: true },
        { word: "全都", example: "小羊全都來了。" },
        { word: "忘了", example: "今天我忘了帶作業。" },
        { word: "數來數去", example: "羊妹妹數來數去。", focus: true }
      ]
    },
    {
      id: "l5",
      num: "第五課",
      title: "郊外好風光",
      altTitle: "郊外風光好",
      note: "詞語表題為《郊外好風光》，工作紙題為《郊外風光好》。兩個名稱都保留。旁邊手寫「狗」，並圈為重點。",
      words: [
        { word: "吹", example: "風兒吹。", focus: true },
        { word: "搖", example: "花兒搖。" },
        { word: "草", example: "小牛在吃草。", focus: true },
        { word: "鳥", example: "小鳥飛。", focus: true },
        { word: "魚", example: "魚兒游。", focus: true },
        { word: "追", example: "狗兒追小羊。" },
        { word: "飛", example: "小鳥飛。" },
        { word: "游", example: "魚兒游。" },
        { word: "小牛", example: "小牛在吃草。", focus: true },
        { word: "郊外", example: "我們去郊外。" },
        { word: "風光", example: "郊外風光好。", focus: true },
        { word: "花兒", example: "風兒吹，花兒搖。", focus: true },
        { word: "狗", example: "狗兒追小羊。", focus: true, note: "工作紙旁邊手寫，圈為重點。" }
      ]
    },
    {
      id: "l6",
      num: "第六課",
      title: "天空要改名",
      note: "這一課不在詞語表。工作紙有這一頁，而且未填，所以納入溫習。",
      words: [
        { word: "日", example: "天上有日。" },
        { word: "月", example: "天上有月，還有星。" },
        { word: "雲", example: "天上有白雲。" },
        { word: "雨", example: "下雨了，我們回家去。" },
        { word: "要", example: "今天我要上體育課。" },
        { word: "星", example: "天上有月，還有星。" }
      ]
    },
    {
      id: "l8",
      num: "第八課",
      title: "中秋賞月",
      note: "圈出的重點：又、晚上、圓、好看、明亮、掛了。紙上編號 1 月亮、2 公園、3 樹上，是紙上記號，不是課文次序。",
      words: [
        { word: "又", example: "月亮又圓又大。", focus: true },
        { word: "大", example: "月亮又圓又大。" },
        { word: "圓", example: "圓圓的月亮。", focus: true },
        { word: "月亮", example: "天上有月亮。", focus: true, note: "紙上記號 1，不是課文次序。" },
        { word: "明亮", example: "月亮好明亮。", focus: true },
        { word: "天上", example: "月亮在天上。" },
        { word: "晚上", example: "晚上我們賞月。", focus: true },
        { word: "好看", example: "月亮真好看。", focus: true },
        { word: "中秋節", example: "中秋節到了。" },
        { word: "公園", example: "我們到公園賞月。", focus: true, note: "紙上記號 2，不是課文次序。" },
        { word: "樹上", example: "燈籠掛在樹上。", focus: true, note: "紙上記號 3，不是課文次序。" },
        { word: "掛了", example: "樹上掛了燈籠。", focus: true }
      ]
    }
  ];

  var questions = {
    "d1-janitor": {
      type: "choice",
      prompt: "拿着掃把掃地的人，應該叫什麼？",
      options: [
        { letter: "A", text: "校長" },
        { letter: "B", text: "校工" },
        { letter: "C", text: "老師" },
        { letter: "D", text: "同學" }
      ],
      answer: "B",
      model: "校工在掃地。"
    },
    "d1-teacher": {
      type: "choice",
      prompt: "站在黑板前，黑板上寫着「開學了」。這個人是？",
      options: [
        { letter: "A", text: "老師" },
        { letter: "B", text: "校工" },
        { letter: "C", text: "同學" },
        { letter: "D", text: "小羊" }
      ],
      answer: "A",
      model: "老師在上課。開學了。"
    },
    "d1-classmates": {
      type: "choice",
      prompt: "很多小朋友在一起。他們是？",
      options: [
        { letter: "A", text: "老師" },
        { letter: "B", text: "校工" },
        { letter: "C", text: "同學" },
        { letter: "D", text: "小羊" }
      ],
      answer: "C",
      model: "他們是同學。"
    },
    "d1-am": {
      type: "choice",
      prompt: "選詞填空：我____小學生。",
      options: [
        { letter: "A", text: "有" },
        { letter: "B", text: "是" },
        { letter: "C", text: "在" },
        { letter: "D", text: "去" }
      ],
      answer: "B",
      model: "我是小學生。"
    },
    "d1-listen-bag": {
      type: "listen",
      prompt: "聽一聽，點你聽到的詞。",
      speak: "書包",
      options: ["書包", "學校", "同學", "老師"],
      answer: "書包",
      model: "我有新書包。"
    },
    "d1-has": {
      type: "choice",
      prompt: "學校裏有什麼？",
      options: [
        { letter: "A", text: "小羊和月亮" },
        { letter: "B", text: "禮堂、老師、同學" },
        { letter: "C", text: "小牛和魚" },
        { letter: "D", text: "月餅和燈籠" }
      ],
      answer: "B",
      model: "學校裏有禮堂、老師、同學。"
    },
    "d2-order": {
      type: "choice",
      prompt: "早晨出門，哪一個次序對？",
      options: [
        { letter: "A", text: "同學好，看鐘，老師早" },
        { letter: "B", text: "看鐘，背書包上學，老師早，同學好" },
        { letter: "C", text: "老師早，看鐘，背書包上學" },
        { letter: "D", text: "背書包上學，看鐘，同學好" }
      ],
      answer: "B",
      model: "看鐘，背書包上學，老師早，同學好。"
    },
    "d2-greet": {
      type: "choice",
      prompt: "哪一句是向老師問早？",
      options: [
        { letter: "A", text: "同學好！" },
        { letter: "B", text: "老師早！" },
        { letter: "C", text: "小羊早！" },
        { letter: "D", text: "月亮好！" }
      ],
      answer: "B",
      model: "老師早！"
    },
    "d2-listen-wake": {
      type: "listen",
      prompt: "聽一聽，點你聽到的詞。",
      speak: "起床",
      options: ["起床", "每天", "長大", "早"],
      answer: "起床",
      model: "我每天自己起床。"
    },
    "d2-carry": {
      type: "choice",
      prompt: "選詞填空：我自己____書包上學去。",
      options: [
        { letter: "A", text: "背着" },
        { letter: "B", text: "掛了" },
        { letter: "C", text: "忘了" },
        { letter: "D", text: "數來數去" }
      ],
      answer: "A",
      model: "我自己背着書包上學去。"
    },
    "d2-everyday": {
      type: "choice",
      prompt: "選詞填空：我____自己起床。",
      options: [
        { letter: "A", text: "全都" },
        { letter: "B", text: "一起" },
        { letter: "C", text: "每天" },
        { letter: "D", text: "忘了" }
      ],
      answer: "C",
      model: "我每天自己起床。"
    },
    "m-book": {
      type: "measure",
      prompt: "選量詞：四____圖書。",
      options: ["本", "朵", "個", "隻"],
      answer: "本",
      model: "四本圖書。"
    },
    "m-flower": {
      type: "measure",
      prompt: "選量詞：五____花。",
      options: ["本", "朵", "個", "隻"],
      answer: "朵",
      model: "五朵花。",
      note: "花的量詞是朵。"
    },
    "m-apple": {
      type: "measure",
      prompt: "選量詞：六____蘋果。",
      options: ["本", "朵", "個", "隻"],
      answer: "個",
      model: "六個蘋果。"
    },
    "m-sheep": {
      type: "measure",
      prompt: "選量詞：一____小羊。",
      options: ["本", "朵", "個", "隻"],
      answer: "隻",
      model: "一隻小羊。"
    },
    "d3-read": {
      type: "choice",
      prompt: "小羊在做什麼？",
      options: [
        { letter: "A", text: "在吃草" },
        { letter: "B", text: "在看書" },
        { letter: "C", text: "在游泳" },
        { letter: "D", text: "在賞月" }
      ],
      answer: "B",
      model: "小羊在看書。"
    },
    "d3-listen-count": {
      type: "listen",
      prompt: "聽一聽，點你聽到的詞。",
      speak: "數來數去",
      options: ["數來數去", "小羊", "一起", "忘了"],
      answer: "數來數去",
      model: "羊妹妹數來數去。"
    },
    "p-wind": {
      type: "punct",
      prompt: "這句標點用得對嗎？",
      sentence: "風兒吹。",
      options: ["對", "不對"],
      answer: "對",
      fixedOrder: true,
      model: "風兒吹。"
    },
    "d4-dog": {
      type: "choice",
      prompt: "選詞完成短句：狗兒追____。",
      options: [
        { letter: "A", text: "小牛" },
        { letter: "B", text: "花兒" },
        { letter: "C", text: "小羊" },
        { letter: "D", text: "月亮" }
      ],
      answer: "C",
      model: "狗兒追小羊。",
      note: "先寫短句，句號放在句尾。"
    },
    "d4-listen-flower": {
      type: "listen",
      prompt: "聽一聽，點你聽到的詞。",
      speak: "花兒",
      options: ["花兒", "草", "鳥", "魚"],
      answer: "花兒",
      model: "風兒吹，花兒搖。"
    },
    "d4-fish": {
      type: "choice",
      prompt: "魚兒____。",
      options: [
        { letter: "A", text: "飛" },
        { letter: "B", text: "游" },
        { letter: "C", text: "吹" },
        { letter: "D", text: "搖" }
      ],
      answer: "B",
      model: "魚兒游。"
    },
    "d5-cloud": {
      type: "choice",
      prompt: "選詞填空：天上有____。",
      options: [
        { letter: "A", text: "白雲" },
        { letter: "B", text: "書包" },
        { letter: "C", text: "小羊" },
        { letter: "D", text: "作業" }
      ],
      answer: "A",
      model: "天上有白雲。"
    },
    "d5-pe": {
      type: "choice",
      prompt: "選詞填空：今天我要上____課。",
      options: [
        { letter: "A", text: "體育" },
        { letter: "B", text: "賞月" },
        { letter: "C", text: "數數" },
        { letter: "D", text: "放學" }
      ],
      answer: "A",
      model: "今天我要上體育課。"
    },
    "d5-home": {
      type: "choice",
      prompt: "選詞填空：下雨了，我們____去。",
      options: [
        { letter: "A", text: "上學" },
        { letter: "B", text: "回家" },
        { letter: "C", text: "追羊" },
        { letter: "D", text: "賞月" }
      ],
      answer: "B",
      model: "下雨了，我們回家去。"
    },
    "p-sky-bad": {
      type: "punct",
      prompt: "這句標點用得對嗎？",
      sentence: "天上。有黑雲",
      options: ["對", "不對"],
      answer: "不對",
      fixedOrder: true,
      model: "天上有黑雲。",
      note: "句號要放在句尾。"
    },
    "p-love": {
      type: "punct",
      prompt: "這句標點用得對嗎？",
      sentence: "我愛老師和同學。",
      options: ["對", "不對"],
      answer: "對",
      fixedOrder: true,
      model: "我愛老師和同學。"
    },
    "p-cow": {
      type: "punct",
      prompt: "這句標點用得對嗎？",
      sentence: "小牛在草地上唱歌。",
      options: ["對", "不對"],
      answer: "對",
      fixedOrder: true,
      model: "小牛在草地上唱歌。"
    },
    "d6-moon-q": {
      type: "punct",
      prompt: "這句末尾用哪一個？",
      sentence: "你想去公園賞月嗎",
      options: ["？", "。"],
      answer: "？",
      fixedOrder: true,
      model: "你想去公園賞月嗎？"
    },
    "d6-dad-period": {
      type: "punct",
      prompt: "這句末尾用哪一個？",
      sentence: "爸爸坐在草地上看書",
      options: ["。", "？"],
      answer: "。",
      fixedOrder: true,
      model: "爸爸坐在草地上看書。"
    },
    "d6-mooncake-q": {
      type: "punct",
      prompt: "這句末尾用哪一個？",
      sentence: "你愛吃月餅嗎",
      options: ["？", "。"],
      answer: "？",
      fixedOrder: true,
      model: "你愛吃月餅嗎？"
    },
    "d6-youyou": {
      type: "choice",
      prompt: "哪一句用對「又……又……」？",
      options: [
        { letter: "A", text: "月亮又圓又大。" },
        { letter: "B", text: "月亮又書包又上學。" },
        { letter: "C", text: "月亮又小羊又數數。" },
        { letter: "D", text: "月亮又回家又體育。" }
      ],
      answer: "A",
      model: "月亮又圓又大。"
    },
    "d6-logic": {
      type: "choice",
      prompt: "哪一句合邏輯？",
      options: [
        { letter: "A", text: "我在巴士上打球。" },
        { letter: "B", text: "妹妹在學校裏上課。" },
        { letter: "C", text: "小羊在酒樓上課。" },
        { letter: "D", text: "魚兒在書包裏飛。" }
      ],
      answer: "B",
      model: "妹妹在學校裏上課。爸爸在圖書館裏看書。我在公園裏打球。"
    },
    "d6-listen-bright": {
      type: "listen",
      prompt: "聽一聽，點你聽到的詞。",
      speak: "明亮",
      options: ["明亮", "晚上", "月亮", "好看"],
      answer: "明亮",
      model: "妹妹的眼睛又明亮又好看。"
    },
    "rev-listen-zhi": {
      type: "listen",
      prompt: "聽一聽，點你聽到的詞。",
      speak: "隻",
      options: ["隻", "朵", "本", "個"],
      answer: "隻",
      model: "一隻小羊。"
    },
    "mc-1": {
      type: "choice",
      prompt: "姐姐的花店開張那天，我們一家到____祝賀她。",
      options: [
        { letter: "A", text: "她的居所" },
        { letter: "B", text: "餐廳" },
        { letter: "C", text: "百貨公司" },
        { letter: "D", text: "新店" }
      ],
      answer: "D",
      model: "姐姐的花店開張那天，我們一家到新店祝賀她。"
    },
    "mc-2": {
      type: "choice",
      prompt: "暑假的時候，他們兩兄弟都會到____游泳和堆沙。",
      options: [
        { letter: "A", text: "圖書館" },
        { letter: "B", text: "課室" },
        { letter: "C", text: "酒樓" },
        { letter: "D", text: "海灘" }
      ],
      answer: "D",
      model: "暑假的時候，他們兩兄弟都會到海灘游泳和堆沙。"
    },
    "mc-3": {
      type: "choice",
      prompt: "____九十歲大壽那天，叔叔在酒樓替他慶祝生日。",
      options: [
        { letter: "A", text: "爺爺" },
        { letter: "B", text: "妹妹" },
        { letter: "C", text: "小表弟" },
        { letter: "D", text: "奶奶" }
      ],
      answer: "A",
      model: "爺爺九十歲大壽那天，叔叔在酒樓替他慶祝生日。"
    },
    "mc-4": {
      type: "choice",
      prompt: "每天，我都會與媽媽到____買菜。",
      options: [
        { letter: "A", text: "超級市場" },
        { letter: "B", text: "圖書館" },
        { letter: "C", text: "課室" },
        { letter: "D", text: "公園" }
      ],
      answer: "A",
      model: "每天，我都會與媽媽到超級市場買菜。"
    },
    "mc-5": {
      type: "choice",
      prompt: "放假天，姑姑帶堂弟堂妹到西貢郊野公園____。",
      options: [
        { letter: "A", text: "拜祭先人" },
        { letter: "B", text: "玩機動遊戲" },
        { letter: "C", text: "燒烤" },
        { letter: "D", text: "閱讀圖書" }
      ],
      answer: "C",
      model: "放假天，姑姑帶堂弟堂妹到西貢郊野公園燒烤。"
    },
    "mc-6": {
      type: "choice",
      prompt: "聖誕節前幾天，我都忙着到百貨公司選購____。",
      options: [
        { letter: "A", text: "作業" },
        { letter: "B", text: "月餅" },
        { letter: "C", text: "掃把" },
        { letter: "D", text: "聖誕禮物" }
      ],
      answer: "D",
      model: "聖誕節前幾天，我都忙着到百貨公司選購聖誕禮物。"
    },
    "mc-7": {
      type: "choice",
      prompt: "表妹生日當天，舅母帶她到海洋公園____。",
      options: [
        { letter: "A", text: "買菜" },
        { letter: "B", text: "喝早茶" },
        { letter: "C", text: "欣賞動物表演" },
        { letter: "D", text: "耍太極" }
      ],
      answer: "C",
      model: "表妹生日當天，舅母帶她到海洋公園欣賞動物表演。"
    }
  };

  var days = [
    {
      n: 1,
      title: "上學詞語",
      lessonIds: ["l1"],
      blurb: "第一課詞語，我是、我有、……有……，分清校工、老師、同學。",
      parent: "今日溫第一課《開學了》。先逐個詞讀一次。再練三句：我是小學生。我有新書包。學校裏有老師、同學。睇圖要分清：拎掃把掃地嘅係校工，唔係校長；黑板前面嘅係老師；一班小朋友係同學。",
      facts: [
        { title: "校工", text: "拿着掃把掃地的人。不是校長。" },
        { title: "老師", text: "站在黑板前上課的人。" },
        { title: "同學", text: "很多小朋友在一起。" }
      ],
      patterns: [
        "我是小學生。",
        "我有新書包。",
        "圖書館裏有圖書。",
        "書包裏有手冊、課本、文具盒。",
        "學校裏有禮堂、老師、同學。"
      ],
      questionIds: ["d1-janitor", "d1-teacher", "d1-classmates", "d1-am", "d1-listen-bag", "d1-has"],
      task: "請講一句：「我是小學生。」或「我有新書包。」",
      taskSpeak: "我是小學生。"
    },
    {
      n: 2,
      title: "自己起床",
      lessonIds: ["l2"],
      blurb: "第二課重點詞，打招呼，次序：看鐘、背書包上學、老師早、同學好。",
      parent: "今日溫第二課《我讀一年級了》。重點詞係早、好、說、每天、長大。打招呼可以大聲少少：老師早！同學早！老師好！同學好！跟住排次序：看鐘，背書包上學，老師早，同學好。最後請 Anton 自己講：我自己背着書包上學去。",
      patterns: [
        "老師早！",
        "同學早！",
        "老師好！",
        "同學好！",
        "我自己背着書包上學去。",
        "看鐘 → 背書包上學 → 老師早 → 同學好"
      ],
      questionIds: ["d2-order", "d2-greet", "d2-listen-wake", "d2-carry", "d2-everyday"],
      task: "請講：「我自己背着書包上學去。」",
      taskSpeak: "我自己背着書包上學去。"
    },
    {
      n: 3,
      title: "小羊數數",
      lessonIds: ["l4"],
      blurb: "小羊、量詞本朵個隻，再認朵，寫八、羊、隻。",
      parent: "今日溫第四課《小羊數數》。量詞慢慢練：四本圖書、五朵花、六個蘋果。小羊要用隻。五朵之前改過，今日再認一次朵。可以讀：小羊在看書。羊妹妹數錯了。今天我忘了帶作業。寫字寫八、羊，再抄隻。",
      reteach: "五朵花的「朵」之前改過，今日再認一次。",
      patterns: [
        "小羊在看書。",
        "羊妹妹數錯了。",
        "今天我忘了帶作業。",
        "四本圖書。",
        "五朵花。",
        "六個蘋果。"
      ],
      questionIds: ["m-book", "m-flower", "m-apple", "m-sheep", "d3-read", "d3-listen-count"],
      task: "請寫「八」「羊」，再抄「隻」。寫完讀「一隻小羊」。",
      taskSpeak: "一隻小羊。",
      writeChar: "八"
    },
    {
      n: 4,
      title: "郊外風光",
      lessonIds: ["l5"],
      blurb: "郊外短句同句號，記認圖瓜果竹米。",
      parent: "今日溫第五課。詞語表叫《郊外好風光》，工作紙叫《郊外風光好》，兩個名都要見。旁邊手寫嘅狗都係重點。每句只講邊個做咩，而且句號放喺句尾：風兒吹。花兒搖。小鳥飛。小牛在吃草。魚兒游。草兒搖。狗兒追小羊。記認圖配瓜、果、竹、米。同 Anton 講，呢啲係記認圖，唔係真甲骨文。",
      patterns: [
        "風兒吹，花兒搖。",
        "小鳥飛。",
        "小牛在吃草。",
        "魚兒游。",
        "草兒搖。",
        "狗兒追小羊。"
      ],
      questionIds: ["p-wind", "d4-dog", "d4-listen-flower", "d4-fish"],
      board: "b4",
      task: "請講短句：「狗兒追小羊。」記得句號。",
      taskSpeak: "狗兒追小羊。"
    },
    {
      n: 5,
      title: "天空同標點",
      lessonIds: ["l6"],
      blurb: "第六課填空、標點、記認圖田石山水。呢幾頁未做。",
      parent: "第六課《天空要改名》唔喺詞語表，但工作紙有呢一頁，而且未填。標點判斷同田、石、山、水配對都未做。今日補呢三樣。答案可以讀：天上有白雲。今天我要上體育課。下雨了，我們回家去。天上有月，還有星。",
      unfinishedNote: "呢幾頁工作紙未做：第六課填空、標點判斷、田石山水配對。今日就補呢三樣。",
      patterns: [
        "天上有白雲。",
        "今天我要上體育課。",
        "下雨了，我們回家去。",
        "天上有月，還有星。"
      ],
      questionIds: ["d5-cloud", "d5-pe", "d5-home", "p-sky-bad", "p-love", "p-cow"],
      board: "b5",
      task: "請讀：「天上有白雲。」",
      taskSpeak: "天上有白雲。"
    },
    {
      n: 6,
      title: "中秋",
      lessonIds: ["l8"],
      blurb: "中秋，句號同問號，又……又……。",
      parent: "今日溫第八課《中秋賞月》。紙上寫住 1 月亮、2 公園、3 樹上，嗰啲係紙上記號，唔係課文次序。先分句號同問號，再練又……又……。時間不夠的話，讀重點詞，揀兩句標點，再自己講一句又……又……，例如月亮又圓又大。",
      patterns: [
        "你想去公園賞月嗎？",
        "爸爸坐在草地上看書。",
        "哪一個燈籠最大？",
        "你愛吃月餅嗎？",
        "甜甜的葡萄。",
        "圓圓的太陽。",
        "公園裏有好看的花兒。",
        "香蕉又甜又香。",
        "月餅又香又甜。",
        "月亮又圓又大。",
        "妹妹的眼睛又明亮又好看。",
        "妹妹在學校裏上課。",
        "爸爸在圖書館裏看書。",
        "我在公園裏打球。"
      ],
      questionIds: ["d6-moon-q", "d6-dad-period", "d6-mooncake-q", "d6-youyou", "d6-logic", "d6-listen-bright"],
      task: "請講一句「又……又……」，例如：「月亮又圓又大。」",
      taskSpeak: "月亮又圓又大。"
    },
    {
      n: 7,
      title: "四素句",
      lessonIds: [],
      blurb: "四素句分部分、選擇、自己砌一句十二字以上。",
      parent: "今日做四素句。標註卷係 98/100，第一、二部分都穩，未做到嘅係自己造句；放風箏嗰題留空。先分時間素、人物素、地點素、事情素，再做幾條選擇。最後自己砌一句，最少十二個字。可以參考：星期日，我和爸爸到公園放風箏。",
      review: [
        { word: "朵", example: "五朵花。", focus: true },
        { word: "隻", example: "一隻小羊。", focus: true },
        { word: "狗", example: "狗兒追小羊。", focus: true },
        { word: "早", example: "老師早！", focus: true },
        { word: "月亮", example: "月亮又圓又大。" },
        { word: "又", example: "月餅又香又甜。", focus: true }
      ],
      patterns: [
        "中秋節到了，我們一家到海濱公園玩燈籠。",
        "星期日，我和爸爸到公園放風箏。"
      ],
      questionIds: ["mc-1", "m-flower", "p-sky-bad", "rev-listen-zhi", "mc-7"],
      labItemIds: ["p1", "p7"],
      builder: true,
      kite: true,
      task: "請砌一句，最少十二個字。可以參考下面的風箏句。",
      taskSpeak: "星期日，我和爸爸到公園放風箏。"
    }
  ];

  var fourItems = [
    {
      id: "p1",
      tag: "練習 1",
      parts: [
        { role: "時間素", text: "上星期三" },
        { role: "人物素", text: "我們" },
        { role: "地點素", text: "到醫院" },
        { role: "事情素", text: "探望姑母" }
      ]
    },
    {
      id: "p2",
      tag: "練習 2",
      parts: [
        { role: "時間素", text: "這個週末" },
        { role: "人物素", text: "爸爸帶我們" },
        { role: "地點素", text: "到酒樓" },
        { role: "事情素", text: "吃飯" }
      ]
    },
    {
      id: "p3",
      tag: "練習 3",
      parts: [
        { role: "時間素", text: "下星期" },
        { role: "人物素", text: "表哥邀請我們" },
        { role: "地點素", text: "到他的學校" },
        { role: "事情素", text: "出席畢業典禮" }
      ]
    },
    {
      id: "p4",
      tag: "練習 4",
      parts: [
        { role: "時間素", text: "表妹生日那天" },
        { role: "人物素", text: "她和家人" },
        { role: "地點素", text: "去迪士尼樂園" },
        { role: "事情素", text: "玩機動遊戲" }
      ]
    },
    {
      id: "p5",
      tag: "練習 5",
      parts: [
        { role: "時間素", text: "聖誕節那天" },
        { role: "人物素", text: "我們" },
        { role: "地點素", text: "到尖沙咀" },
        { role: "事情素", text: "欣賞燈飾" }
      ]
    },
    {
      id: "p6",
      tag: "練習 6",
      parts: [
        { role: "時間素", text: "星期日" },
        { role: "人物素", text: "我和爸媽" },
        { role: "地點素", text: "到舅舅家" },
        { role: "事情素", text: "吃飯" }
      ]
    },
    {
      id: "p7",
      tag: "寫作練習",
      minChars: 12,
      parts: [
        { role: "時間素", text: "早上" },
        { role: "人物素", text: "我和家人" },
        { role: "地點素", text: "到沙灘" },
        { role: "事情素", text: "玩堆沙" }
      ]
    },
    {
      id: "p8",
      tag: "練習 8",
      parts: [
        { role: "時間素", text: "中午" },
        { role: "人物素", text: "我和弟弟" },
        { role: "地點素", text: "在家中" },
        { role: "事情素", text: "玩積木" }
      ]
    }
  ];

  var example = {
    tag: "例子",
    parts: [
      { role: "時間素", text: "中秋節到了" },
      { role: "人物素", text: "我們一家" },
      { role: "地點素", text: "到海濱公園" },
      { role: "事情素", text: "玩燈籠" }
    ]
  };

  var banks = {
    time: {
      label: "時間素",
      sheet: [
        "在嬸嬸生日的時候",
        "伯父快要退休了",
        "我們一家將要搬新居",
        "爺爺在八十歲大壽那天",
        "新年/聖誕節/佛誕快到了",
        "母親節/父親節當天"
      ],
      chips: [
        "在嬸嬸生日的時候",
        "伯父快要退休了",
        "我們一家將要搬新居",
        "爺爺在八十歲大壽那天",
        "新年快到了",
        "聖誕節快到了",
        "佛誕快到了",
        "母親節當天",
        "父親節當天"
      ],
      easy: ["星期日", "早上", "中午"]
    },
    person: {
      label: "人物素",
      sheet: [
        "外祖父/母",
        "姪兒/姪女/兒甥",
        "叔叔/嬸嬸",
        "姨媽/姨丈/姑姑/姑丈",
        "表哥/表姐/表弟/表妹",
        "堂哥/堂姐/堂弟/堂妹"
      ],
      chips: [
        "外祖父", "外祖母", "姪兒", "姪女", "兒甥", "叔叔", "嬸嬸",
        "姨媽", "姨丈", "姑姑", "姑丈",
        "表哥", "表姐", "表弟", "表妹",
        "堂哥", "堂姐", "堂弟", "堂妹"
      ]
    },
    place: {
      label: "地點素",
      sheet: [
        "麥當勞/大家樂/大快活/美心",
        "海洋公園/濕地公園/冒險樂園",
        "百佳超級市場/惠康超級市場",
        "菜市場",
        "九龍公園",
        "酒樓/酒店/餐廳/快餐店",
        "新達廣場/百貨公司/玩具反斗城/日本城",
        "大埔/沙田/上水/粉嶺",
        "西貢郊野公園/海灘"
      ],
      chips: [
        "麥當勞", "大家樂", "大快活", "美心",
        "海洋公園", "濕地公園", "冒險樂園",
        "百佳超級市場", "惠康超級市場",
        "菜市場", "九龍公園",
        "酒樓", "酒店", "餐廳", "快餐店",
        "新達廣場", "百貨公司", "玩具反斗城", "日本城",
        "大埔", "沙田", "上水", "粉嶺",
        "西貢郊野公園", "海灘"
      ]
    },
    action: {
      label: "事情素",
      sheet: [
        "慶祝",
        "參加宴會/觀禮",
        "耍太極/盪秋千/溜滑梯",
        "喝早茶/吃壽包",
        "吃火鍋/吃自助餐",
        "選購禮物",
        "逛街/看電影",
        "開生日派對/開歡送派對/開聯歡會",
        "觀賞動物/欣賞動物表演"
      ],
      chips: [
        "慶祝", "參加宴會", "觀禮",
        "耍太極", "盪秋千", "溜滑梯",
        "喝早茶", "吃壽包",
        "吃火鍋", "吃自助餐",
        "選購禮物", "逛街", "看電影",
        "開生日派對", "開歡送派對", "開聯歡會",
        "觀賞動物", "欣賞動物表演"
      ]
    }
  };

  var presets = [
    "星期日，我和爸爸到公園放風箏。",
    "早上，我和家人到沙灘玩堆沙。",
    "中秋節到了，我們一家到海濱公園玩燈籠。",
    "父親節當天，姑姑到酒樓喝早茶。"
  ];

  var kite = "星期日，我和爸爸到公園放風箏。";

  var gaps = [
    "四素句標註卷 98/100，第一、二部分穩。未做滿嘅係自己寫一句。放風箏嗰題留空。",
    "第六課填空留空。",
    "標點對錯頁留空。",
    "田、石、山、水配對留空。",
    "五朵改過一次，要再教朵。",
    "狗兒追小羊寫得比較辛苦，多練短句。"
  ];

  var chars = [
    { ch: "八", strokes: ["撇", "捺"], hint: "兩畫：先撇，後捺。" },
    { ch: "羊", strokes: ["點", "點", "撇", "橫", "橫", "竖"], hint: "跟着上面的次序寫。" },
    { ch: "隻", strokes: [], hint: "今日抄寫這個字。工作紙未附筆順，家長跟常用筆順帶，寫完讀「一隻小羊」。" },
    { ch: "我", strokes: ["撇", "橫", "竖鉤", "提", "斜鉤", "撇", "點"], hint: "跟着上面的次序寫。" },
    {
      ch: "草",
      strokes: ["橫（草字頭）", "竖（草字頭）", "竖（草字頭）", "竖（早）", "橫折（早）", "橫（早）", "橫（早）", "竖（早）", "橫（早）"],
      hint: "共九畫。先寫草字頭（橫、竖、竖），再寫早。"
    },
    { ch: "月", strokes: ["撇", "橫折鉤", "橫", "橫"], hint: "跟着上面的次序寫。" },
    { ch: "早", strokes: ["竖", "橫折", "橫", "橫", "竖", "橫"], hint: "跟着上面的次序寫。" },
    { ch: "好", strokes: ["撇點", "撇", "橫", "橫撇", "竖鉤", "橫"], hint: "跟着上面的次序寫。" },
    { ch: "雨", strokes: ["橫", "竖", "橫折鉤", "竖", "點", "點", "點", "點"], hint: "跟着上面的次序寫。" }
  ];

  var glyphs = {
    "瓜": '<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="58" rx="26" ry="30" fill="none" stroke="#1d1a16" stroke-width="4"/><path d="M50 28 C52 16 62 14 68 8" fill="none" stroke="#1d1a16" stroke-width="4"/><path d="M58 20 C70 18 78 28 74 36" fill="none" stroke="#1d1a16" stroke-width="4"/></svg>',
    "果": '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="58" r="24" fill="none" stroke="#1d1a16" stroke-width="4"/><path d="M50 34 V14" fill="none" stroke="#1d1a16" stroke-width="4"/><path d="M50 20 C66 16 72 28 64 34" fill="none" stroke="#1d1a16" stroke-width="4"/></svg>',
    "竹": '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M38 12 V88 M38 40 H28 M38 64 H28" fill="none" stroke="#1d1a16" stroke-width="4"/><path d="M62 18 V88 M62 46 H74 M62 70 H74" fill="none" stroke="#1d1a16" stroke-width="4"/></svg>',
    "米": '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 18 V82 M22 50 H78" fill="none" stroke="#1d1a16" stroke-width="4"/><circle cx="34" cy="34" r="4" fill="#1d1a16"/><circle cx="66" cy="34" r="4" fill="#1d1a16"/><circle cx="34" cy="66" r="4" fill="#1d1a16"/><circle cx="66" cy="66" r="4" fill="#1d1a16"/></svg>',
    "田": '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="18" y="18" width="64" height="64" fill="none" stroke="#1d1a16" stroke-width="4"/><path d="M50 18 V82 M18 50 H82" fill="none" stroke="#1d1a16" stroke-width="4"/></svg>',
    "石": '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 62 L30 38 L48 28 L70 36 L80 58 L68 76 L34 78 Z" fill="none" stroke="#1d1a16" stroke-width="4"/></svg>',
    "山": '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M8 78 L28 40 L40 58 L50 22 L62 58 L74 36 L92 78 Z" fill="none" stroke="#1d1a16" stroke-width="4"/></svg>',
    "水": '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M16 40 C28 28 36 52 48 40" fill="none" stroke="#1d1a16" stroke-width="4"/><path d="M16 58 C28 46 36 70 48 58" fill="none" stroke="#1d1a16" stroke-width="4"/><path d="M52 40 C64 28 72 52 84 40" fill="none" stroke="#1d1a16" stroke-width="4"/><path d="M52 58 C64 46 72 70 84 58" fill="none" stroke="#1d1a16" stroke-width="4"/></svg>'
  };

  var glyphSentences = {
    "瓜": "這是瓜。",
    "果": "這是果。",
    "竹": "這是竹。",
    "米": "這是米。",
    "田": "這是田。",
    "石": "這是石。",
    "山": "這是山。",
    "水": "這是水。"
  };

  window.ANTON_DATA = {
    lessons: lessons,
    questions: questions,
    days: days,
    fourItems: fourItems,
    example: example,
    banks: banks,
    presets: presets,
    kite: kite,
    gaps: gaps,
    chars: chars,
    glyphs: glyphs,
    glyphSentences: glyphSentences,
    boards: {
      b4: ["瓜", "果", "竹", "米"],
      b5: ["田", "石", "山", "水"]
    },
    boardTitles: {
      b4: "瓜、果、竹、米",
      b5: "田、石、山、水"
    },
    practice: {
      choice: [
        "d1-janitor", "d1-teacher", "d1-classmates", "d1-am", "d1-has",
        "d2-order", "d2-greet", "d2-carry", "d2-everyday",
        "d3-read", "d4-dog", "d4-fish",
        "d5-cloud", "d5-pe", "d5-home",
        "d6-youyou", "d6-logic"
      ],
      punct: ["p-wind", "p-sky-bad", "p-love", "p-cow", "d6-moon-q", "d6-dad-period", "d6-mooncake-q"],
      measure: ["m-book", "m-flower", "m-apple", "m-sheep"],
      listen: ["d1-listen-bag", "d2-listen-wake", "d3-listen-count", "d4-listen-flower", "d6-listen-bright", "rev-listen-zhi"]
    },
    mcIds: ["mc-1", "mc-2", "mc-3", "mc-4", "mc-5", "mc-6", "mc-7"],
    games: [
      {
        id: "words",
        title: "捉詞語",
        move: "企起身，雙手舉高，數到 5，再坐低。",
        items: [
          { prompt: "老師____！", options: ["魚", "早", "月", "羊"], answer: "早", say: "老師早！" },
          { prompt: "同學____！", options: ["吹", "雨", "好", "狗"], answer: "好", say: "同學好！" },
          { prompt: "一____小羊。", options: ["朵", "本", "隻", "個"], answer: "隻", say: "一隻小羊。" },
          { prompt: "風兒____。", options: ["游", "吃", "看", "吹"], answer: "吹", say: "風兒吹。" },
          { prompt: "月餅又香又____。", options: ["高", "甜", "冷", "快"], answer: "甜", say: "月餅又香又甜。" }
        ]
      },
      {
        id: "four",
        title: "四素句",
        move: "行去窗邊，再行返座位。",
        items: [
          { prompt: "星期日，我和爸爸到公園放風箏。邊截係時間？", options: ["星期日", "我和爸爸", "到公園", "放風箏"], answer: "星期日", say: "星期日係時間。" },
          { prompt: "星期日，我和爸爸到公園放風箏。邊截係人物？", options: ["星期日", "我和爸爸", "到公園", "放風箏"], answer: "我和爸爸", say: "我和爸爸係人物。" },
          { prompt: "星期日，我和爸爸到公園放風箏。邊截係地點？", options: ["星期日", "我和爸爸", "到公園", "放風箏"], answer: "到公園", say: "到公園係地點。" },
          { prompt: "星期日，我和爸爸到公園放風箏。邊截係事情？", options: ["星期日", "我和爸爸", "到公園", "放風箏"], answer: "放風箏", say: "放風箏係事情。" }
        ]
      },
      {
        id: "quick",
        title: "快問快答",
        move: "原地跳三下，然後坐低。",
        items: [
          { prompt: "五____花。", options: ["本", "個", "朵", "隻"], answer: "朵", say: "五朵花。" },
          { prompt: "四____圖書。", options: ["朵", "本", "個", "隻"], answer: "本", say: "四本圖書。" },
          { prompt: "你愛吃月餅嗎", options: ["。", "？"], answer: "？", say: "你愛吃月餅嗎？" },
          { prompt: "爸爸坐在草地上看書", options: ["。", "？"], answer: "。", say: "爸爸坐在草地上看書。" },
          { prompt: "天上有白____。", options: ["雨", "雲", "星", "海"], answer: "雲", say: "天上有白雲。" }
        ]
      }
    ],
    roles: [
      ["時間素", "A"],
      ["人物素", "B"],
      ["地點素", "C"],
      ["事情素", "D"]
    ]
  };
})();
