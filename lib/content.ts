export type UnitId = 1 | 2 | 4;

export type Word = {
  en: string;
  zh: string;
  emoji: string;
  say: string;
};

export type Pattern = {
  title: string;
  en: string;
  zh: string;
  examples: string[];
};

export type Unit = {
  id: UnitId;
  title: string;
  zh: string;
  story: string;
  words: Word[];
  patterns: Pattern[];
  phonics: { sound: string; words: string[]; zh: string }[];
  writing: string[];
};

export const units: Unit[] = [
  {
    id: 1,
    title: "Getting to know you",
    zh: "認識你",
    story:
      "開學第一日，Jack Poon、Lily Wong 同 Ken Chan 喺課室見面。Jack 七歲，今日生日。Lily 同 Ken 都係六歲。佢哋用 Good morning、Nice to meet you 打招呼，又問名同年紀。Lily 打開飯盒，拿出蛋糕，話 Happy birthday。",
    words: [
      { en: "morning", zh: "早晨", emoji: "🌅", say: "morning" },
      { en: "afternoon", zh: "下午", emoji: "☀️", say: "afternoon" },
      { en: "Good morning", zh: "早晨", emoji: "👋", say: "Good morning" },
      { en: "Good afternoon", zh: "午安", emoji: "😊", say: "Good afternoon" },
      { en: "Hello", zh: "你好", emoji: "🙂", say: "Hello" },
      { en: "Hi", zh: "嗨", emoji: "✋", say: "Hi" },
      { en: "name", zh: "名字", emoji: "🏷️", say: "name" },
      { en: "birthday", zh: "生日", emoji: "🎂", say: "birthday" },
    ],
    patterns: [
      {
        title: "問名",
        en: "What is your name? My name is Lily.",
        zh: "你叫咩名？我叫 Lily。",
        examples: ["My name is Jack Poon.", "My name is Ken Chan."],
      },
      {
        title: "拼名",
        en: "How do you spell your name? L-I-L-Y.",
        zh: "你個名點拼？一個字母一個字母講。",
        examples: ["J-A-C-K", "K-E-N"],
      },
      {
        title: "問年紀",
        en: "How old are you? I am six years old.",
        zh: "你幾多歲？我六歲。",
        examples: ["I am seven years old.", "I am six years old too."],
      },
      {
        title: "打招呼",
        en: "Nice to meet you.",
        zh: "好高興認識你。",
        examples: ["Hi, Lily. Nice to meet you.", "You are welcome."],
      },
    ],
    phonics: [
      { sound: "h", words: ["hi", "hello", "happy"], zh: "h 開頭" },
      { sound: "m", words: ["my", "meet", "morning"], zh: "m 開頭" },
      { sound: "y", words: ["you", "your", "year"], zh: "y 開頭" },
    ],
    writing: [
      "生日卡有三部分：Dear（收卡嘅人）、Happy birthday!（問候）、From（寫卡嘅人）。",
      "亦可以寫 Love 或者 Best wishes。",
      "人名第一個字母用大階。",
    ],
  },
  {
    id: 2,
    title: "People at my school",
    zh: "我學校嘅人",
    story:
      "Kate Wood 六歲，來自美國，而家同爸爸媽媽住喺中國。Mr Brown 係英文老師，來自英國，好好人。Wendy Tam 係佢最好嘅同學，同班 Class 1A。Ted Wong 係 Group 1 組長。Sue Clark 係女班長 monitress。",
    words: [
      { en: "classmate", zh: "同學", emoji: "🧒", say: "classmate" },
      { en: "group leader", zh: "組長", emoji: "⭐", say: "group leader" },
      { en: "monitor", zh: "男班長", emoji: "👦", say: "monitor" },
      { en: "monitress", zh: "女班長", emoji: "👧", say: "monitress" },
      { en: "class teacher", zh: "班主任", emoji: "👩‍🏫", say: "class teacher" },
      { en: "Chinese teacher", zh: "中文老師", emoji: "🧧", say: "Chinese teacher" },
      { en: "English teacher", zh: "英文老師", emoji: "📘", say: "English teacher" },
      { en: "Maths teacher", zh: "數學老師", emoji: "➗", say: "Maths teacher" },
    ],
    patterns: [
      {
        title: "介紹一個人",
        en: "This is Wendy. She is my classmate.",
        zh: "呢個係 Wendy。佢係我同學。",
        examples: ["This is Ted. He is our group leader.", "This is Mr Brown. He is our English teacher."],
      },
      {
        title: "我哋喺邊班",
        en: "We are in Class 1A.",
        zh: "我哋喺 1A 班。",
        examples: ["We are in Group 1.", "We are in Class 1A."],
      },
      {
        title: "我／我哋",
        en: "I → my, we → our",
        zh: "自己用 my，一齊用 our。",
        examples: ["She is my best friend.", "He is our English teacher."],
      },
      {
        title: "Mr / Mrs / Miss",
        en: "Mr Hill, Mrs Hill, Miss Ma",
        zh: "男士用 Mr。已婚女士用 Mrs。未婚女士用 Miss。",
        examples: ["This is Miss Ma.", "This is Mr Hill.", "This is Mrs Hill."],
      },
    ],
    phonics: [
      { sound: "b", words: ["boy", "big", "bad"], zh: "b 開頭" },
      { sound: "g", words: ["girl", "good", "get"], zh: "g 開頭" },
      { sound: "t", words: ["teacher", "tell", "ten"], zh: "t 開頭" },
    ],
    writing: [
      "句頭用大階。",
      "I 永遠大階。",
      "人名第一個字母大階。",
      "句尾加句號 .",
      "範例：My name is Judy Lee. I am in Class 1B. I am six years old.",
    ],
  },
  {
    id: 4,
    title: "In my school bag",
    zh: "我個書包",
    story:
      "Super Boy 晴朗朝早返學。佢有擦膠同書包，救咗一隻貓同一個小朋友。一位婆婆唔舒服，Super Boy 有八枝鉛筆、兩枝水樽，俾咗一枝水俾婆婆。婆婆話 Thank you，佢答 No problem。",
    words: [
      { en: "school bag", zh: "書包", emoji: "🎒", say: "school bag" },
      { en: "book", zh: "書", emoji: "📗", say: "book" },
      { en: "pencil case", zh: "筆盒", emoji: "🖊️", say: "pencil case" },
      { en: "lunch box", zh: "飯盒", emoji: "🍱", say: "lunch box" },
      { en: "water bottle", zh: "水樽", emoji: "🥤", say: "water bottle" },
      { en: "pen", zh: "原子筆", emoji: "✒️", say: "pen" },
      { en: "pencil", zh: "鉛筆", emoji: "✏️", say: "pencil" },
      { en: "eraser", zh: "擦膠", emoji: "🧽", say: "eraser" },
      { en: "ruler", zh: "間尺", emoji: "📏", say: "ruler" },
      { en: "crayon", zh: "蠟筆", emoji: "🖍️", say: "crayon" },
    ],
    patterns: [
      {
        title: "我有／佢有",
        en: "I have a pen. He has an eraser. She has three pencils.",
        zh: "我用 have。佢（男或女）用 has。多過一件要加 s。",
        examples: ["I have eight pencils.", "I have two water bottles.", "He has a school bag."],
      },
      {
        title: "a 同 an",
        en: "a book, an eraser",
        zh: "元音音開頭（a e i o u）用 an。",
        examples: ["an apple", "an ice cream", "an orange", "an umbrella", "a ruler"],
      },
      {
        title: "數字 1–10",
        en: "one, two, three, four, five, six, seven, eight, nine, ten",
        zh: "一件可以講 a 或者 one。",
        examples: ["I have one pen.", "She has one eraser.", "He has three erasers."],
      },
    ],
    phonics: [
      { sound: "p", words: ["pencil", "pig", "point"], zh: "p 開頭" },
      { sound: "k", words: ["kite", "book", "look"], zh: "k 音" },
      { sound: "-en", words: ["pen", "ten", "hen"], zh: "en 韻尾" },
    ],
    writing: [
      "名字前面加逗號：You are great, Super Boy.",
      "大叫用感嘆號：Help! Wow! Oh no!",
      "問句用問號：What is your name?",
    ],
  },
];

