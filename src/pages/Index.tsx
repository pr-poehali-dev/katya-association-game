import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import GuessWho from "@/components/games/GuessWho";
import Associations from "@/components/games/Associations";
import HundredToOne from "@/components/games/HundredToOne";
import Results from "@/components/games/Results";
import Confetti from "@/components/Confetti";
import { sounds } from "@/components/SoundManager";

type Section = "home" | "guessWho" | "associations" | "hundredToOne" | "results";

interface Player {
  name: string;
  score: number;
  emoji: string;
}

const SECTIONS: { id: Section; label: string; emoji: string; desc: string }[] = [
  { id: "guessWho", label: "Угадай кто!", emoji: "🎭", desc: "Угадай человека по подсказкам" },
  { id: "associations", label: "Ассоциации", emoji: "🔮", desc: "Ассоциации с именинницей" },
  { id: "hundredToOne", label: "100 к 1", emoji: "🎯", desc: "Назови популярный ответ" },
  { id: "results", label: "Итоги", emoji: "🏆", desc: "Поздравление и рейтинг" },
];

const DEFAULT_PLAYERS: Player[] = [
  { name: "Игрок 1", score: 0, emoji: "🦁" },
  { name: "Игрок 2", score: 0, emoji: "🦊" },
  { name: "Игрок 3", score: 0, emoji: "🐺" },
];

