import { useState } from "react";
import Icon from "@/components/ui/icon";
import { sounds } from "@/components/SoundManager";
import Confetti from "@/components/Confetti";

interface Answer {
  text: string;
  points: number;
  revealed: boolean;
}

interface Question {
  id: number;
  question: string;
  emoji: string;
  answers: Answer[];
  strikes: number;
  completed: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Любимые породы собак Кати",
    emoji: "🐕",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Кавалер Кинг Чарльз терьер", points: 42, revealed: false },
      { text: "Чихуахуа", points: 28, revealed: false },
      { text: "Спаниель", points: 15, revealed: false },
      { text: "Бордер колли", points: 10, revealed: false },
      { text: "Мармадюк / Бетховен", points: 5, revealed: false },
    ],
  },
  {
    id: 2,
    question: "Любимые песни Кати",
    emoji: "🎵",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Треп хата — Yanix", points: 42, revealed: false },
      { text: "What Makes You Beautiful — One Direction", points: 28, revealed: false },
      { text: "Знаешь, моя душа рваная", points: 15, revealed: false },
      { text: "Feeling Good — Michael Bublé", points: 10, revealed: false },
      { text: "Beauty and a Beat — Justin Bieber", points: 5, revealed: false },
    ],
  },
  {
    id: 3,
    question: "В каких странах была Катя?",
    emoji: "✈️",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Мальдивы", points: 42, revealed: false },
      { text: "ОАЭ", points: 28, revealed: false },
      { text: "Вьетнам", points: 15, revealed: false },
      { text: "Беларусь", points: 10, revealed: false },
      { text: "Германия", points: 5, revealed: false },
    ],
  },
  {
    id: 4,
    question: "Любимые сериалы Кати",
    emoji: "📺",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Ранетки", points: 42, revealed: false },
      { text: "Сплетница", points: 28, revealed: false },
      { text: "Скинс", points: 15, revealed: false },
      { text: "Glee (Гли)", points: 10, revealed: false },
      { text: "Скам", points: 5, revealed: false },
    ],
  },
  {
    id: 5,
    question: "Любимые мультики Кати",
    emoji: "🎬",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Зверополис", points: 42, revealed: false },
      { text: "Микки Маус", points: 28, revealed: false },
      { text: "Рио", points: 15, revealed: false },
      { text: "Король Лев", points: 10, revealed: false },
      { text: "В поисках Немо", points: 5, revealed: false },
    ],
  },
  {
    id: 6,
    question: "Любимые фильмы Кати",
    emoji: "🎥",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Сумерки", points: 42, revealed: false },
      { text: "Гарри Поттер", points: 28, revealed: false },
      { text: "Шаг вперёд", points: 15, revealed: false },
      { text: "Будка поцелуев", points: 10, revealed: false },
      { text: "Бурлеск", points: 5, revealed: false },
    ],
  },
  {
    id: 7,
    question: "Любимые сладости Кати",
    emoji: "🍰",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Тирамису", points: 42, revealed: false },
      { text: "Белый шоколад", points: 28, revealed: false },
      { text: "Желатинки", points: 15, revealed: false },
      { text: "Киндер Буэно белый", points: 10, revealed: false },
      { text: "Чизкейк «Нью-Йорк»", points: 5, revealed: false },
    ],
  },
  {
    id: 8,
    question: "Кем работала Катя?",
    emoji: "💼",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Преподаватель", points: 42, revealed: false },
      { text: "Официант", points: 28, revealed: false },
      { text: "Кальянщик", points: 15, revealed: false },
      { text: "Мастер по бровям", points: 10, revealed: false },
      { text: "Костюмер", points: 5, revealed: false },
    ],
  },
  {
    id: 9,
    question: "Кем Катя хотела стать?",
    emoji: "🌟",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Актрисой", points: 42, revealed: false },
      { text: "Певицей", points: 28, revealed: false },
      { text: "Юристом", points: 15, revealed: false },
      { text: "Оператором", points: 10, revealed: false },
      { text: "Кинологом", points: 5, revealed: false },
    ],
  },
  {
    id: 10,
    question: "Фразы Кати",
    emoji: "💬",
    strikes: 0,
    completed: false,
    answers: [
      { text: "Пук", points: 42, revealed: false },
      { text: "Мне ещё станцевать брейк-данс", points: 28, revealed: false },
      { text: "Я что вам клоун", points: 15, revealed: false },
      { text: "Надо спросить у Яши", points: 10, revealed: false },
      { text: "Включите Яникса", points: 5, revealed: false },
    ],
  },
];

interface Props {
  onScore: (pts: number) => void;
}