export const numbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
] as const;

export const rhyme = [
  "One, two, take out your glue.",
  "Three, four, touch the floor.",
  "Five, six, write some ticks.",
  "Seven, eight, sit up straight.",
  "Nine, ten, put down your pen.",
];

export type Skill =
  | "greetings"
  | "people"
  | "bag"
  | "phonics"
  | "marks";

export type Question = {
  id: string;
  unit: UnitId;
  skill: Skill;
  prompt: string;
  hint: string;
  speak?: string;
  choices: string[];
  answer: string;
  explain: string;
};

export const questions: Question[] = [
  {
    id: "g1",
    unit: 1,
    skill: "greetings",
    prompt: "How old are you?",
    hint: "人哋問你幾多歲。",
    speak: "How old are you?",
    choices: ["I am six years old.", "My name is Ken.", "Good afternoon."],
    answer: "I am six years old.",
    explain: "問年紀，答 I am ... years old.",
  },
  {
    id: "g2",
    unit: 1,
    skill: "greetings",
    prompt: "What is your name?",
    hint: "人哋問你叫咩名。",
    speak: "What is your name?",
    choices: ["My name is Lily.", "I am seven years old.", "You are welcome."],
    answer: "My name is Lily.",
    explain: "問名，答 My name is ...",
  },
  {
    id: "g3",
    unit: 1,
    skill: "greetings",
    prompt: "It is 8 o'clock in the morning. What do you say?",
    hint: "朝早見面講咩？",
    speak: "It is eight o'clock in the morning.",
    choices: ["Good morning.", "Good afternoon.", "Happy birthday!"],
    answer: "Good morning.",
    explain: "朝早用 Good morning。下晝先用 Good afternoon。",
  },
  {
    id: "g4",
    unit: 1,
    skill: "greetings",
    prompt: "It is 2 o'clock in the afternoon. What do you say?",
    hint: "下晝見面講咩？",
    choices: ["Good afternoon.", "Good morning.", "Nice to meet you."],
    answer: "Good afternoon.",
    explain: "下晝用 Good afternoon。",
  },
  {
    id: "g5",
    unit: 1,
    skill: "greetings",
    prompt: "A new friend says: Nice to meet you.",
    hint: "第一次見面，你可以點答？",
    speak: "Nice to meet you.",
    choices: ["Nice to meet you too.", "I have a pen.", "I am six years old."],
    answer: "Nice to meet you too.",
    explain: "人哋話 Nice to meet you，你可以答 Nice to meet you too。",
  },
  {
    id: "g6",
    unit: 1,
    skill: "greetings",
    prompt: "How do you spell the name Lily?",
    hint: "一個字母一個字母。",
    choices: ["L-I-L-Y", "L-Y-L-I", "L-I-L-I"],
    answer: "L-I-L-Y",
    explain: "Lily 係 L-I-L-Y。",
  },
  {
    id: "g7",
    unit: 1,
    skill: "greetings",
    prompt: "Jack is seven. Ken is six. Who is older?",
    hint: "邊個大啲？",
    choices: ["Jack", "Ken", "They are the same."],
    answer: "Jack",
    explain: "seven 大過 six，所以 Jack 大啲。",
  },
  {
    id: "g8",
    unit: 1,
    skill: "greetings",
    prompt: "Which card is correct?",
    hint: "生日卡：Dear、問候、From，人名要大階。",
    choices: [
      "Dear Lily, Happy birthday! From Ken",
      "dear lily happy birthday from ken",
      "From Lily, Dear birthday",
    ],
    answer: "Dear Lily, Happy birthday! From Ken",
    explain: "Dear 後面係收卡嘅人，From 後面係寫卡嘅人，名要大階。",
  },
  {
    id: "p1",
    unit: 2,
    skill: "people",
    prompt: "This is Wendy. ___ is my classmate.",
    hint: "Wendy 係女仔。",
    choices: ["She", "He", "We"],
    answer: "She",
    explain: "女仔用 She。男仔用 He。一齊用 We。",
  },
  {
    id: "p2",
    unit: 2,
    skill: "people",
    prompt: "This is Ted. ___ is our group leader.",
    hint: "Ted 係男仔。",
    choices: ["He", "She", "I"],
    answer: "He",
    explain: "男仔用 He is ...",
  },
  {
    id: "p3",
    unit: 2,
    skill: "people",
    prompt: "Kate and Wendy are together. ___ are in Class 1A.",
    hint: "兩個人一齊。",
    choices: ["We", "He", "She"],
    answer: "We",
    explain: "一齊講 We are ...",
  },
  {
    id: "p4",
    unit: 2,
    skill: "people",
    prompt: "Kate talks about her own friend: She is ___ best friend.",
    hint: "自己嘅朋友用邊個字？",
    choices: ["my", "our", "we"],
    answer: "my",
    explain: "自己嘅朋友用 my。全班嘅老師先用 our：He is our English teacher.",
  },
  {
    id: "p5",
    unit: 2,
    skill: "people",
    prompt: "Sue helps the teacher. Sue is a girl. She is the ___.",
    hint: "女班長叫咩？",
    choices: ["monitress", "monitor", "Maths teacher"],
    answer: "monitress",
    explain: "女班長係 monitress。男班長係 monitor。",
  },
  {
    id: "p6",
    unit: 2,
    skill: "people",
    prompt: "The English teacher is a man. We call him ___.",
    hint: "男士點稱呼？",
    choices: ["Mr Brown", "Mrs Brown", "Miss Brown"],
    answer: "Mr Brown",
    explain: "男士用 Mr。已婚女士用 Mrs。未婚女士用 Miss。",
  },
  {
    id: "p7",
    unit: 2,
    skill: "people",
    prompt: "Which sentence is correct?",
    hint: "睇大階同句號。",
    choices: [
      "My name is Judy Lee.",
      "my name is judy lee",
      "my Name is Judy lee.",
    ],
    answer: "My name is Judy Lee.",
    explain: "句頭大階，I 大階，人名大階，句尾有句號。",
  },
  {
    id: "p8",
    unit: 2,
    skill: "people",
    prompt: "Miss Ma is not married. Mrs Hill is married. Which title is for a married woman?",
    hint: "已婚女士。",
    choices: ["Mrs", "Miss", "Mr"],
    answer: "Mrs",
    explain: "已婚女士用 Mrs。未婚女士用 Miss。",
  },
  {
    id: "b1",
    unit: 4,
    skill: "bag",
    prompt: "I ___ a pencil.",
    hint: "自己講「我有」。",
    choices: ["have", "has", "am"],
    answer: "have",
    explain: "I / you / we 用 have。He / She 用 has。",
  },
  {
    id: "b2",
    unit: 4,
    skill: "bag",
    prompt: "She ___ an eraser.",
    hint: "女仔「佢有」。",
    choices: ["has", "have", "is"],
    answer: "has",
    explain: "She has ...",
  },
  {
    id: "b3",
    unit: 4,
    skill: "bag",
    prompt: "He ___ two water bottles.",
    hint: "男仔「佢有」。",
    choices: ["has", "have", "are"],
    answer: "has",
    explain: "He has ... 多過一件，名詞加 s：bottles。",
  },
  {
    id: "b4",
    unit: 4,
    skill: "bag",
    prompt: "Choose a or an: ___ orange",
    hint: "o 開頭係元音。",
    choices: ["an", "a"],
    answer: "an",
    explain: "a、e、i、o、u 開頭通常用 an：an orange, an eraser, an apple。",
  },
  {
    id: "b5",
    unit: 4,
    skill: "bag",
    prompt: "Choose a or an: ___ book",
    hint: "b 唔係元音。",
    choices: ["a", "an"],
    answer: "a",
    explain: "book 用 a book。",
  },
  {
    id: "b6",
    unit: 4,
    skill: "bag",
    prompt: "Choose a or an: ___ umbrella",
    hint: "u 開頭。",
    choices: ["an", "a"],
    answer: "an",
    explain: "書本例子：an umbrella, an ice cream, an apple, an eraser, an orange。",
  },
  {
    id: "b7",
    unit: 4,
    skill: "bag",
    prompt: "What is the word for 8?",
    hint: "Super Boy 有 eight pencils。",
    choices: ["eight", "six", "ten"],
    answer: "eight",
    explain: "8 = eight。6 = six。10 = ten。",
  },
  {
    id: "b8",
    unit: 4,
    skill: "bag",
    prompt: "One eraser. Three ___.",
    hint: "多過一件要變复数。",
    choices: ["erasers", "eraser", "an eraser"],
    answer: "erasers",
    explain: "多過一件加 s：three erasers, two bottles, eight pencils。",
  },
  {
    id: "b9",
    unit: 4,
    skill: "bag",
    prompt: "I have one pen. I can also say: I have ___ pen.",
    hint: "一件可以用 a 或者 one。",
    choices: ["a", "an", "three"],
    answer: "a",
    explain: "一件普通物件：a pen / one pen。擦膠因為元音開頭：an eraser / one eraser。",
  },
  {
    id: "m1",
    unit: 4,
    skill: "marks",
    prompt: "What is your name___",
    hint: "呢句係問句。",
    choices: ["?", ".", "!"],
    answer: "?",
    explain: "問句用問號 ?。",
  },
  {
    id: "m2",
    unit: 4,
    skill: "marks",
    prompt: "Help___",
    hint: "Super Boy 聽見人大叫。",
    choices: ["!", ".", "?"],
    answer: "!",
    explain: "大叫、驚訝用感嘆號 !，例如 Help! Wow! Oh no!",
  },
  {
    id: "m3",
    unit: 1,
    skill: "marks",
    prompt: "I am six years old___",
    hint: "普通一句講完。",
    choices: [".", "?", "!"],
    answer: ".",
    explain: "普通句子句尾用句號 .。",
  },
  {
    id: "m4",
    unit: 4,
    skill: "marks",
    prompt: "You are great ___ Super Boy.",
    hint: "講緊對住邊個講。",
    choices: [",", ".", "?"],
    answer: ",",
    explain: "名字前面加逗號：You are great, Super Boy.",
  },
  {
    id: "h1",
    unit: 1,
    skill: "phonics",
    prompt: "Which word starts with h?",
    hint: "h 音，好似 hi。",
    speak: "h. hi. hello. happy.",
    choices: ["happy", "meet", "you"],
    answer: "happy",
    explain: "h：hi, hello, happy。",
  },
  {
    id: "h2",
    unit: 1,
    skill: "phonics",
    prompt: "Which word starts with m?",
    hint: "m 音，好似 my。",
    speak: "m. my. meet. morning.",
    choices: ["morning", "year", "hello"],
    answer: "morning",
    explain: "m：my, meet, morning。",
  },
  {
    id: "h3",
    unit: 1,
    skill: "phonics",
    prompt: "Which word starts with y?",
    hint: "y 音，好似 you。",
    choices: ["your", "happy", "meet"],
    answer: "your",
    explain: "y：you, your, year。",
  },
  {
    id: "h4",
    unit: 2,
    skill: "phonics",
    prompt: "Which word starts with b?",
    hint: "b 音。",
    speak: "b. boy. big. bad.",
    choices: ["boy", "girl", "teacher"],
    answer: "boy",
    explain: "b：boy, big, bad。",
  },
  {
    id: "h5",
    unit: 2,
    skill: "phonics",
    prompt: "Which word starts with t?",
    hint: "t 音。",
    choices: ["ten", "good", "big"],
    answer: "ten",
    explain: "t：teacher, tell, ten。",
  },
  {
    id: "h6",
    unit: 4,
    skill: "phonics",
    prompt: "Which word has the -en sound?",
    hint: "尾音 en，好似 pen。",
    speak: "pen. ten. hen.",
    choices: ["pen", "pig", "book"],
    answer: "pen",
    explain: "-en：pen, ten, hen。",
  },
  {
    id: "h7",
    unit: 4,
    skill: "phonics",
    prompt: "Which word starts with p?",
    hint: "p 音。",
    choices: ["pencil", "kite", "look"],
    answer: "pencil",
    explain: "p：pencil, pig, point。",
  },
  {
    id: "h8",
    unit: 2,
    skill: "phonics",
    prompt: "Which word starts with g?",
    hint: "g 音。",
    choices: ["girl", "boy", "ten"],
    answer: "girl",
    explain: "g：girl, good, get。",
  },
];

