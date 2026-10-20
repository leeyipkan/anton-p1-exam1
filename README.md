# Sunny Class Primary 1 English

A revision game for Primary 1 English, built from the photographed textbook scope. The exam covers Unit 1, Unit 2, and Unit 4. Chapter 3 is out of this exam.

- Unit 1 Getting to know you: greetings, names, ages, birthday cards, sounds h / m / y
- Unit 2 People at my school: classmates and teachers, He / She / We, Mr / Mrs / Miss, capitals and full stops, sounds b / g / t
- Unit 4 In my school bag: bag items, have / has, a / an, numbers 1–10, punctuation, rhyme order, sounds p / k / -en

Page 42 previews Unit 5 and Unit 6. Those units are not in this exam.

The practice questions reuse the same words and patterns. They are new items for a child to practise, not the textbook pages copied out.

The main path is Super Boy School Dash: six levels, reactions, and sounds. At the end of a level, and on the score report, the app shows which question types are familiar and which are easy to miss. Word cards, the exam scope, a short quiz, and writing practice stay available.

## Website

The practice site is [https://leeyipkan.github.io/sunny-class/](https://leeyipkan.github.io/sunny-class/).

Scores stay in the browser on that device. Nothing is sent to a server.

To rebuild the Pages copy:

```bash
npm run export:pages
```

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

Some questions are a choice. Questions with a gap are fill-in-the-blank: type the missing word or mark, then check it. Capitals do not have to match. The right word is shown afterwards.

The school-bag words and the birthday card use pictures from Pixabay, saved in `public/pixabay`, under the Pixabay Content License. The moving gif files would not download, so the birthday picture is a still cake.

Each question has a line to say out loud, and the answer is a full English sentence to tell him. The speaker button uses the browser voice. If there is no sound, read the Say to him and Tell him lines on the screen.

## End-to-end check

With the dev server already running:

```bash
npm run test:e2e
```

The script drives Chrome through every page and branch: each dash level when the answers are right, wrong, and mixed, every choice and every gap, an empty gap, extra spaces, a mark written as a word, the rhyme in and out of order, quiz scores 0, 5, 6, and 8, writing mistakes and a saved card, every word card, the scope checklist, reward thresholds, and the score report.