export default function HundredToOne({ onScore }: Props) {
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [activeQ, setActiveQ] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [strikeAnim, setStrikeAnim] = useState(false);
  const [revealedAnim, setRevealedAnim] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const question = questions[activeQ];
  const allRevealed = question.answers.every(a => a.revealed);

  const revealAnswer = (idx: number) => {
    const answer = question.answers[idx];
    if (answer.revealed) return;

    sounds.reveal();
    setRevealedAnim(idx);
    const pts = answer.points;
    onScore(pts);
    setTotalScore(prev => prev + pts);
    setConfetti(true);
    setTimeout(() => {
      setConfetti(false);
      setRevealedAnim(null);
    }, 800);

    setQuestions(prev => prev.map((q, qi) =>
      qi === activeQ
        ? { ...q, answers: q.answers.map((a, ai) => ai === idx ? { ...a, revealed: true } : a) }
        : q
    ));
  };

  const addStrike = () => {
    sounds.wrong();
    setStrikeAnim(true);
    setTimeout(() => setStrikeAnim(false), 600);
    setQuestions(prev => prev.map((q, qi) =>
      qi === activeQ ? { ...q, strikes: Math.min(q.strikes + 1, 3) } : q
    ));
  };

  const nextQuestion = () => {
    sounds.click();
    if (activeQ < questions.length - 1) {
      setActiveQ(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    sounds.click();
    if (activeQ > 0) {
      setActiveQ(prev => prev - 1);
    }
  };

  const revealAll = () => {
    sounds.fanfare();
    setConfetti(true);
    const unrevealed = question.answers.filter(a => !a.revealed);
    const pts = unrevealed.reduce((s, a) => s + a.points, 0);
    onScore(pts);
    setTotalScore(prev => prev + pts);
    setTimeout(() => setConfetti(false), 500);
    setQuestions(prev => prev.map((q, qi) =>
      qi === activeQ
        ? { ...q, answers: q.answers.map(a => ({ ...a, revealed: true })), completed: true }
        : q
    ));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Confetti active={confetti} duration={1200} />

      <div className="text-center mb-8">
        <h2 className="font-pacifico text-4xl neon-yellow mb-2">100 к 1</h2>
        <p className="text-white/60 font-montserrat text-sm">
          Вопрос {activeQ + 1} из {questions.length}
        </p>
      </div>

      {/* Question tabs */}
      <div className="flex gap-2 mb-6 justify-center">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => { sounds.click(); setActiveQ(i); }}
            className={`w-10 h-10 rounded-full font-montserrat font-bold text-sm transition-all duration-200 ${
              i === activeQ
                ? "bg-party-yellow text-black scale-110"
                : q.completed
                ? "bg-party-green/30 text-party-green border border-party-green"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Main board */}
      <div className="card-party p-6">
        {/* Question */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">{question.emoji}</div>
          <h3 className="font-montserrat font-800 text-white text-xl font-bold leading-tight">
            {question.question}
          </h3>
        </div>

        {/* Strikes */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                i < question.strikes
                  ? `bg-red-600 text-white ${strikeAnim && i === question.strikes - 1 ? "animate-bounce-in" : ""}`
                  : "bg-white/10 text-white/20"
              }`}
            >
              {i < question.strikes ? "✕" : "○"}
            </div>
          ))}
          <button
            onClick={addStrike}
            className="ml-4 btn-party btn-danger text-sm"
            style={{ padding: "0.5rem 1rem" }}
          >
            <Icon name="X" size={16} /> Неверно
          </button>
        </div>

        {/* Answers board */}
        <div className="space-y-3 mb-6">
          {question.answers.map((answer, idx) => (
            <div
              key={idx}
              className={`relative flex items-center justify-between rounded-xl overflow-hidden transition-all duration-400 cursor-pointer ${
                answer.revealed ? "" : "hover:scale-[1.02]"
              } ${revealedAnim === idx ? "animate-bounce-in" : ""}`}
              onClick={() => !answer.revealed && revealAnswer(idx)}
            >
              {answer.revealed ? (
                <div className="w-full flex items-center justify-between bg-gradient-to-r from-party-purple/40 to-party-pink/40 border border-white/20 p-4 rounded-xl animate-spin-reveal">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-party-yellow/20 text-party-yellow font-montserrat font-bold text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-white font-montserrat font-semibold text-base">{answer.text}</span>
                  </div>
                  <span className="score-badge font-montserrat font-black text-lg">{answer.points}</span>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between number-board p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white/10 text-white/50 font-montserrat font-bold text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-white/30 font-montserrat text-base">???</span>
                  </div>
                  <Icon name="Lock" size={18} className="text-white/20" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!allRevealed && (
            <button className="btn-party btn-gold" onClick={revealAll}>
              <Icon name="Sparkles" size={16} /> Открыть всё
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevQuestion}
          disabled={activeQ === 0}
          className="btn-party disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem" }}
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
        <div className="text-white/40 font-montserrat text-sm self-center">
          Очки раунда: <span className="neon-yellow font-bold">{totalScore}</span>
        </div>
        <button
          onClick={nextQuestion}
          disabled={activeQ === questions.length - 1}
          className="btn-party disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem" }}
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      </div>
    </div>
  );
}