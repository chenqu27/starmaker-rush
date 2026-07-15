import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Crown, Disc3, Gem, Heart, Music, Music2, Plus, Star, Trophy } from 'lucide-react';
import { sampleRecordings, sampleRooms } from '../data';
import { UserProfile } from '../types';

interface MeTabProps {
  user: UserProfile;
  onOpenShop: (type: 'coins' | 'diamonds') => void;
}

type ProfileTab = 'records' | 'identity';

const extraGamePlayers = [
  { name: 'Nova', avatarUrl: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&q=80&w=100' },
  { name: 'Kai', avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100' }
];

export default function MeTab({ user, onOpenShop }: MeTabProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('records');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const gameRecords = useMemo(() => {
    return sampleRecordings.map((record, index) => {
      const room = sampleRooms[index % sampleRooms.length];
      const players = [
        { name: user.name, avatarUrl: user.avatarUrl, isMe: true },
        ...room.players,
        ...extraGamePlayers
      ];

      return {
        ...record,
        playlistName: room.title,
        roomName: room.subtitle,
        playedAt: index === 0 ? 'Today 21:18' : index === 1 ? 'Yesterday 20:43' : 'Jul 12 22:05',
        players,
        totalScore: [9860, 8720, 7940][index] ?? 7200,
        round: [8, 7, 6][index] ?? 6,
        rank: index + 1,
        buzzes: [12, 9, 7][index] ?? 6,
        successes: [8, 6, 5][index] ?? 4,
        scoreboard: players.map((player, playerIndex) => ({
          player,
          buzzes: Math.max(2, [12, 10, 8, 6, 5, 4][playerIndex] - index),
          successes: Math.max(1, [8, 7, 5, 4, 3, 2][playerIndex] - index)
        }))
      };
    });
  }, [user.avatarUrl, user.name]);

  const selectedRecord = gameRecords.find((record) => record.id === selectedRecordId);

  const identityStats = [
    { category: 'Pop', percent: 100, tone: 'from-purple-400 via-fuchsia-400 to-pink-400', iconTone: 'border-fuchsia-300/30 bg-fuchsia-400/12 text-fuchsia-200', icon: Star },
    { category: 'Love Songs', percent: 72, tone: 'from-pink-400 to-rose-300', iconTone: 'border-pink-300/28 bg-pink-400/10 text-pink-200', icon: Heart },
    { category: 'Dance', percent: 54, tone: 'from-cyan-300 to-blue-400', iconTone: 'border-cyan-300/28 bg-cyan-400/10 text-cyan-200', icon: Music2 }
  ];

  return (
    <div id="me-tab-container" className="relative flex h-full flex-1 flex-col overflow-y-auto bg-[#050514] p-4 pb-24 text-white scrollbar-none select-none">
      <section className="relative rounded-3xl border border-white/5 bg-gradient-to-b from-[#12122d]/50 to-transparent p-5 shadow">
        <button
          type="button"
          onClick={() => onOpenShop('diamonds')}
          className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full border border-purple-500/30 bg-[#12122d]/80 py-1 pl-1.5 pr-1 transition-colors hover:border-purple-500/60"
          aria-label="Open recharge shop"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-b from-purple-400 to-indigo-600 shadow-[0_0_5px_rgba(168,85,247,0.4)]">
            <Gem className="h-3 w-3 text-purple-100" />
          </div>
          <span className="pr-1 font-mono text-xs font-bold text-purple-300">
            {user.diamonds.toLocaleString()}
          </span>
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1e1e4a] transition-colors hover:bg-purple-500/20">
            <Plus className="h-2.5 w-2.5 text-purple-300" />
          </div>
        </button>

        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[3px] shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full rounded-full border border-black object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-lg font-extrabold text-white">{user.name}</h2>
            <p className="mt-1 text-xs font-bold text-gray-500">Game ID: SMK-834209</p>
            <p className="mt-2 text-xs font-semibold text-gray-400">Female · 23</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 border-t border-white/5 pt-4 text-center">
          <div>
            <p className="font-mono text-base font-extrabold text-white">3,425</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">Followers</p>
          </div>
          <div className="border-x border-white/5">
            <p className="font-mono text-base font-extrabold text-white">120</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">Following</p>
          </div>
          <div>
            <p className="font-mono text-base font-extrabold text-white">268</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">Gifts</p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 rounded-2xl border border-purple-300/12 bg-[#0c0b24]/38 shadow-[inset_0_0_18px_rgba(168,85,247,0.06)]">
        <button
          onClick={() => setActiveTab('records')}
          className={`relative px-3 pb-3 pt-2 text-xs font-black transition-colors ${activeTab === 'records' ? 'text-white' : 'text-gray-500'}`}
        >
          Game Records
          {activeTab === 'records' && (
            <span className="absolute bottom-0 left-1/2 h-0.5 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.45)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('identity')}
          className={`relative px-3 pb-3 pt-2 text-xs font-black transition-colors ${activeTab === 'identity' ? 'text-white' : 'text-gray-500'}`}
        >
          My Vibe
          {activeTab === 'identity' && (
            <span className="absolute bottom-0 left-1/2 h-0.5 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.45)]" />
          )}
        </button>
      </div>

      {activeTab === 'records' ? (
        <section className="mt-4 flex flex-col gap-2.5">
          {gameRecords.map((record) => (
            <button
              key={record.id}
              onClick={() => setSelectedRecordId(record.id)}
              className="rounded-2xl border border-white/5 bg-[#12122d]/55 p-3.5 text-left transition-all hover:border-purple-500/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-300">{record.playlistName}</p>
                  <p className="mt-1 text-[11px] font-semibold text-gray-500">{record.artist} · {record.playedAt}</p>
                </div>
                <ChevronRight className="mt-5 h-4 w-4 shrink-0 text-gray-500" />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex w-full items-center justify-between gap-2 pr-8">
                  {record.players.map((player) => (
                    <img
                      key={`${record.id}-${player.name}`}
                      src={player.avatarUrl}
                      alt={player.name}
                      className={`h-8 w-8 rounded-full border-2 object-cover ${player.isMe ? 'border-cyan-300' : 'border-purple-300/18'}`}
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </section>
      ) : (
        <section className="mt-4">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_16%_18%,rgba(236,72,153,0.26),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(168,85,247,0.22),transparent_30%),linear-gradient(145deg,rgba(25,14,55,0.94),rgba(76,29,104,0.5)_54%,rgba(10,16,42,0.9))] p-4 shadow-[0_0_34px_rgba(168,85,247,0.22),inset_0_0_28px_rgba(236,72,153,0.06)]">
            <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-purple-500/16 blur-2xl" />
            <div className="absolute -right-10 -top-8 h-32 w-32 rounded-full bg-fuchsia-500/18 blur-2xl" />

            <div className="relative flex items-center gap-4">
              <div className="relative flex h-[4.6rem] w-[4.6rem] shrink-0 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-[#0b0820] via-[#21133d] to-fuchsia-500/70 shadow-[inset_-10px_-12px_18px_rgba(0,0,0,0.34),0_0_26px_rgba(236,72,153,0.34)]">
                <Disc3 className="h-11 w-11 text-white/92 drop-shadow" />
                <Music className="absolute bottom-3 right-3 h-4 w-4 text-cyan-200 drop-shadow" />
                <Star className="absolute right-2 top-2 h-3.5 w-3.5 fill-amber-200 text-amber-200" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-2xl font-black leading-none tracking-wide text-white drop-shadow">
                  POP ACE
                </h3>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-300/24 bg-black/24 px-2.5 py-1 text-[10px] font-black tracking-wider text-amber-200 shadow-[0_0_14px_rgba(236,72,153,0.1)]">
                    <Star className="h-3 w-3 fill-current" />
                    42 GRABS
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/22 bg-cyan-300/12 px-2.5 py-1 text-[10px] font-black tracking-wider text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.1)]">
                    <Crown className="h-3 w-3 fill-current" />
                    TOP 12%
                  </span>
                </div>
              </div>
            </div>

            <div className="relative my-4 h-px bg-gradient-to-r from-transparent via-fuchsia-200/14 to-transparent" />

            <div className="relative flex flex-col">
            {identityStats.map((item, index) => (
              <div key={item.category}>
              <div
                className={`flex items-center gap-3 py-2.5 ${index === 0 ? 'opacity-100' : index === 1 ? 'opacity-88' : 'opacity-76'}`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-[0_0_18px_rgba(236,72,153,0.08)] ${item.iconTone}`}>
                  <item.icon className={`${item.category === 'Love Songs' ? 'fill-current' : ''} h-4.5 w-4.5`} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`${index === 0 ? 'text-sm text-white' : 'text-xs text-gray-300'} font-black`}>
                    {item.category}
                  </span>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-purple-950/55">
                    <div className={`h-full rounded-full bg-gradient-to-r ${item.tone}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              </div>
              {index < identityStats.length - 1 && (
                <div className="ml-12 h-px bg-fuchsia-200/[0.055]" />
              )}
              </div>
            ))}
            </div>
          </div>
        </section>
      )}

      {selectedRecord && (
        <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-[#050017]/96 px-4 pb-6 pt-[4.6rem] backdrop-blur-md">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(251,191,36,0.22),transparent_24%),radial-gradient(circle_at_18%_58%,rgba(236,72,153,0.24),transparent_28%),radial-gradient(circle_at_86%_70%,rgba(34,211,238,0.18),transparent_30%)]" />

          <button
            onClick={() => setSelectedRecordId(null)}
            className="relative z-10 mb-4 flex items-center gap-1 self-start text-xs font-black uppercase tracking-wider text-white/55"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="relative z-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-fuchsia-500 shadow-[0_0_28px_rgba(251,191,36,0.62)]">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <h2 className="mt-3 font-display text-xl font-black text-white">Game Results</h2>
            <p className="mt-1 text-[0.72rem] font-semibold text-white/50">
              {selectedRecord.playlistName} · Total score {selectedRecord.totalScore} · Round {selectedRecord.round}/8
            </p>
          </div>

          <div className="relative z-10 mt-5 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
            <div className="grid grid-cols-[1fr_3.2rem_3.2rem] px-3 text-[0.62rem] font-black uppercase tracking-wide text-white/42">
              <span>Player</span>
              <span className="text-center">Buzz</span>
              <span className="text-center">Success</span>
            </div>

            <div className="space-y-2 overflow-y-auto pb-2 scrollbar-none">
              {selectedRecord.scoreboard.map((item) => (
                <div
                  key={item.player.name}
                  className={`grid grid-cols-[1fr_3.2rem_3.2rem] items-center rounded-2xl border px-3 py-2 ${
                    item.player.isMe ? 'border-cyan-300/35 bg-cyan-300/12' : 'border-white/8 bg-white/7'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <img
                      src={item.player.avatarUrl}
                      alt={item.player.name}
                      className="h-9 w-9 rounded-full border border-white/20 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[0.78rem] font-black text-white">{item.player.name}</p>
                      <p className="text-[0.58rem] font-semibold text-white/38">
                        {item.player.isMe ? 'You' : `ID ${834200 + item.player.name.length * 17}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-center font-display text-lg font-black text-fuchsia-200">{item.buzzes}</span>
                  <span className="text-center font-display text-lg font-black text-cyan-200">{item.successes}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
