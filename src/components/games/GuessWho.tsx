import { useState } from "react";
import Icon from "@/components/ui/icon";
import { sounds } from "@/components/SoundManager";
import Confetti from "@/components/Confetti";

interface Person {
  id: number;
  association: string;
  name: string;
  emoji: string;
  nameRevealed: boolean;
}

const PEOPLE: Person[] = [
  { id: 1,  emoji: "💘", association: "любимка краш номер 1",       name: "Яша",               nameRevealed: false },
  { id: 2,  emoji: "🧠", association: "гений из моего детства",      name: "Маша",              nameRevealed: false },
  { id: 3,  emoji: "🎮", association: "повелитель кс",               name: "Катя С",            nameRevealed: false },
  { id: 4,  emoji: "🏎️", association: "формула 1",                   name: "Саша Кандаурова",   nameRevealed: false },
  { id: 5,  emoji: "🎬", association: "блогер",                      name: "Руслан",            nameRevealed: false },
  { id: 6,  emoji: "🐕", association: "собаковед",                   name: "Ира Серёгина",      nameRevealed: false },
  { id: 7,  emoji: "🎉", association: "душа коллектива",             name: "Костя",             nameRevealed: false },
  { id: 8,  emoji: "👩‍⚕️", association: "хороший доктор",            name: "Алиса",             nameRevealed: false },
  { id: 9,  emoji: "💻", association: "мегамозг айтишника",          name: "Женя",              nameRevealed: false },
  { id: 10, emoji: "🤝", association: "своя в доску",                name: "Даша Дахова",       nameRevealed: false },
  { id: 11, emoji: "😂", association: "клёвая шутница",              name: "Диана",             nameRevealed: false },
  { id: 12, emoji: "🏡", association: "хозяюшка",                    name: "Таня Починок",      nameRevealed: false },
  { id: 13, emoji: "❤️", association: "воплощение любви",            name: "Мама Галина",       nameRevealed: false },
  { id: 14, emoji: "💃", association: "движ Париж танцор",           name: "Лена",              nameRevealed: false },
  { id: 15, emoji: "🤍", association: "доброе сердце",               name: "Алия (сестра Яши)", nameRevealed: false },
  { id: 16, emoji: "🤣", association: "генератор шуток",             name: "Анюта Германия",    nameRevealed: false },
];

const PLAYER_EMOJIS = ["🦁", "🦊", "🐺", "🐯", "🦄", "🐻", "🐸", "🦋"];

interface Player {
  name: string;
  score: number;
  emoji: string;
}