export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [scores, setScores] = useState<{ [key: string]: number }>({
    guessWho: 0,
    associations: 0,
    hundredToOne: 0,
  });
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [celebrateHome, setCelebrateHome] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const goToSection = (s: Section) => {
    sounds.click();
    setSection(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addScore = (pts: number) => {
    setScores(prev => ({
      ...prev,
      [section]: (prev[section] || 0) + pts,
    }));
    setPlayers(prev =>
      prev.map((p, i) => (i === currentPlayerIdx ? { ...p, score: p.score + pts } : p))
    );
  };

  const handleEditPlayer = (idx: number) => {
    setEditingPlayer(idx);
    setEditName(players[idx].name);
  };

  const savePlayerName = () => {
    if (editName.trim() && editingPlayer !== null) {
      setPlayers(prev =>
        prev.map((p, i) => (i === editingPlayer ? { ...p, name: editName.trim() } : p))
      );
    }
    setEditingPlayer(null);
    setEditName("");
  };

  return (
    <div className="party-bg min-h-screen relative">
      {/* Top bar */}
      <div
        className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10"
        style={{ background: "rgba(10,0,30,0.85)" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              goToSection("home");
              setCelebrateHome(true);
              setTimeout(() => setCelebrateHome(false), 100);
            }}
            className="font-pacifico text-xl neon-pink hover:scale-105 transition-transform shrink-0"
          >
            🎉 Катя!
          </button>

          {/* Player selector */}
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => {
                setShowPlayerSelect(!showPlayerSelect);
                sounds.click();
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 transition-all"
            >
              <span className="text-lg">{players[currentPlayerIdx]?.emoji}</span>
              <span className="text-white font-montserrat text-sm font-semibold hidden sm:block">
                {players[currentPlayerIdx]?.name}
              </span>
              <span className="score-badge text-xs">{players[currentPlayerIdx]?.score}</span>
              <Icon name="ChevronDown" size={14} className="text-white/60" />
            </button>

            {showPlayerSelect && (
              <div className="absolute top-full right-0 mt-2 card-party p-3 min-w-[210px] z-50">
                <div className="text-white/40 font-montserrat text-xs uppercase tracking-widest mb-3 px-2">
                  Игроки
                </div>
                {players.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => {
                        setCurrentPlayerIdx(i);
                        setShowPlayerSelect(false);
                        sounds.click();
                      }}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left ${
                        i === currentPlayerIdx
                          ? "bg-party-pink/30 ring-1 ring-party-pink"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xl">{p.emoji}</span>
                      <span className="text-white font-montserrat text-sm font-semibold flex-1">
                        {p.name}
                      </span>
                      <span className="score-badge text-xs">{p.score}</span>
                    </button>
                    <button
                      onClick={() => handleEditPlayer(i)}
                      className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"
                    >
                      <Icon name="Pencil" size={14} />
                    </button>
                  </div>
                ))}

                {editingPlayer !== null && (
                  <div className="mt-3 p-3 bg-white/5 rounded-xl">
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && savePlayerName()}
                      className="w-full bg-white/10 text-white font-montserrat text-sm rounded-lg px-3 py-2 outline-none border border-white/20 focus:border-party-pink mb-2"
                      placeholder="Имя игрока..."
                    />
                    <button
                      onClick={savePlayerName}
                      className="btn-party text-sm w-full"
                      style={{ padding: "0.4rem 1rem" }}
                    >
                      Сохранить
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Score + fullscreen */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 py-2">
              <Icon name="Star" size={14} className="text-party-yellow" />
              <span className="text-white font-montserrat text-sm font-bold">{totalScore}</span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-full transition-all text-white/60 hover:text-white"
              title={isFullscreen ? "Выйти из полноэкранного режима" : "Полный экран"}
            >
              <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Section nav strip */}
      {section !== "home" && (
        <div
          className="sticky top-16 z-30 backdrop-blur-lg border-b border-white/5"
          style={{ background: "rgba(10,0,30,0.6)" }}
        >
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => goToSection("home")}
              className="shrink-0 p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all"
            >
              <Icon name="Home" size={18} />
            </button>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => goToSection(s.id)}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl font-montserrat text-sm font-semibold transition-all ${
                  section === s.id
                    ? "bg-white/20 text-white"
                    : "text-white/40 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{s.emoji}</span>
                <span className="hidden sm:block">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {section === "home" && (
          <div className="animate-fade-in">
            <Confetti active={celebrateHome} duration={2000} />

            {/* Hero */}
            <div className="text-center mb-12 pt-4">
              <div className="relative inline-block mb-6">
                <div className="text-8xl animate-float">🎂</div>
                <div className="absolute -top-2 -right-4 text-3xl animate-float" style={{ animationDelay: "0.5s" }}>
                  🌟
                </div>
                <div className="absolute -bottom-2 -left-4 text-2xl animate-float" style={{ animationDelay: "1s" }}>
                  🎊
                </div>
              </div>
              <h1 className="font-pacifico text-6xl sm:text-7xl mb-3 animate-shimmer">
                День Рождения
              </h1>
              <h2 className="font-pacifico text-5xl sm:text-6xl neon-pink mb-4">Кати!</h2>
              <p className="font-montserrat text-white/60 text-lg max-w-md mx-auto leading-relaxed">
                Праздничная интерактивная игра для самого лучшего человека на свете 🌺
              </p>
            </div>

            {/* Game cards */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goToSection(s.id)}
                  className="card-party p-6 text-left hover:scale-[1.03] transition-all duration-300 hover:ring-2 hover:ring-white/30 animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-5xl mb-4">{s.emoji}</div>
                  <div className="font-pacifico text-xl text-white mb-1">{s.label}</div>
                  <div className="font-montserrat text-white/50 text-sm">{s.desc}</div>
                  {scores[s.id] > 0 && (
                    <div className="mt-3 score-badge inline-block text-xs">{scores[s.id]} очков</div>
                  )}
                </button>
              ))}
            </div>

            {/* Leaderboard */}
            <div className="card-party p-6 mb-8">
              <div className="flex items-center gap-2 mb-5">
                <Icon name="Trophy" size={20} className="text-party-yellow" />
                <h3 className="font-montserrat font-bold text-white text-base">Таблица лидеров</h3>
              </div>
              <div className="space-y-2">
                {[...players]
                  .sort((a, b) => b.score - a.score)
                  .map((p, i) => (
                    <div
                      key={p.name}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        i === 0 ? "bg-party-yellow/10" : "bg-white/5"
                      }`}
                    >
                      <span className="text-xl">{["🥇", "🥈", "🥉"][i] || "🎖️"}</span>
                      <span className="text-xl">{p.emoji}</span>
                      <span className="font-montserrat text-white font-semibold flex-1">{p.name}</span>
                      <span className={`font-pacifico text-xl ${i === 0 ? "neon-yellow" : "neon-cyan"}`}>
                        {p.score}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="text-center">
              <button
                className="btn-party text-xl"
                style={{ padding: "1.2rem 3rem" }}
                onClick={() => goToSection("guessWho")}
              >
                🚀 Начать игру!
              </button>
            </div>
          </div>
        )}

        {section === "guessWho" && (
          <div className="animate-fade-in">
            <GuessWho />
          </div>
        )}

        {section === "associations" && (
          <div className="animate-fade-in">
            <Associations onScore={addScore} />
          </div>
        )}

        {section === "hundredToOne" && (
          <div className="animate-fade-in">
            <HundredToOne onScore={addScore} />
          </div>
        )}

        {section === "results" && (
          <div className="animate-fade-in">
            <Results scores={scores} players={players} totalScore={totalScore} />
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t border-white/10"
        style={{ background: "rgba(10,0,30,0.92)" }}
      >
        <div className="max-w-4xl mx-auto px-2 py-2 flex items-center justify-around">
          <button
            onClick={() => goToSection("home")}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              section === "home" ? "text-party-pink" : "text-white/40 hover:text-white"
            }`}
          >
            <Icon name="Home" size={20} />
            <span className="font-montserrat text-xs">Главная</span>
          </button>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => goToSection(s.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                section === s.id ? "text-party-pink" : "text-white/40 hover:text-white"
              }`}
            >
              <span className="text-xl leading-none">{s.emoji}</span>
              <span className="font-montserrat text-xs hidden sm:block">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}