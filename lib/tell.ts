import type { Question } from "@/lib/content";

const markName: Record<string, string> = {
  "?": "question mark",
  ".": "full stop",
  "!": "exclamation mark",
  ",": "comma",
};

/** Words a parent can say to a six-year-old. The worksheet prompt stays on screen. */
const spoken: Record<string, { ask: string; tell: string }> = {
  g1: {
    ask: "How old are you? Is it I am six years old, My name is Ken, or Good afternoon?",
    tell: "I am six years old.",
  },
  g2: {
    ask: "What is your name? Is it My name is Lily, I am seven years old, or You are welcome?",
    tell: "My name is Lily.",
  },
  g3: {
    ask: "It is eight o'clock in the morning. What do you say? Good morning, Good afternoon, or Happy birthday?",
    tell: "You say, Good morning.",
  },
  g4: {
    ask: "It is two o'clock in the afternoon. What do you say? Good afternoon, Good morning, or Nice to meet you?",
    tell: "You say, Good afternoon.",
  },
  g5: {
    ask: "A new friend says, Nice to meet you. What do you say? Nice to meet you too, I have a pen, or I am six years old?",
    tell: "You say, Nice to meet you too.",
  },
  g6: {
    ask: "How do you spell Lily? Is it L, I, L, Y, or L, Y, L, I, or L, I, L, I?",
    tell: "Lily is L, I, L, Y.",
  },
  g7: {
    ask: "Jack is seven. Ken is six. Who is older? Jack, Ken, or are they the same?",
    tell: "Jack is older.",
  },
  g8: {
    ask: "Which birthday card is correct? Dear Lily, Happy birthday! From Ken. Or, dear lily happy birthday from ken. Or, From Lily, Dear birthday?",
    tell: "The correct card says, Dear Lily, Happy birthday! From Ken.",
  },
  p1: {
    ask: "This is Wendy. Who is my classmate? She, He, or We?",
    tell: "This is Wendy. She is my classmate.",
  },
  p2: {
    ask: "This is Ted. Who is our group leader? He, She, or I?",
    tell: "This is Ted. He is our group leader.",
  },
  p3: {
    ask: "Kate and Wendy are together. Who is in Class 1A? We, He, or She?",
    tell: "Kate and Wendy are together. We are in Class 1A.",
  },
  p4: {
    ask: "Kate talks about her own friend. Which word do you use? My, our, or we?",
    tell: "She is my best friend.",
  },
  p5: {
    ask: "Sue helps the teacher. Sue is a girl. What is she? A monitress, a monitor, or a Maths teacher?",
    tell: "She is the monitress.",
  },
  p6: {
    ask: "The English teacher is a man. What do we call him? Mr Brown, Mrs Brown, or Miss Brown?",
    tell: "We call him Mr Brown.",
  },
  p7: {
    ask: "Which sentence is correct? My name is Judy Lee. Or, my name is judy lee. Or, my Name is Judy lee?",
    tell: "The correct sentence is, My name is Judy Lee.",
  },
  p8: {
    ask: "Miss Ma is not married. Mrs Hill is married. Which title is for a married woman? Mrs, Miss, or Mr?",
    tell: "A married woman is Mrs.",
  },
  b1: {
    ask: "You have a pencil. Do you say I have, I has, or I am?",
    tell: "I have a pencil.",
  },
  b2: {
    ask: "A girl has an eraser. Do you say She has, She have, or She is?",
    tell: "She has an eraser.",
  },
  b3: {
    ask: "A boy has two water bottles. Do you say He has, He have, or He are?",
    tell: "He has two water bottles.",
  },
  b4: {
    ask: "Orange. Do you say a or an?",
    tell: "You say an orange.",
  },
  b5: {
    ask: "Book. Do you say a or an?",
    tell: "You say a book.",
  },
  b6: {
    ask: "Umbrella. Do you say a or an?",
    tell: "You say an umbrella.",
  },
  b7: {
    ask: "What is the word for the number 8? Eight, six, or ten?",
    tell: "The word for 8 is eight.",
  },
  b8: {
    ask: "There is one eraser. Now there are three. Do you say erasers, eraser, or an eraser?",
    tell: "One eraser. Three erasers.",
  },
  b9: {
    ask: "You have one pen. Do you say a pen, an pen, or three pen?",
    tell: "I have a pen.",
  },
  m1: {
    ask: "This asks your name. What is your name. Which mark do you use? A question mark, a full stop, or an exclamation mark?",
    tell: "What is your name? Use a question mark.",
  },
  m2: {
    ask: "This is a shout. Help. Which mark do you use? An exclamation mark, a full stop, or a question mark?",
    tell: "Help! Use an exclamation mark.",
  },
  m3: {
    ask: "This is an ordinary sentence. I am six years old. Which mark do you use? A full stop, a question mark, or an exclamation mark?",
    tell: "I am six years old. Use a full stop.",
  },
  m4: {
    ask: "You are speaking to Super Boy. You are great, Super Boy. Which mark goes before his name? A comma, a full stop, or a question mark?",
    tell: "You are great, Super Boy. Use a comma.",
  },
  h1: {
    ask: "Which word starts with h? Listen. h, hi, hello, happy. Is it happy, meet, or you?",
    tell: "Happy starts with h.",
  },
  h2: {
    ask: "Which word starts with m? Listen. m, my, meet, morning. Is it morning, year, or hello?",
    tell: "Morning starts with m.",
  },
  h3: {
    ask: "Which word starts with y? Listen. y, you, your, year. Is it your, happy, or meet?",
    tell: "Your starts with y.",
  },
  h4: {
    ask: "Which word starts with b? Listen. b, boy, big, bad. Is it boy, girl, or teacher?",
    tell: "Boy starts with b.",
  },
  h5: {
    ask: "Which word starts with t? Listen. t, teacher, tell, ten. Is it ten, good, or big?",
    tell: "Ten starts with t.",
  },
  h6: {
    ask: "Which word has the en sound at the end? Listen. pen, ten, hen. Is it pen, pig, or book?",
    tell: "Pen ends with en.",
  },
  h7: {
    ask: "Which word starts with p? Listen. p, pencil, pig, point. Is it pencil, kite, or look?",
    tell: "Pencil starts with p.",
  },
  h8: {
    ask: "Which word starts with g? Listen. g, girl, good, get. Is it girl, boy, or ten?",
    tell: "Girl starts with g.",
  },
};

export function choiceLabel(choice: string) {
  return markName[choice] ?? "";
}

export function englishQuestion(question: Question) {
  return spoken[question.id]?.ask ?? fallbackAsk(question);
}

export function englishAnswer(question: Question) {
  return spoken[question.id]?.tell ?? fallbackTell(question);
}

function fallbackAsk(question: Question) {
  const options = question.choices.map((choice) => markName[choice] ?? choice);
  const list = options.length < 2 ? options.join("") : `${options.slice(0, -1).join(", ")}, or ${options.at(-1)}`;
  return `${question.prompt.replaceAll("___", "something")} ${list}?`.replace(/\s+/g, " ").trim();
}

function fallbackTell(question: Question) {
  if (question.prompt.includes("___")) {
    return question.prompt.replaceAll("___", question.answer).replace(/\s+/g, " ").trim();
  }
  return question.answer;
}
