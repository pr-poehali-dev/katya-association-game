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
}

interface Player {
  name: string;
  score: number;
  emoji: string;
}

const PLAYER_EMOJIS = ["🦁", "🦊", "🐺", "🐯", "🦄", "🐻", "🐸", "🦋"];

// Баллы: место 1 = 5 очков, место 5 = 1 очко
const PTS = [5, 4, 3, 2, 1];

const INIT_QUESTIONS: Question[] = [
  {
    id: 1, question: "Любимые породы собак Кати", emoji: "🐕", strikes: 0,
    answers: [
      { text: "Кавалер Кинг Чарльз терьер", points: PTS[0], revealed: false },
      { text: "Чихуахуа",                   points: PTS[1], revealed: false },
      { text: "Спаниель",                   points: PTS[2], revealed: false },
      { text: "Бордер колли",               points: PTS[3], revealed: false },
      { text: "Мармадюк / Бетховен",        points: PTS[4], revealed: false },
    ],
  },
  {
    id: 2, question: "Любимые песни Кати", emoji: "🎵", strikes: 0,
    answers: [
      { text: "Треп хата — Yanix",                        points: PTS[0], revealed: false },
      { text: "What Makes You Beautiful — One Direction", points: PTS[1], revealed: false },
      { text: "Знаешь, моя душа рваная",                  points: PTS[2], revealed: false },
      { text: "Feeling Good — Michael Bublé",             points: PTS[3], revealed: false },
      { text: "Beauty and a Beat — Justin Bieber",        points: PTS[4], revealed: false },
    ],
  },
  {
    id: 3, question: "В каких странах была Катя?", emoji: "✈️", strikes: 0,
    answers: [
      { text: "Мальдивы",  points: PTS[0], revealed: false },
      { text: "ОАЭ",       points: PTS[1], revealed: false },
      { text: "Вьетнам",   points: PTS[2], revealed: false },
      { text: "Беларусь",  points: PTS[3], revealed: false },
      { text: "Германия",  points: PTS[4], revealed: false },
    ],
  },
  {
    id: 4, question: "Любимые сериалы Кати", emoji: "📺", strikes: 0,
    answers: [
      { text: "Ранетки",    points: PTS[0], revealed: false },
      { text: "Сплетница",  points: PTS[1], revealed: false },
      { text: "Скинс",      points: PTS[2], revealed: false },
      { text: "Glee (Гли)", points: PTS[3], revealed: false },
      { text: "Скам",       points: PTS[4], revealed: false },
    ],
  },
  {
    id: 5, question: "Любимые мультики Кати", emoji: "🎬", strikes: 0,
    answers: [
      { text: "Зверополис",      points: PTS[0], revealed: false },
      { text: "Микки Маус",      points: PTS[1], revealed: false },
      { text: "Рио",             points: PTS[2], revealed: false },
      { text: "Король Лев",      points: PTS[3], revealed: false },
      { text: "В поисках Немо",  points: PTS[4], revealed: false },
    ],
  },
  {
    id: 6, question: "Любимые фильмы Кати", emoji: "🎥", strikes: 0,
    answers: [
      { text: "Сумерки",       points: PTS[0], revealed: false },
      { text: "Гарри Поттер",  points: PTS[1], revealed: false },
      { text: "Шаг вперёд",    points: PTS[2], revealed: false },
      { text: "Будка поцелуев",points: PTS[3], revealed: false },
      { text: "Бурлеск",       points: PTS[4], revealed: false },
    ],
  },
  {
    id: 7, question: "Любимые сладости Кати", emoji: "🍰", strikes: 0,
    answers: [
      { text: "Тирамису",           points: PTS[0], revealed: false },
      { text: "Белый шоколад",      points: PTS[1], revealed: false },
      { text: "Желатинки",          points: PTS[2], revealed: false },
      { text: "Киндер Буэно белый", points: PTS[3], revealed: false },
      { text: "Чизкейк «Нью-Йорк»", points: PTS[4], revealed: false },
    ],
  },
  {
    id: 8, question: "Кем работала Катя?", emoji: "💼", strikes: 0,
    answers: [
      { text: "Преподаватель",    points: PTS[0], revealed: false },
      { text: "Официант",         points: PTS[1], revealed: false },
      { text: "Кальянщик",        points: PTS[2], revealed: false },
      { text: "Мастер по бровям", points: PTS[3], revealed: false },
      { text: "Костюмер",         points: PTS[4], revealed: false },
    ],
  },
  {
    id: 9, question: "Кем Катя хотела стать?", emoji: "🌟", strikes: 0,
    answers: [
      { text: "Актрисой",   points: PTS[0], revealed: false },
      { text: "Певицей",    points: PTS[1], revealed: false },
      { text: "Юристом",    points: PTS[2], revealed: false },
      { text: "Оператором", points: PTS[3], revealed: false },
      { text: "Кинологом",  points: PTS[4], revealed: false },
    ],
  },
  {
    id: 10, question: "Фразы Кати", emoji: "💬", strikes: 0,
    answers: [
      { text: "Пук",                          points: PTS[0], revealed: false },
      { text: "Мне ещё станцевать брейк-данс",points: PTS[1], revealed: false },
      { text: "Я что вам клоун",              points: PTS[2], revealed: false },
      { text: "Надо спросить у Яши",          points: PTS[3], revealed: false },
      { text: "Включите Яникса",              points: PTS[4], revealed: false },
    ],
  },
];