export default function GuessWho() {
  const [people, setPeople] = useState<Person[]>(PEOPLE.map(p => ({ ...p })));
  const [confetti, setConfetti] = useState(false);

  // Players state — local to this game
  const [players, setPlayers] = useState<Player[]>([
    { name: "Игрок 1", score: 0, emoji: "🦁" },
    { name: "Игрок 2", score: 0, emoji: "🦊" },
  ]);
  const [showPlayers, setShowPlayers] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editScore, setEditScore] = useState("");

  // Score award modal
  const [awardModal, setAwardModal] = useState<{ personId: number } | null>(null);
  const [awardPts, setAwardPts] = useState("5");
  const [awardPlayerIdx, setAwardPlayerIdx] = useState(0);
  const [scorePopup, setScorePopup] = useState<string | null>(null);

  const revealName = (id: number) => {
    sounds.reveal();
    setPeople(prev => prev.map(p => p.id === id ? { ...p, nameRevealed: true } : p));
  };

  const openAward = (personId: number) => {
    setAwardModal({ personId });
    setAwardPts("5");
    setAwardPlayerIdx(0);
  };

  const confirmAward = () => {
    const pts = parseInt(awardPts) || 0;
    if (pts > 0) {
      sounds.correct();
      setPlayers(prev => prev.map((p, i) => i === awardPlayerIdx ? { ...p, score: p.score + pts } : p));
      setScorePopup(`+${pts} очков → ${players[awardPlayerIdx]?.name}!`);
      setConfetti(true);
      setTimeout(() => { setScorePopup(null); setConfetti(false); }, 2000);
    }
    setAwardModal(null);
  };

  const addPlayer = () => {
    if (players.length >= 8) return;
    sounds.click();
    const emoji = PLAYER_EMOJIS[players.length] || "🎮";
    setPlayers(prev => [...prev, { name: `Игрок ${prev.length + 1}`, score: 0, emoji }]);
  };

  const removePlayer = (idx: number) => {
    sounds.click();
    setPlayers(prev => prev.filter((_, i) => i !== idx));
    if (awardPlayerIdx >= idx && awardPlayerIdx > 0) setAwardPlayerIdx(prev => prev - 1);
  };

  const startEditPlayer = (idx: number) => {
    setEditingIdx(idx);
    setEditName(players[idx].name);
    setEditScore(String(players[idx].score));
  };

  const saveEditPlayer = () => {
    if (editingIdx === null) return;
    setPlayers(prev => prev.map((p, i) =>
      i === editingIdx
        ? { ...p, name: editName.trim() || p.name, score: parseInt(editScore) || 0 }
        : p
    ));
    setEditingIdx(null);
  };

  const revealedCount = people.filter(p => p.nameRevealed).length;

  return (
    <div className="max-w-3xl mx-auto">
      <Confetti active={confetti} />

      {/* Score popup */}
      {scorePopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none text-center">
          <div className="font-pacifico text-5xl neon-yellow animate-bounce-in">{scorePopup}</div>
        </div>
      )}

      {/* Award modal */}
      {awardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="card-party p-8 max-w-sm w-full mx-4 animate-bounce-in">
            <h3 className="font-pacifico text-2xl neon-yellow text-center mb-6">Начислить очки</h3>

            <div className="mb-4">
              <div className="text-white/50 font-montserrat text-xs uppercase tracking-widest mb-2">Игрок</div>
              <div className="grid grid-cols-2 gap-2">
                {players.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setAwardPlayerIdx(i)}
                    className={`flex items-center gap-2 p-3 rounded-xl transition-all font-montserrat text-sm font-semibold ${
                      i === awardPlayerIdx ? "bg-party-pink/40 ring-1 ring-party-pink text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                  >
                    <span>{p.emoji}</span> {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-white/50 font-montserrat text-xs uppercase tracking-widest mb-2">Очки</div>
              <div className="flex gap-2">
                {[1, 3, 5, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setAwardPts(String(n))}
                    className={`flex-1 py-2 rounded-xl font-montserrat font-bold transition-all ${
                      awardPts === String(n) ? "bg-party-yellow text-black" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <input
                  type="number"
                  value={awardPts}
                  onChange={e => setAwardPts(e.target.value)}
                  className="w-16 bg-white/10 text-white font-montserrat font-bold text-center rounded-xl border border-white/20 focus:border-party-pink outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="btn-party btn-success" onClick={confirmAward}>
                <Icon name="Check" size={18} /> Начислить
              </button>
              <button
                className="btn-party"
                style={{ background: "rgba(255,255,255,0.1)" }}
                onClick={() => setAwardModal(null)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-pacifico text-4xl neon-pink">Угадай кто!</h2>
          <p className="text-white/50 font-montserrat text-sm mt-1">
            открыто {revealedCount} из {people.length}
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
            <span className="font-montserrat font-bold text-white text-sm uppercase tracking-widest">Игроки и очки</span>
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
                        placeholder="Имя"
                        className="flex-1 bg-white/10 text-white font-montserrat text-sm rounded-lg px-3 py-2 outline-none border border-white/20 focus:border-party-pink"
                      />
                      <input
                        type="number"
                        value={editScore}
                        onChange={e => setEditScore(e.target.value)}
                        placeholder="Очки"
                        className="w-20 bg-white/10 text-white font-montserrat text-sm rounded-lg px-3 py-2 outline-none border border-white/20 focus:border-party-yellow text-center"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-party btn-success flex-1 text-xs" style={{ padding: "0.4rem" }} onClick={saveEditPlayer}>
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
                    <button onClick={() => startEditPlayer(i)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
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

      {/* All cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {people.map(person => (
          <div
            key={person.id}
            className={`card-party p-4 text-center transition-all duration-300 ${
              person.nameRevealed ? "ring-1 ring-party-green/50" : "hover:scale-[1.02] hover:ring-1 hover:ring-white/20"
            }`}
          >
            <div className="text-3xl mb-2">{person.emoji}</div>
            <div className="font-montserrat text-white text-sm font-semibold leading-snug mb-3">
              {person.association}
            </div>

            {person.nameRevealed ? (
              <>
                <div className="font-pacifico text-base neon-yellow mb-3 animate-bounce-in">
                  {person.name}
                </div>
                <button
                  onClick={() => openAward(person.id)}
                  className="btn-party w-full text-xs"
                  style={{ padding: "0.4rem 0.75rem", background: "linear-gradient(135deg,#FFD700,#FF8F00)", color: "#1a0030" }}
                >
                  <Icon name="Star" size={12} /> +очки
                </button>
              </>
            ) : (
              <button
                onClick={() => revealName(person.id)}
                className="btn-party w-full text-xs"
                style={{ padding: "0.4rem 0.75rem", background: "linear-gradient(135deg,#7B2FFF,#00E5FF)" }}
              >
                <Icon name="Eye" size={12} /> Открыть
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Scoreboard at bottom */}
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
