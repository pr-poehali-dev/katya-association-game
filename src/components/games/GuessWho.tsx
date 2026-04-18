import { useState } from "react";
import Icon from "@/components/ui/icon";
import { sounds } from "@/components/SoundManager";
import Confetti from "@/components/Confetti";

interface Person {
  id: number;
  association: string;
  name: string;
  emoji: string;
  revealed: boolean;
}

const PEOPLE: Person[] = [
  { id: 1,  emoji: "💘", association: "любимка краш номер 1",       name: "Яша",              revealed: false },
  { id: 2,  emoji: "🧠", association: "гений из моего детства",      name: "Маша",             revealed: false },
  { id: 3,  emoji: "🎮", association: "повелитель кс",               name: "Катя С",           revealed: false },
  { id: 4,  emoji: "🏎️", association: "формула 1",                   name: "Саша Кандаурова",  revealed: false },
  { id: 5,  emoji: "🎬", association: "блогер",                      name: "Руслан",           revealed: false },
  { id: 6,  emoji: "🐕", association: "собаковед",                   name: "Ира Серёгина",     revealed: false },
  { id: 7,  emoji: "🎉", association: "душа коллектива",             name: "Костя",            revealed: false },
  { id: 8,  emoji: "👩‍⚕️", association: "хороший доктор",            name: "Алиса",            revealed: false },
  { id: 9,  emoji: "💻", association: "мегамозг айтишника",          name: "Женя",             revealed: false },
  { id: 10, emoji: "🤝", association: "своя в доску",                name: "Даша Дахова",      revealed: false },
  { id: 11, emoji: "😂", association: "клёвая шутница",              name: "Диана",            revealed: false },
  { id: 12, emoji: "🏡", association: "хозяюшка",                    name: "Таня Починок",     revealed: false },
  { id: 13, emoji: "❤️", association: "воплощение любви",            name: "Мама Галина",      revealed: false },
  { id: 14, emoji: "💃", association: "движ Париж танцор",           name: "Лена",             revealed: false },
  { id: 15, emoji: "🤍", association: "доброе сердце",               name: "Алия (сестра Яши)", revealed: false },
  { id: 16, emoji: "🤣", association: "генератор шуток",             name: "Анюта Германия",   revealed: false },
];

interface Props {
  onScore: (pts: number) => void;
}

export default function GuessWho({ onScore }: Props) {
  const [people, setPeople] = useState<Person[]>(PEOPLE.map(p => ({ ...p })));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showName, setShowName] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [scorePopup, setScorePopup] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const person = people[currentIdx];

  const handleRevealName = () => {
    sounds.reveal();
    setShowName(true);
  };

  const handleCorrect = () => {
    sounds.correct();
    setFeedback("correct");
    setConfetti(true);
    setScorePopup("+10 очков!");
    onScore(10);
    const updated = [...people];
    updated[currentIdx].revealed = true;
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
    setTimeout(() => setFeedback(null), 800);
  };

  const goTo = (idx: number) => {
    sounds.click();
    setCurrentIdx(idx);
    setShowName(false);
    setFeedback(null);
  };

  const next = () => { if (currentIdx < people.length - 1) goTo(currentIdx + 1); };
  const prev = () => { if (currentIdx > 0) goTo(currentIdx - 1); };

  const guessedCount = people.filter(p => p.revealed).length;

  return (
    <div className="max-w-2xl mx-auto">
      <Confetti active={confetti} />

      {/* Score popup */}
      {scorePopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="font-pacifico text-6xl neon-yellow animate-bounce-in">{scorePopup}</div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-pacifico text-4xl neon-pink mb-2">Угадай кто!</h2>
        <p className="text-white/60 font-montserrat text-sm">
          {currentIdx + 1} из {people.length} • угадано {guessedCount}/{people.length}
        </p>
      </div>

      {/* Dots navigation */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {people.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIdx
                ? "bg-party-pink scale-150"
                : p.revealed
                ? "bg-party-green"
                : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Main card */}
      <div
        className={`card-party p-8 transition-all duration-300 ${
          feedback === "correct"
            ? "ring-4 ring-green-400"
            : feedback === "wrong"
            ? "ring-4 ring-red-500"
            : ""
        }`}
      >
        {/* Association — always visible */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-5 animate-float">{person.emoji}</div>
          <div className="text-white/40 font-montserrat text-xs uppercase tracking-widest mb-3">
            Ассоциация
          </div>
          <div className="font-pacifico text-3xl sm:text-4xl text-white leading-tight">
            {person.association}
          </div>
        </div>

        {/* Name reveal */}
        {showName ? (
          <div className="animate-bounce-in text-center bg-white/10 rounded-2xl p-6 mb-6">
            <div className="text-white/40 font-montserrat text-xs uppercase tracking-widest mb-2">Это...</div>
            <div className="font-pacifico text-4xl neon-yellow">{person.name}</div>
          </div>
        ) : (
          <button
            className="btn-party w-full mb-6"
            style={{ background: "linear-gradient(135deg, #7B2FFF, #00E5FF)" }}
            onClick={handleRevealName}
          >
            <Icon name="Eye" size={18} /> Открыть имя
          </button>
        )}

        {/* Score actions — show after name revealed */}
        {showName && !person.revealed && (
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-party btn-success" onClick={handleCorrect}>
              <Icon name="Check" size={18} /> Угадали!
            </button>
            <button className="btn-party btn-danger" onClick={handleWrong}>
              <Icon name="X" size={18} /> Не угадали
            </button>
          </div>
        )}

        {person.revealed && (
          <div className="text-center">
            <span className="text-party-green font-montserrat font-bold text-sm">✓ Угадано!</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prev}
          disabled={currentIdx === 0}
          className="btn-party disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem" }}
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
        <button
          onClick={next}
          disabled={currentIdx === people.length - 1}
          className="btn-party disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.1)", padding: "0.75rem 1.5rem" }}
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      </div>
    </div>
  );
}
