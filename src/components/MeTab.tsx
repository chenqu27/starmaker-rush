import { useMemo, useState } from 'react';
import { AudioWaveform, ChevronLeft, ChevronRight, Disc3, Gem, IdCard, Plus, Sparkles, Trophy } from 'lucide-react';
import { sampleRecordings, sampleRooms } from '../data';
import { UserProfile } from '../types';
import avatar20 from '../assets/avatars/avatar_20.jpg';
import avatar24 from '../assets/avatars/avatar_24.jpg';

interface MeTabProps {
  user: UserProfile;
  onOpenShop: (type: 'coins' | 'diamonds') => void;
}

type ProfileTab = 'records' | 'identity';

const extraGamePlayers = [
  { name: 'Nova', avatarUrl: avatar20 },
  { name: 'Kai', avatarUrl: avatar24 }
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
        <section className="mt-4 flex flex-col gap-2.5">
          <div className="relative overflow-hidden rounded-[1.25rem] border border-fuchsia-400/34 bg-[linear-gradient(100deg,rgba(87,23,103,0.58),rgba(16,16,46,0.74)_50%,rgba(8,10,31,0.84))] px-3.5 py-4 shadow-[0_0_22px_rgba(216,70,239,0.18),inset_0_0_20px_rgba(216,70,239,0.07)]">
            <div className="absolute left-0 top-0 h-full w-[42%] bg-[radial-gradient(circle_at_28%_50%,rgba(216,70,239,0.26),transparent_64%)]" />
            <div className="relative flex items-center gap-3.5">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-fuchsia-400/52 bg-fuchsia-400/8 shadow-[0_0_18px_rgba(216,70,239,0.18)]">
                <IdCard className="h-8 w-8 text-fuchsia-200" />
                <Sparkles className="absolute right-3 top-3 h-3 w-3 fill-white text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-fuchsia-300">音乐身份卡</p>
                <h3 className="mt-1.5 font-display text-[1.28rem] font-black leading-tight text-white">深夜情歌选手</h3>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.25rem] border border-blue-500/36 bg-[linear-gradient(105deg,rgba(10,45,101,0.58),rgba(8,13,41,0.86)_48%,rgba(8,10,31,0.9))] px-3.5 py-4 shadow-[0_0_20px_rgba(59,130,246,0.14),inset_0_0_18px_rgba(59,130,246,0.07)]">
            <div className="absolute left-3 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-blue-400/12 blur-xl" />
            <div className="relative flex items-center gap-3.5">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-blue-300/22 bg-[#0b1638] shadow-[0_0_16px_rgba(59,130,246,0.18)]">
                <div className="absolute h-12 w-12 rounded-full bg-[radial-gradient(circle_at_50%_50%,#050514_0_13%,#2b4e9b_14%_18%,#060818_19%_35%,#203d7a_36%_42%,#050514_43%_100%)] shadow-[inset_0_0_10px_rgba(255,255,255,0.08)]" />
                <Disc3 className="relative h-9 w-9 text-blue-200/88" />
                <div className="absolute right-2 top-3 h-7 w-1 rotate-[34deg] rounded-full bg-blue-100/70 shadow-[0_0_8px_rgba(191,219,254,0.28)]" />
                <div className="absolute right-3 top-8 h-2 w-2 rounded-full bg-blue-100/80" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-blue-300">本命歌曲</p>
                <h3 className="mt-1.5 truncate font-display text-[1.28rem] font-black leading-tight text-white">Perfect</h3>
                <p className="mt-0.5 text-sm font-semibold text-white/48">Ed Sheeran</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.25rem] border border-cyan-400/30 bg-[linear-gradient(105deg,rgba(13,88,91,0.42),rgba(7,18,35,0.88)_46%,rgba(7,12,30,0.92))] px-3.5 py-4 shadow-[0_0_20px_rgba(34,211,238,0.12),inset_0_0_18px_rgba(34,211,238,0.06)]">
            <div className="absolute left-0 top-0 h-full w-[42%] bg-[radial-gradient(circle_at_28%_50%,rgba(34,211,238,0.18),transparent_68%)]" />
            <div className="relative flex items-center gap-3.5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-cyan-400/42 bg-cyan-400/7 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.1)]">
                <AudioWaveform className="h-9 w-9" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-cyan-300">声音名片</p>
                <h3 className="mt-1.5 font-display text-[1.28rem] font-black leading-tight text-white">暖绒声线</h3>
              </div>
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
