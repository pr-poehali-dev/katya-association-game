import { useState } from "react";
import Icon from "@/components/ui/icon";
import { sounds } from "@/components/SoundManager";
import Confetti from "@/components/Confetti";

interface Person {
  id: number;
  clues: string[];
  name: string;
  emoji: string;
  revealed: boolean;
}

const PEOPLE: Person[] = [
  {
    id: 1,
    emoji: "👩‍🦰",
    name: "Маша",
    clues: [
      "Обожает пить кофе каждое утро ☕",
      "Всегда опаздывает на 15 минут",
      "Смеётся громче всех в компании",
      "Коллекционирует магниты с путешествий",
    ],
    revealed: false,
  },
  {
    id: 2,
    emoji: "👨‍💼",
    name: "Дима",
    clues: [
      "Никогда не расстаётся со своим телефоном 📱",
      "Знает анекдот на любую тему",
      "Помогает всем переехать, но потом неделю болеет 😄",
      "Лучший мастер шашлыка в округе",
    ],
    revealed: false,
  },
  {
    id: 3,
    emoji: "👩‍🎨",
    name: "Оля",
    clues: [
      "Рисует шедевры в записных книжках 🎨",
      "Цитирует фильмы в разговорах",
      "Всегда знает модные тренды",
      "Варит самый вкусный борщ",
    ],
    revealed: false,
  },
  {
    id: 4,
    emoji: "🧑‍🤝‍🧑",
    name: "Серёжа",
    clues: [
      "Не пропускает ни одной тренировки 💪",
      "Советует смотреть сериалы, которые смотрел сам",
      "Помнит дни рождения всех друзей",
      "Варит кофе по сложным рецептам",
    ],
    revealed: false,
  },
  {
    id: 5,
    emoji: "👩‍⚕️",
    name: "Таня",
    clues: [
      "Знает всё о здоровом питании 🥗",
      "Смотрит только документальные фильмы",
      "Умеет находить лучшие скидки",
      "Всегда берёт с собой зонтик",
    ],
    revealed: false,
  },
];

interface Props {
  onScore: (pts: number) => void;
}

