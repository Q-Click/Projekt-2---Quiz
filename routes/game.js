function gameRoutes(app) {
  let goodAnswers = 0;
  let isGameOver = false;
  let callToAFriendUsed = false;
  let questionToTheCrowdUsed = false;
  let halfOnHalfUsed = false;

  const questions = [
    {
      question: "Czym jest to zdanie: Zażółć gęślą jaźń?",
      answers: ["Anagramem", "Palindromem", "Pangramem", "Paronimem"],
      correctAnswer: 2,
    },
    {
      question: "Które z podanych słów oznacza otwór strzelniczy?",
      answers: ["Harpagon", "Wykusz", "Empora", "Ambrazura"],
      correctAnswer: 3,
    },
    {
      question:
        "Jakie znaczenie posiada w sanskrycie nazwa łańcucha górskiego Himalaje?",
      answers: [
        "Siedziba śniegów",
        "Siedziba chmur",
        "Siedziba bogów",
        "Siedziba duchów",
      ],
      correctAnswer: 0,
    },
    {
      question: "Jak potocznie nazywano trabanta?",
      answers: [
        "Sputnik na kółkach, skrzydlak",
        "Zemsta Honeckera, Trabi",
        "Mydelniczka, trampek",
        "Wszystkie nazwy są poprawne",
      ],
      correctAnswer: 3,
    },
    {
      question: "Z ilu wersów składa się sonet?",
      answers: ["14", "16", "22", "44"],
      correctAnswer: 0,
    },
    {
      question:
        'Tytułowy ,,Król olch" ze słynnej ballady Johanna Wolfganga von Goethe jest zapowiedzią?',
      answers: ["Wojny", "Śmierci", "Szczęścia", "Miłości"],
      correctAnswer: 1,
    },
    {
      question: "W mitologii greckiej - nimfy Zachodzącego Słońca to...",
      answers: [
        "Wszystkie odpowiedzi są poprawne",
        "Plejady",
        "Hesperydy",
        "Hiady",
      ],
      correctAnswer: 2,
    },
    {
      question: "Podaj symbol chemiczny telluru.",
      answers: ["T", "Te", "Tl", "Tr"],
      correctAnswer: 1,
    },
    {
      question: "Która z wymienionych tkanin NIE jest bawełniana?",
      answers: ["Etamina", "Perkal", "Kreton", "Kaszmir"],
      correctAnswer: 3,
    },
    {
      question: "Najwyższczy szczyt na Marsie nosi nazwę:",
      answers: ["Alba Mons", "Arsia Mons", "Olympus Mons", "Pavonis Mons"],
      correctAnswer: 2,
    },
  ];

  app.get("/question", (req, res) => {
    if (goodAnswers === questions.length) {
      res.json({
        winner: true,
      });
    } else if (isGameOver) {
      res.json({
        loser: true,
      });
    } else {
      const nextQuestion = questions[goodAnswers];

      const { question, answers } = nextQuestion;

      res.json({
        question,
        answers,
      });
    }
  });

  app.post("/answer/:index", (req, res) => {
    if (isGameOver) {
      res.json({
        loser: true,
      });
    }

    const { index } = req.params;

    const question = questions[goodAnswers];

    const isGoodAnswer = question.correctAnswer === Number(index);

    if (isGoodAnswer) {
      goodAnswers++;
    } else {
      isGameOver = true;
      setTimeout(function () {
        isGameOver = false;
        goodAnswers = 0;
        callToAFriendUsed = false;
        questionToTheCrowdUsed = false;
        halfOnHalfUsed = false;
      }, 1000);
    }

    res.json({
      correct: isGoodAnswer,
      goodAnswers,
    });
  });

  app.get("/help/friend", (req, res) => {
    if (callToAFriendUsed) {
      return res.json({
        text: "To koło ratunkowe było już wykorzystane.",
      });
    }

    callToAFriendUsed = true;

    const doesFriendKnowAnswer = Math.random() < 0.5;

    const question = questions[goodAnswers];

    res.json({
      text: doesFriendKnowAnswer
        ? `Hmm, wydaje mi się, że odpowiedź to ${
            question.answers[question.correctAnswer]
          }`
        : "Hmm, no nie wiem...",
    });
  });

  app.get("/help/half", (req, res) => {
    if (halfOnHalfUsed) {
      return res.json({
        text: "To koło ratunkowe było już wykorzystane.",
      });
    }

    halfOnHalfUsed = true;

    const question = questions[goodAnswers];

    const answersCopy = question.answers.filter(
      (s, index) => index !== question.correctAnswer
    );

    answersCopy.splice(~~(Math.random() * answersCopy.length), 1);

    res.json({
      answersToRemove: answersCopy,
    });
  });

  app.get("/help/crowd", (req, res) => {
    if (questionToTheCrowdUsed) {
      return res.json({
        text: "To koło ratunkowe było już wykorzystane.",
      });
    }

    questionToTheCrowdUsed = true;

    const chart = [10, 20, 30, 40];

    for (let i = chart.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20 - 10);

      chart[i] += change;
      chart[i - 1] -= change;
    }

    const question = questions[goodAnswers];
    const { correctAnswer } = question;

    [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]];

    res.json({
      chart,
    });
  });
}

module.exports = gameRoutes;