export default function HundredToOne() {
  const [questions, setQuestions] = useState<Question[]>(INIT_QUESTIONS.map(q => ({ ...q, answers: q.answers.map(a => ({ ...a })) })));
  const [activeQ, setActiveQ] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [strikeAnim, setStrikeAnim] = useState(false);
  const [scorePopup, setScorePopup] = useState<string | null>(null);

  // Players
  const [players, setPlayers] = useState<Player[]>([
    { name: "Игрок 1", score: 0, emoji: "🦁" },
    { name: "Игрок 2", score: 0, emoji: "🦊" },
  ]);
  const [showPlayers, setShowPlayers] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editScore, setEditScore] = useState("");

  // Award modal — открывается после нажатия на ответ
  const [awardModal, setAwardModal] = useState<{ answerIdx: number; pts: number } | null>(null);
  const [awardPlayerIdx, setAwardPlayerIdx] = useState(0);

  const question = questions[activeQ];

  // Нажали на ответ — открываем модалку выбора игрока
  const handleAnswerClick = (idx: number) => {
    const answer = question.answers[idx];
    if (answer.revealed) return;
    sounds.reveal();
    // Сначала открываем ответ
    setQuestions(prev => prev.map((q, qi) =>
      qi === activeQ
        ? { ...q, answers: q.answers.map((a, ai) => ai === idx ? { ...a, revealed: true } : a) }
        : q
    ));
    // Затем показываем модалку
    setAwardModal({ answerIdx: idx, pts: answer.points });
    setAwardPlayerIdx(0);
  };

  const confirmAward = () => {
    if (!awardModal) return;
    const pts = awardModal.pts;
    sounds.correct();
    setPlayers(prev => prev.map((p, i) => i === awardPlayerIdx ? { ...p, score: p.score + pts } : p));
    setScorePopup(`+${pts} → ${players[awardPlayerIdx]?.name}!`);
    setConfetti(true);
    setTimeout(() => { setScorePopup(null); setConfetti(false); }, 1800);
    setAwardModal(null);
  };

  const skipAward = () => {
    setAwardModal(null);
  };

  const addStrike = () => {
    sounds.wrong();
    setStrikeAnim(true);
    setTimeout(() => setStrikeAnim(false), 600);
    setQuestions(prev => prev.map((q, qi) =>
      qi === activeQ ? { ...q, strikes: Math.min(q.strikes + 1, 3) } : q
    ));
  };

  const resetStrikes = () => {
    sounds.click();
    setQuestions(prev => prev.map((q, qi) => qi === activeQ ? { ...q, strikes: 0 } : q));
  };

  // Players management
  const addPlayer = () => {
    if (players.length >= 8) return;
    sounds.click();
    const emoji = PLAYER_EMOJIS[players.length] || "🎮";
    setPlayers(prev => [...prev, { name: `Игрок ${prev.length + 1}`, score: 0, emoji }]);
  };

  const removePlayer = (idx: number) => {
    sounds.click();
    setPlayers(prev => prev.filter((_, i) => i !== idx));
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditName(players[idx].name);
    setEditScore(String(players[idx].score));
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    setPlayers(prev => prev.map((p, i) =>
      i === editingIdx
        ? { ...p, name: editName.trim() || p.name, score: parseInt(editScore) || 0 }
        : p
    ));
    setEditingIdx(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Confetti active={confetti} duration={1200} />

      {/* Score popup */}
      {scorePopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none text-center">
          <div className="font-pacifico text-5xl neon-yellow animate-bounce-in">{scorePopup}</div>
        </div>
      )}

      {/* Award modal */}
      {awardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="card-party p-7 max-w-sm w-full mx-4 animate-bounce-in">
            <div className="text-center mb-5">
              <div className="text-white/50 font-montserrat text-xs uppercase tracking-widest mb-1">Очки за ответ</div>
              <div className="font-pacifico text-5xl neon-yellow">{awardModal.pts}</div>
            </div>
            <div className="text-white/50 font-montserrat text-xs uppercase tracking-widest mb-3">Кому начислить?</div>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {players.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setAwardPlayerIdx(i)}
                  className={`flex items-center gap-2 p-3 rounded-xl font-montserrat text-sm font-semibold transition-all ${
                    i === awardPlayerIdx
                      ? "bg-party-yellow/30 ring-2 ring-party-yellow text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <div className="text-left">
                    <div>{p.name}</div>
                    <div className="text-xs opacity-60">{p.score} очков</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-party btn-success" onClick={confirmAward}>
                <Icon name="Check" size={18} /> Начислить
              </button>
              <button
                className="btn-party"
                style={{ background: "rgba(255,255,255,0.1)" }}
                onClick={skipAward}
              >
                Пропустить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-pacifico text-4xl neon-yellow">100 к 1</h2>
          <p className="text-white/50 font-montserrat text-sm mt-1">
            Вопрос {activeQ + 1} из {questions.length}
          </p>
        </div>
        <button
          onClick={() => { setShowPlayers(!showPlayers); sounds.click(); }}
          className="btn-party text-sm flex items-center gap-2"
          style={{ background: showPlayers ? "rgba(255,255,255,0.2)" : "linear-gradient(135deg,#7B2FFF,#FF1A75)", padding: "0.6rem 1.2rem" }}
        >
          <Icon name="Users" size={16} /> Игроки
        </button>
      </div>

      {/* Players panel */}
      {showPlayers && (
        <div className="card-party p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="font-montserrat font-bold text-white text-sm uppercase tracking-widest">Игроки</span>
            <button
              onClick={addPlayer}
              disabled={players.length >= 8}
              className="btn-party text-xs disabled:opacity-40"
              style={{ padding: "0.4rem 1rem", background: "linear-gradient(135deg,#00E676,#00BCD4)" }}
            >
              <Icon name="Plus" size={14} /> Добавить
            </button>
          </div>
          <div className="space-y-2">
            {players.map((p, i) => (
              <div key={i}>
                {editingIdx === i ? (
                  <div className="bg-white/10 rounded-xl p-3 space-y-2">
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && saveEdit()}
                        placeholder="Имя"
                        className="flex-1 bg-white/10 text-white font-montserrat text-sm rounded-lg px-3 py-2 outline-none border border-white/20 focus:border-party-pink"
                      />
                      <input
                        type="number"
                        value={editScore}
                        onChange={e => setEditScore(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && saveEdit()}
                        placeholder="Очки"
                        className="w-20 bg-white/10 text-white font-montserrat text-sm rounded-lg px-3 py-2 outline-none border border-white/20 focus:border-party-yellow text-center"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-party btn-success flex-1 text-xs" style={{ padding: "0.4rem" }} onClick={saveEdit}>
                        <Icon name="Check" size={14} /> Сохранить
                      </button>
                      <button className="btn-party flex-1 text-xs" style={{ padding: "0.4rem", background: "rgba(255,255,255,0.1)" }} onClick={() => setEditingIdx(null)}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-xl">{p.emoji}</span>
                    <span className="font-montserrat font-semibold text-white flex-1 text-sm">{p.name}</span>
                    <span className="score-badge text-sm font-black">{p.score}</span>
                    <button onClick={() => startEdit(i)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                      <Icon name="Pencil" size={14} />
                    </button>
                    <button onClick={() => removePlayer(i)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/30 hover:text-red-400 transition-all">
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {questions.map((q, i) => {
          const done = q.answers.every(a => a.revealed);
          return (
            <button
              key={q.id}
              onClick={() => { sounds.click(); setActiveQ(i); }}
              className={`w-10 h-10 rounded-full font-montserrat font-bold text-sm transition-all duration-200 ${
                i === activeQ
                  ? "bg-party-yellow text-black scale-110"
                  : done
                  ? "bg-party-green/30 text-party-green border border-party-green"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Main board */}
      <div className="card-party p-6">
        {/* Question */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{question.emoji}</div>
          <h3 className="font-montserrat font-bold text-white text-xl leading-tight">
            {question.question}
          </h3>
        </div>

        {/* Strikes */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
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
            className="ml-2 btn-party btn-danger text-sm"
            style={{ padding: "0.5rem 1rem" }}
          >
            <Icon name="X" size={16} /> Ошибка
          </button>
          {question.strikes > 0 && (
            <button
              onClick={resetStrikes}
              className="btn-party text-sm"
              style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.1)" }}
            >
              <Icon name="RotateCcw" size={16} />
            </button>
          )}
        </div>

        {/* Answers */}
        <div className="space-y-3">
          {question.answers.map((answer, idx) => (
            <div
              key={idx}
              onClick={() => handleAnswerClick(idx)}
              className={`flex items-center justify-between rounded-xl overflow-hidden transition-all duration-300 ${
                answer.revealed ? "cursor-default" : "cursor-pointer hover:scale-[1.02]"
              }`}
            >
              {answer.revealed ? (
                <div className="w-full flex items-center justify-between bg-gradient-to-r from-party-purple/40 to-party-pink/40 border border-white/20 p-4 rounded-xl animate-spin-reveal">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-party-yellow/20 text-party-yellow font-montserrat font-bold text-sm flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-white font-montserrat font-semibold">{answer.text}</span>
                  </div>
                  <span className="score-badge font-black text-base shrink-0">{answer.points}</span>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between number-board p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white/10 text-white/50 font-montserrat font-bold text-sm flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-white/30 font-montserrat">???</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/20 font-montserrat text-sm">{answer.points} очк.</span>
                    <Icon name="Lock" size={16} className="text-white/20" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => { sounds.click(); if (activeQ > 0) setActiveQ(p => p - 1); }}
          disabled={activeQ === 0}
          className="btn-party disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem" }}
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
        <button
          onClick={() => { sounds.click(); if (activeQ < questions.length - 1) setActiveQ(p => p + 1); }}
          disabled={activeQ === questions.length - 1}
          className="btn-party disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem" }}
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      </div>

      {/* Scoreboard */}
      {players.length > 0 && (
        <div className="card-party p-5 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Trophy" size={18} className="text-party-yellow" />
            <span className="font-montserrat font-bold text-white text-sm">Счёт</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
              <div key={p.name + i} className={`flex items-center gap-2 px-4 py-2 rounded-xl ${i === 0 ? "bg-party-yellow/20 ring-1 ring-party-yellow/40" : "bg-white/5"}`}>
                <span>{p.emoji}</span>
                <span className="font-montserrat text-white text-sm font-semibold">{p.name}</span>
                <span className={`font-pacifico text-lg ${i === 0 ? "neon-yellow" : "neon-cyan"}`}>{p.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
