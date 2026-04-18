import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { sounds } from "@/components/SoundManager";
import Confetti from "@/components/Confetti";

interface Player {
  name: string;
  score: number;
  emoji: string;
}

interface Props {
  scores: { [section: string]: number };
  players: Player[];
  totalScore: number;
}

const MEDALS = ["🥇", "🥈", "🥉", "🎖️", "🎖️"];

export default function Results({ scores, players, totalScore }: Props) {
  const [confetti, setConfetti] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const sorted = [...players].sort((a, b) => b.score - a.score);

  useEffect(() => {
    sounds.win();
    setConfetti(true);
    setTimeout(() => setConfetti(false), 200);

    let current = 0;
    const step = Math.ceil(totalScore / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, totalScore);
      setAnimatedScore(current);
      if (current >= totalScore) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [totalScore]);

  return (
    <div className="max-w-2xl mx-auto">
      <Confetti active={confetti} duration={4000} />

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-8xl mb-4 animate-float">🎉</div>
        <h2 className="font-pacifico text-5xl neon-pink mb-2">С Днём Рождения!</h2>
        <p className="font-pacifico text-3xl neon-yellow">Катя!</p>
      </div>

      {/* Total score */}
      <div className="card-party p-8 text-center mb-8 animate-pulse-glow">
        <div className="text-white/50 font-montserrat text-sm uppercase tracking-widest mb-2">Всего очков набрано</div>
        <div className="font-pacifico text-7xl neon-yellow">{animatedScore}</div>
        <div className="text-white/40 font-montserrat text-sm mt-2">баллов радости и веселья!</div>
      </div>

      {/* Scores by section */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { key: "guessWho", label: "Угадай кто", emoji: "🎭" },
          { key: "associations", label: "Ассоциации", emoji: "🔮" },
          { key: "hundredToOne", label: "100 к 1", emoji: "🎯" },
        ].map(({ key, label, emoji }) => (
          <div key={key} className="card-party p-4 text-center">
            <div className="text-3xl mb-2">{emoji}</div>
            <div className="text-white/50 font-montserrat text-xs mb-1">{label}</div>
            <div className="font-pacifico text-2xl neon-cyan">{scores[key] || 0}</div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="card-party p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Trophy" size={22} className="text-party-yellow" />
          <h3 className="font-montserrat font-bold text-white text-lg">Рейтинг игроков</h3>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center text-white/40 font-montserrat py-4">
            Игроки ещё не добавлены
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((player, i) => (
              <div
                key={player.name}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  i === 0 ? "bg-party-yellow/20 ring-1 ring-party-yellow/40" : "bg-white/5"
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-2xl">{MEDALS[i]}</span>
                <span className="text-2xl">{player.emoji}</span>
                <span className="font-montserrat font-bold text-white flex-1">{player.name}</span>
                <span className={`font-pacifico text-2xl ${i === 0 ? "neon-yellow" : "neon-cyan"}`}>
                  {player.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Congratulation message */}
      <div className="card-party p-8 text-center mb-8">
        <div className="text-4xl mb-4">💝</div>
        <p className="font-montserrat text-white/90 text-lg leading-relaxed">
          Катя, ты лучшая! Пусть этот день рождения будет самым ярким,<br />
          самым весёлым и самым запоминающимся в твоей жизни!
        </p>
        <div className="mt-6 font-pacifico text-2xl neon-pink">С любовью от всех нас! 🌺</div>
      </div>

      {/* Section details toggle */}
      <button
        className="btn-party w-full mb-6"
        style={{ background: "rgba(255,255,255,0.1)" }}
        onClick={() => { setShowDetails(!showDetails); sounds.click(); }}
      >
        <Icon name={showDetails ? "ChevronUp" : "ChevronDown"} size={18} />
        {showDetails ? "Скрыть детали" : "Показать детали"}
      </button>

      {showDetails && (
        <div className="card-party p-6 animate-fade-in">
          <h4 className="font-montserrat font-bold text-white mb-4">Очки по разделам:</h4>
          <div className="space-y-3">
            {Object.entries(scores).map(([key, val]) => {
              const labels: { [k: string]: string } = {
                guessWho: "🎭 Угадай кто",
                associations: "🔮 Ассоциации",
                hundredToOne: "🎯 Сто к одному",
              };
              return (
                <div key={key} className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="font-montserrat text-white/70">{labels[key] || key}</span>
                  <span className="score-badge">{val} очков</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-center mt-8 pb-8">
        <button
          className="btn-party btn-gold text-lg"
          onClick={() => { sounds.win(); setConfetti(true); setTimeout(() => setConfetti(false), 200); }}
        >
          🎉 Ещё раз конфетти!
        </button>
      </div>
    </div>
  );
}