export const games: { skill: Skill; title: string; zh: string; emoji: string }[] = [
  { skill: "greetings", title: "Names and greetings", zh: "名、年紀、打招呼、生日卡", emoji: "👋" },
  { skill: "people", title: "People at school", zh: "He / She / We、Mr / Mrs / Miss", emoji: "🏫" },
  { skill: "bag", title: "My school bag", zh: "have / has、a / an、數字", emoji: "🎒" },
  { skill: "phonics", title: "Letter sounds", zh: "h m y、b g t、p k -en", emoji: "🔤" },
  { skill: "marks", title: "Punctuation", zh: "句號、問號、感嘆號、逗號", emoji: "✏️" },
];

export const checklist = [
  { id: "u1w", text: "識讀、識拼 morning / afternoon，識講 Good morning、Good afternoon" },
  { id: "u1g", text: "識打招呼：Hi、Hello、Nice to meet you" },
  { id: "u1n", text: "識問同答 What is your name? / My name is ..." },
  { id: "u1a", text: "識問同答 How old are you? / I am six years old." },
  { id: "u1c", text: "識寫一張生日卡：Dear、Happy birthday!、From" },
  { id: "u2w", text: "識讀同學、組長、班長、各科老師" },
  { id: "u2h", text: "識用 This is ... He is / She is / We are" },
  { id: "u2o", text: "識用 my 同 our" },
  { id: "u2m", text: "識用 Mr、Mrs、Miss" },
  { id: "u2p", text: "句頭大階、I 大階、人名大階、句尾句號" },
  { id: "u4w", text: "識書包裡十件物件，同數字 one 至 ten" },
  { id: "u4h", text: "識用 I have / He has / She has，多過一件加 s" },
  { id: "u4a", text: "識用 a 同 an" },
  { id: "u4m", text: "識用逗號（名字前）、問號、感嘆號" },
];
