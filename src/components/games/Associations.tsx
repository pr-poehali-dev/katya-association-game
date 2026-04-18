import { useState } from "react";
import Icon from "@/components/ui/icon";
import { sounds } from "@/components/SoundManager";
import Confetti from "@/components/Confetti";

interface AssocCard {
  id: number;
  category: string;
  word: string;
  emoji: string;
  revealed: boolean;
  correct: boolean | null;
}

const ASSOCIATIONS: AssocCard[] = [
  { id: 1, category: "Еда", word: "Тирамису", emoji: "🍰", revealed: false, correct: null },
  { id: 2, category: "Животное", word: "Кошка", emoji: "🐱", revealed: false, correct: null },
  { id: 3, category: "Цвет", word: "Розовый", emoji: "🌸", revealed: false, correct: null },
  { id: 4, category: "Место", word: "Кофейня", emoji: "☕", revealed: false, correct: null },
  { id: 5, category: "Музыка", word: "Попса 90-х", emoji: "🎵", revealed: false, correct: null },
  { id: 6, category: "Фильм", word: "Дьявол носит Прада", emoji: "🎬", revealed: false, correct: null },
  { id: 7, category: "Хобби", word: "Шопинг", emoji: "🛍️", revealed: false, correct: null },
  { id: 8, category: "Суперсила", word: "Читать мысли", emoji: "🔮", revealed: false, correct: null },
  { id: 9, category: "Стиль", word: "Элегантность", emoji: "👗", revealed: false, correct: null },
  { id: 10, category: "Настроение", word: "Солнечная", emoji: "☀️", revealed: false, correct: null },
  { id: 11, category: "Сезон", word: "Лето", emoji: "🌺", revealed: false, correct: null },
  { id: 12, category: "Цветок", word: "Пион", emoji: "🌷", revealed: false, correct: null },
];

interface Props {
  onScore: (pts: number) => void;
}

export default function Associations({ onScore }: Props) {
  const [cards, setCards] = useState<AssocCard[]>(ASSOCIATIONS);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const handleReveal = (id: number) => {
    sounds.reveal();
    setActiveCard(id);
    setCards(prev => prev.map(c => c.id === id ? { ...c, revealed: true } : c));
  };

  const handleJudge = (id: number, isCorrect: boolean) => {
    if (isCorrect) {
      sounds.correct();
      setConfetti(true);
      setTotalCorrect(prev => prev + 1);
      onScore(5);
      setTimeout(() => setConfetti(false), 100);
    } else {
      sounds.wrong();
    }
    setCards(prev => prev.map(c => c.id === id ? { ...c, correct: isCorrect } : c));
    setActiveCard(null);
  };

  const unrevealed = cards.filter(c => !c.revealed);
  const revealed = cards.filter(c => c.revealed);

  return (
    <div className="max-w-3xl mx-auto">
      <Confetti active={confetti} duration={1500} />

      <div className="text-center mb-8">
        <h2 className="font-pacifico text-4xl neon-cyan mb-2">Ассоциации с Катей</h2>
        <p className="text-white/60 font-montserrat text-sm">
          Открывайте карточки и угадывайте ассоциации
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <span className="score-badge">{totalCorrect} / {cards.length} угадано</span>
        </div>
      </div>

      {/* Active card popup */}
      {activeCard !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setActiveCard(null)}>
          <div
            className="card-party p-10 max-w-sm w-full mx-4 text-center animate-bounce-in"
            onClick={e => e.stopPropagation()}
          >
            {(() => {
              const card = cards.find(c => c.id === activeCard);
              if (!card) return null;
              return (
                <>
                  <div className="text-5xl mb-4">{card.emoji}</div>
                  <div className="text-white/50 font-montserrat text-sm uppercase tracking-widest mb-2">{card.category}</div>
                  <div className="font-pacifico text-4xl neon-yellow mb-8">{card.word}</div>
                  <p className="text-white/60 font-montserrat text-sm mb-6">Катя согласна с этой ассоциацией?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="btn-party btn-success" onClick={() => handleJudge(activeCard, true)}>
                      <Icon name="Heart" size={18} /> Да!
                    </button>
                    <button className="btn-party btn-danger" onClick={() => handleJudge(activeCard, false)}>
                      <Icon name="X" size={18} /> Нет
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
        {unrevealed.map(card => (
          <button
            key={card.id}
            onClick={() => handleReveal(card.id)}
            className="card-party p-4 text-center cursor-pointer hover:scale-105 transition-all duration-200 hover:ring-2 hover:ring-party-pink aspect-square flex flex-col items-center justify-center"
          >
            <div className="text-3xl mb-1">🎀</div>
            <div className="text-white/40 font-montserrat text-xs">Открыть</div>
          </button>
        ))}

        {revealed.map(card => (
          <div
            key={card.id}
            className={`card-party p-3 text-center aspect-square flex flex-col items-center justify-center relative transition-all duration-300 ${
              card.correct === true
                ? "ring-2 ring-party-green bg-party-green/10"
                : card.correct === false
                ? "ring-2 ring-red-500 bg-red-500/10 opacity-60"
                : ""
            }`}
          >
            {card.correct !== null && (
              <div className="absolute top-1 right-1">
                {card.correct ? (
                  <Icon name="Check" size={14} className="text-party-green" />
                ) : (
                  <Icon name="X" size={14} className="text-red-400" />
                )}
              </div>
            )}
            <div className="text-2xl mb-1">{card.emoji}</div>
            <div className="text-white/40 font-montserrat text-xs leading-tight">{card.category}</div>
            <div className="text-white font-montserrat text-xs font-bold leading-tight">{card.word}</div>
          </div>
        ))}
      </div>

      {unrevealed.length === 0 && (
        <div className="text-center card-party p-8 animate-bounce-in">
          <div className="text-5xl mb-4">🎉</div>
          <div className="font-pacifico text-3xl neon-yellow mb-2">Все карточки открыты!</div>
          <div className="text-white/70 font-montserrat">
            Катя согласилась с {totalCorrect} из {cards.length} ассоциаций
          </div>
        </div>
      )}
    </div>
  );
}