export default function GuessWho({ onScore }: Props) {
  const [people, setPeople] = useState<Person[]>(PEOPLE.map(p => ({ ...p })));
  const [currentPersonIdx, setCurrentPersonIdx] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [scorePopup, setScorePopup] = useState<string | null>(null);

  const person = people[currentPersonIdx];

  const handleRevealClue = () => {
    sounds.tick();
    if (clueIndex < person.clues.length - 1) {
      setClueIndex(prev => prev + 1);
    }
  };

  const handleCorrect = () => {
    const pts = Math.max(10 - clueIndex * 2, 4);
    sounds.correct();
    setFeedback("correct");
    setShowAnswer(true);
    setConfetti(true);
    setScorePopup(`+${pts} очков!`);
    onScore(pts);
    const updated = [...people];
    updated[currentPersonIdx].revealed = true;
    setPeople(updated);
    setTimeout(() => {
      setFeedback(null);
      setScorePopup(null);
      setConfetti(false);
    }, 2000);
  };

  const handleWrong = () => {
    sounds.wrong();
    setFeedback("wrong");
    setTimeout(() => setFeedback(null), 1000);
    if (clueIndex < person.clues.length - 1) {
      setClueIndex(prev => prev + 1);
    }
  };

  const nextPerson = () => {
    sounds.click();
    if (currentPersonIdx < people.length - 1) {
      setCurrentPersonIdx(prev => prev + 1);
      setClueIndex(0);
      setShowAnswer(false);
      setFeedback(null);
    }
  };

  const prevPerson = () => {
    sounds.click();
    if (currentPersonIdx > 0) {
      setCurrentPersonIdx(prev => prev - 1);
      setClueIndex(0);
      setShowAnswer(false);
      setFeedback(null);
    }
  };

  const pointsForGuess = Math.max(10 - clueIndex * 2, 4);

  return (
    <div className="max-w-2xl mx-auto">
      <Confetti active={confetti} />

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-pacifico text-4xl neon-pink mb-2">Угадай кто!</h2>
        <p className="text-white/60 font-montserrat text-sm">
          Персонаж {currentPersonIdx + 1} из {people.length} • Меньше подсказок = больше очков
        </p>
      </div>

      {/* Score popup */}
      {scorePopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="font-pacifico text-6xl neon-yellow animate-bounce-in">{scorePopup}</div>
        </div>
      )}

      {/* Main card */}
      <div
        className={`card-party p-8 relative overflow-hidden transition-all duration-300 ${
          feedback === "correct" ? "ring-4 ring-green-400" : feedback === "wrong" ? "ring-4 ring-red-500" : ""
        }`}
      >
        {/* Person counter dots */}
        <div className="flex gap-2 justify-center mb-6">
          {people.map((p, i) => (
            <div
              key={p.id}
              onClick={() => { setCurrentPersonIdx(i); setClueIndex(0); setShowAnswer(false); sounds.click(); }}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                i === currentPersonIdx
                  ? "bg-party-pink scale-125"
                  : p.revealed
                  ? "bg-party-green"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Clues */}
        <div className="space-y-3 mb-8">
          <p className="text-white/40 font-montserrat text-xs uppercase tracking-widest mb-4">Подсказки:</p>
          {person.clues.slice(0, clueIndex + 1).map((clue, i) => (
            <div
              key={i}
              className="animate-slide-up flex items-start gap-3 bg-white/5 rounded-xl p-4"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-party-yellow font-bold font-montserrat text-sm w-6 shrink-0">{i + 1}.</span>
              <span className="text-white font-montserrat text-base">{clue}</span>
            </div>
          ))}
        </div>

        {/* Points hint */}
        {!showAnswer && (
          <div className="text-center mb-6">
            <span className="score-badge font-montserrat text-sm">
              За правильный ответ сейчас: {pointsForGuess} очков
            </span>
          </div>
        )}

        {/* Answer reveal */}
        {showAnswer && (
          <div className="animate-bounce-in text-center bg-white/10 rounded-2xl p-6 mb-6">
            <div className="text-6xl mb-3">{person.emoji}</div>
            <div className="font-pacifico text-4xl neon-yellow">{person.name}</div>
          </div>
        )}

        {/* Actions */}
        {!showAnswer ? (
          <div className="grid grid-cols-1 gap-3">
            {clueIndex < person.clues.length - 1 && (
              <button className="btn-party" style={{ background: "linear-gradient(135deg, #7B2FFF, #00E5FF)" }} onClick={handleRevealClue}>
                <Icon name="Eye" size={18} /> Ещё подсказка
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-party btn-success" onClick={handleCorrect}>
                <Icon name="Check" size={18} /> Угадал!
              </button>
              <button className="btn-party btn-danger" onClick={handleWrong}>
                <Icon name="X" size={18} /> Не знаю
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 justify-center">
            {currentPersonIdx > 0 && (
              <button className="btn-party" style={{ background: "rgba(255,255,255,0.15)" }} onClick={prevPerson}>
                <Icon name="ChevronLeft" size={18} /> Назад
              </button>
            )}
            {currentPersonIdx < people.length - 1 && (
              <button className="btn-party" onClick={nextPerson}>
                Следующий <Icon name="ChevronRight" size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevPerson}
          disabled={currentPersonIdx === 0}
          className="btn-party disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem" }}
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
        <span className="text-white/40 font-montserrat text-sm self-center">
          {people.filter(p => p.revealed).length}/{people.length} угадано
        </span>
        <button
          onClick={nextPerson}
          disabled={currentPersonIdx === people.length - 1}
          className="btn-party disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem" }}
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      </div>
    </div>
  );
}
