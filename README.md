# Sunny Class Primary 1 English

A revision game for Primary 1 English, built from the photographed textbook scope. The exam covers Unit 1, Unit 2, and Unit 4. Chapter 3 is out of this exam.

- Unit 1 Getting to know you: greetings, names, ages, birthday cards, sounds h / m / y
- Unit 2 People at my school: classmates and teachers, He / She / We, Mr / Mrs / Miss, capitals and full stops, sounds b / g / t
- Unit 4 In my school bag: bag items, have / has, a / an, numbers 1–10, punctuation, rhyme order, sounds p / k / -en

Page 42 previews Unit 5 and Unit 6. Those units are not in this exam.

The practice questions reuse the same words and patterns. They are new items for a child to practise, not the textbook pages copied out.

The main path is Super Boy School Dash: six levels, reactions, and sounds. At the end of a level, and on the score report, the app shows which question types are familiar and which are easy to miss. Word cards, the exam scope, a short quiz, and writing practice stay available.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

The speaker button uses the browser voice for English. If there is no sound, a parent can read the English on the screen.

## End-to-end check

With the dev server already running:

```bash
npm run test:e2e
```

The script drives Chrome through Home, Dash, Words, Write, Quiz, Scope, and the score report, and checks that the pages stay in English.
