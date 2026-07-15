import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Crown,
  Gift,
  Heart,
  Lock,
  Mic,
  MicOff,
  Music2,
  Send,
  Settings,
  Shield,
  SkipForward,
  Sparkles,
  Square,
  Unlock,
  UserMinus,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { Player, Room, Song, UserProfile } from '../types';
import avatar07 from '../assets/avatars/avatar_07.jpg';
import avatar22 from '../assets/avatars/avatar_22.jpg';
import avatar26 from '../assets/avatars/avatar_26.jpg';

interface MultiMicRoomProps {
  key?: string;
  room: Room;
  user: UserProfile;
  onClose: () => void;
}

type SeatStatus = 'empty' | 'listening' | 'queued' | 'singing';
type RoomRole = '房主' | '管理员' | '普通';

interface RoomPlayer extends Player {
  role: RoomRole;
  level: number;
  followers: number;
  isMe?: boolean;
}

interface MicSeat {
  id: number;
  locked: boolean;
  muted: boolean;
  status: SeatStatus;
  player?: RoomPlayer;
}

interface ChatItem {
  id: number;
  sender: string;
  text: string;
  type: 'chat' | 'system' | 'enter';
}

const fallbackSong: Song = {
  id: 'room-song-fallback',
  title: '雨后星河',
  artist: 'StarRoom Band',
  duration: 196,
  lyrics: ['晚风吹过闪亮的街口', '把心跳唱给夜空听', '下一句由你接上旋律', '让房间一起亮起来']
};

const visitorPool: RoomPlayer[] = [
  {
    name: 'Nana',
    avatarUrl: avatar22,
    role: '普通',
    level: 18,
    followers: 4200
  },
  {
    name: 'Echo',
    avatarUrl: avatar07,
    role: '普通',
    level: 16,
    followers: 3100
  },
  {
    name: 'Mika',
    avatarUrl: avatar26,
    role: '普通',
    level: 21,
    followers: 6800
  }
];

const coverThemes = [
  'from-fuchsia-500/36 via-purple-700/52 to-indigo-950',
  'from-cyan-400/34 via-blue-700/50 to-violet-950',
  'from-rose-400/34 via-pink-700/48 to-purple-950',
  'from-emerald-300/30 via-teal-700/44 to-blue-950'
];

const giftOptions = [
  { name: '星光', price: 19, icon: '✦' },
  { name: '爱心', price: 66, icon: '♥' },
  { name: '皇冠', price: 188, icon: '♛' }
];

const buildRoomPlayers = (room: Room, user: UserProfile): RoomPlayer[] => {
  const sourcePlayers = room.players.length > 0 ? room.players : visitorPool;
  return [
    {
      ...sourcePlayers[0],
      role: '房主',
      level: 32,
      followers: 12800
    },
    {
      ...(sourcePlayers[1] ?? visitorPool[0]),
      role: '管理员',
      level: 24,
      followers: 7600
    },
    {
      ...(sourcePlayers[2] ?? visitorPool[1]),
      role: '普通',
      level: 19,
      followers: 5300
    },
    {
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: '普通',
      level: user.level,
      followers: 3425,
      isMe: true
    }
  ];
};

const makeInitialSeats = (room: Room, user: UserProfile, count: 4 | 6 | 8): MicSeat[] => {
  const players = buildRoomPlayers(room, user);
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    locked: index === count - 1,
    muted: false,
    status: index === 0 ? 'singing' : index < 3 ? 'listening' : 'empty',
    player: index < 3 ? players[index] : undefined
  }));
};

export default function MultiMicRoom({ room, user, onClose }: MultiMicRoomProps) {
  const initialMicCount = room.micCount ?? 6;
  const initialSong = room.songs[0] ?? fallbackSong;
  const [roomName, setRoomName] = useState(room.title);
  const [announcement, setAnnouncement] = useState(room.announcement ?? '欢迎来到房间，文明聊天，轮流上麦。');
  const [micCount, setMicCount] = useState<4 | 6 | 8>(initialMicCount);
  const [theme, setTheme] = useState(room.coverTheme ?? coverThemes[0]);
  const [seats, setSeats] = useState<MicSeat[]>(() => makeInitialSeats(room, user, initialMicCount));
  const [selectedSeat, setSelectedSeat] = useState<MicSeat | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [listening, setListening] = useState(true);
  const [songQueue, setSongQueue] = useState<Song[]>(() => room.songs.slice(1));
  const [currentSong, setCurrentSong] = useState<Song>(initialSong);
  const [singingActive, setSingingActive] = useState(true);
  const [lyricIndex, setLyricIndex] = useState(0);
  const [score, setScore] = useState(92);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [coins, setCoins] = useState(user.diamonds);
  const [toast, setToast] = useState('');
  const [giftTargetSeatId, setGiftTargetSeatId] = useState(1);
  const [effects, setEffects] = useState<Array<{ id: number; text: string }>>([]);
  const [chats, setChats] = useState<ChatItem[]>([
    { id: 1, sender: 'System', text: `${user.name} 进入房间`, type: 'enter' },
    { id: 2, sender: 'System', text: '房间音频已连接', type: 'system' },
    { id: 3, sender: 'Echo', text: '下一首谁来合唱？', type: 'chat' }
  ]);

  const selfSeat = seats.find((seat) => seat.player?.isMe);
  const singerSeat = seats.find((seat) => seat.status === 'singing' && seat.player) ?? seats.find((seat) => seat.player);
  const singer = singerSeat?.player;
  const activeLyrics = useMemo(() => {
    const lines = currentSong.lyrics.length > 0 ? currentSong.lyrics : fallbackSong.lyrics;
    return [
      lines[lyricIndex % lines.length],
      lines[(lyricIndex + 1) % lines.length],
      lines[(lyricIndex + 2) % lines.length]
    ];
  }, [currentSong.lyrics, lyricIndex]);

  useEffect(() => {
    if (!singingActive) return undefined;

    const timer = window.setInterval(() => {
      setLyricIndex((prev) => prev + 1);
      setScore((prev) => Math.min(100, prev + (prev > 96 ? -3 : 1)));
    }, 2300);

    return () => window.clearInterval(timer);
  }, [singingActive]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(''), 1500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addMessage = (sender: string, text: string, type: ChatItem['type'] = 'system') => {
    setChats((items) => [...items.slice(-8), { id: Date.now(), sender, text, type }]);
  };

  const showToast = (message: string) => {
    setToast(message);
  };

  const updateSeat = (seatId: number, updater: (seat: MicSeat) => MicSeat) => {
    setSeats((items) => items.map((seat) => (seat.id === seatId ? updater(seat) : seat)));
    setSelectedSeat((seat) => (seat?.id === seatId ? updater(seat) : seat));
  };

  const joinSeat = (seatId: number) => {
    const target = seats.find((seat) => seat.id === seatId);
    if (!target || target.locked) {
      showToast('麦位已锁');
      return;
    }

    setSeats((items) => items.map((seat) => {
      if (seat.player?.isMe) {
        return { ...seat, player: undefined, status: 'empty', muted: false };
      }
      if (seat.id === seatId) {
        return {
          ...seat,
          player: {
            name: user.name,
            avatarUrl: user.avatarUrl,
            role: '普通',
            level: user.level,
            followers: 3425,
            isMe: true
          },
          status: 'queued',
          muted: false
        };
      }
      return seat;
    }));
    addMessage('System', `${user.name} 上了 ${seatId} 麦`);
    showToast(selfSeat ? '已换麦' : '已上麦');
  };

  const leaveMic = () => {
    if (!selfSeat) {
      showToast('当前不在麦上');
      return;
    }

    updateSeat(selfSeat.id, (seat) => ({ ...seat, player: undefined, status: 'empty', muted: false }));
    addMessage('System', `${user.name} 下麦`);
  };

  const toggleSelfMute = () => {
    if (!selfSeat) {
      showToast('先上麦后开麦');
      return;
    }

    updateSeat(selfSeat.id, (seat) => ({ ...seat, muted: !seat.muted }));
    showToast(selfSeat.muted ? '麦克风已打开' : '麦克风已关闭');
  };

  const applyMic = () => {
    const freeSeat = seats.find((seat) => !seat.player && !seat.locked);
    if (!freeSeat) {
      showToast('暂无空麦');
      return;
    }

    addMessage('System', `${user.name} 申请上麦，房主已同意`);
    joinSeat(freeSeat.id);
  };

  const inviteToSeat = (seatId: number) => {
    const guest = visitorPool[(Date.now() + seatId) % visitorPool.length];
    updateSeat(seatId, (seat) => ({
      ...seat,
      player: guest,
      status: 'listening',
      muted: false
    }));
    addMessage('System', `已邀请 ${guest.name} 上 ${seatId} 麦`);
    showToast('邀请已发送');
  };

  const toggleSeatLock = (seatId: number) => {
    updateSeat(seatId, (seat) => ({
      ...seat,
      locked: !seat.locked,
      player: seat.locked ? seat.player : undefined,
      status: seat.locked ? seat.status : 'empty'
    }));
    showToast('麦位状态已更新');
  };

  const kickSeat = (seatId: number) => {
    const target = seats.find((seat) => seat.id === seatId);
    if (!target?.player) return;

    updateSeat(seatId, (seat) => ({ ...seat, player: undefined, status: 'empty', muted: false }));
    addMessage('System', `${target.player.name} 被请下麦`);
  };

  const toggleSeatMute = (seatId: number) => {
    updateSeat(seatId, (seat) => ({ ...seat, muted: !seat.muted }));
    showToast('禁麦状态已更新');
  };

  const startSinging = () => {
    if (!selfSeat) {
      applyMic();
      return;
    }

    setSeats((items) => items.map((seat) => ({
      ...seat,
      status: seat.id === selfSeat.id ? 'singing' : seat.player ? 'listening' : seat.status
    })));
    setSingingActive(true);
    addMessage('System', `${user.name} 开始演唱 ${currentSong.title}`);
  };

  const requestSong = () => {
    const candidate = room.songs[(songQueue.length + 1) % Math.max(room.songs.length, 1)] ?? fallbackSong;
    setSongQueue((items) => [...items, candidate]);
    addMessage(user.name, `点了 ${candidate.title}`, 'chat');
    showToast('已加入歌单');
  };

  const skipSong = () => {
    const nextSong = songQueue[0] ?? room.songs[0] ?? fallbackSong;
    setCurrentSong(nextSong);
    setSongQueue((items) => items.slice(1));
    setLyricIndex(0);
    setScore(88);
    setSingingActive(true);
    addMessage('System', `切到 ${nextSong.title}`);
  };

  const endSinging = () => {
    setSingingActive(false);
    addMessage('System', `演唱结束，评分 ${score}`);
  };

  const sendChat = (event: React.FormEvent) => {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    addMessage(user.name, text, 'chat');
    setChatInput('');
  };

  const followPlayer = (player: RoomPlayer) => {
    setFollowed((items) => {
      const next = new Set(items);
      next.add(player.name);
      return next;
    });
    showToast(`已关注 ${player.name}`);
  };

  const sendGift = (gift: typeof giftOptions[number]) => {
    const target = seats.find((seat) => seat.id === giftTargetSeatId)?.player ?? singer;
    if (!target) {
      showToast('请选择礼物对象');
      return;
    }

    setCoins((prev) => Math.max(0, prev - gift.price));
    setEffects((items) => [...items, { id: Date.now(), text: `${gift.icon} ${gift.name}` }]);
    addMessage(user.name, `送给 ${target.name} ${gift.name}`, 'chat');
    showToast(`送出 ${gift.name}`);
  };

  const applyMicCount = (count: 4 | 6 | 8) => {
    setMicCount(count);
    setSeats((items) => {
      const next = Array.from({ length: count }, (_, index) => {
        const existing = items[index];
        return existing ?? {
          id: index + 1,
          locked: false,
          muted: false,
          status: 'empty' as SeatStatus
        };
      });
      return next;
    });
  };

  return (
    <div id="multi-mic-room" className="absolute inset-0 z-50 overflow-hidden bg-[#050514] text-white select-none">
      <div className={`absolute inset-0 bg-gradient-to-br ${theme}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_12%,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_82%_28%,rgba(34,211,238,0.18),transparent_24%),linear-gradient(180deg,rgba(5,5,20,0.12),#050514_76%)]" />

      <header className="relative z-20 flex items-start justify-between px-4 pt-10">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/28 text-white backdrop-blur-md"
          aria-label="返回"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>

        <div className="min-w-0 flex-1 px-3 text-center">
          <h1 className="truncate font-display text-lg font-black text-white">{roomName}</h1>
          <div className="mt-1 flex items-center justify-center gap-2 text-[0.66rem] font-bold text-white/70">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {room.onlineCount + seats.filter((seat) => seat.player).length}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{micCount} 麦房</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{selfSeat ? '麦上' : '旁听'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setManageOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/28 text-white backdrop-blur-md"
          aria-label="管理"
        >
          <Settings className="h-4.5 w-4.5" />
        </button>
      </header>

      <main className="relative z-10 flex h-full flex-col px-4 pb-[6.15rem] pt-3">
        <div className="rounded-2xl border border-white/10 bg-black/24 px-3 py-2 text-[0.68rem] font-semibold text-white/72 backdrop-blur-md">
          {announcement}
        </div>

        <section className="mt-3 rounded-3xl border border-white/10 bg-black/24 p-4 shadow-[0_18px_34px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.62rem] font-black uppercase tracking-wide text-cyan-100/64">
                {singingActive ? '正在演唱' : '演唱已结束'}
              </p>
              <h2 className="mt-1 truncate font-display text-base font-black text-white">{currentSong.title}</h2>
              <p className="truncate text-[0.68rem] font-semibold text-white/48">{currentSong.artist}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
                <p className="font-mono text-lg font-black text-cyan-100">{score}</p>
                <p className="text-[0.52rem] font-black uppercase text-white/44">score</p>
              </div>
              {singer && (
                <img src={singer.avatarUrl} alt={singer.name} className="h-11 w-11 rounded-2xl object-cover" referrerPolicy="no-referrer" />
              )}
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {activeLyrics.map((line, index) => (
              <p
                key={`${line}-${index}`}
                className={`truncate font-display font-extrabold leading-tight ${index === 0 ? 'text-sm text-cyan-100' : 'text-xs text-white/50'}`}
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <button type="button" onClick={requestSong} className="flex h-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <Music2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={startSinging} className="flex h-10 items-center justify-center rounded-xl bg-cyan-400 text-[#07111f]">
              <Mic className="h-4 w-4" />
            </button>
            <button type="button" onClick={skipSong} className="flex h-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <SkipForward className="h-4 w-4" />
            </button>
            <button type="button" onClick={endSinging} className="flex h-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <Square className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-3 grid flex-1 grid-cols-2 gap-2 overflow-y-auto pb-2 scrollbar-none">
          {seats.map((seat) => (
            <motion.button
              key={seat.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSeat(seat)}
              className={`relative min-h-[4.75rem] rounded-2xl border p-2 text-left ${
                seat.locked
                  ? 'border-white/8 bg-black/24 text-white/38'
                  : seat.status === 'singing'
                    ? 'border-cyan-300/60 bg-cyan-400/14 shadow-[0_0_22px_rgba(34,211,238,0.22)]'
                    : 'border-white/10 bg-black/22'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1.5 text-[0.58rem] font-black text-white/74">
                  {seat.id}
                </span>
                <span className="flex items-center gap-1 text-[0.54rem] font-black text-white/46">
                  {seat.locked ? <Lock className="h-3 w-3" /> : seat.muted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                  {seat.locked ? '锁麦' : seat.status === 'singing' ? '唱歌' : seat.player ? '麦上' : '空麦'}
                </span>
              </div>

              {seat.player ? (
                <div className="mt-2 flex items-center gap-2">
                  <img src={seat.player.avatarUrl} alt={seat.player.name} className="h-9 w-9 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <p className="truncate font-display text-xs font-black text-white">{seat.player.isMe ? '我' : seat.player.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[0.55rem] font-bold text-white/44">
                      {seat.player.role === '房主' && <Crown className="h-3 w-3 text-amber-300" />}
                      {seat.player.role === '管理员' && <Shield className="h-3 w-3 text-cyan-300" />}
                      {seat.player.role}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-[0.66rem] font-bold text-white/46">
                  {seat.locked ? <Lock className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {seat.locked ? '不可上麦' : '点击上麦'}
                </div>
              )}
            </motion.button>
          ))}
        </section>
      </main>

      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/8 bg-[#09091d]/92 px-4 pb-7 pt-2 backdrop-blur-md">
        <div className="grid grid-cols-5 gap-2">
          <button type="button" onClick={() => setListening((prev) => !prev)} className="flex h-10 items-center justify-center rounded-xl bg-white/8">
            {listening ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
          </button>
          <button type="button" onClick={selfSeat ? leaveMic : applyMic} className="flex h-10 items-center justify-center rounded-xl bg-white/8">
            {selfSeat ? <UserMinus className="h-4.5 w-4.5" /> : <UserPlus className="h-4.5 w-4.5" />}
          </button>
          <button type="button" onClick={toggleSelfMute} className="flex h-10 items-center justify-center rounded-xl bg-white/8">
            {selfSeat?.muted ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
          </button>
          <button type="button" onClick={() => setChatOpen(true)} className="flex h-10 items-center justify-center rounded-xl bg-white/8">
            <Send className="h-4.5 w-4.5" />
          </button>
          <button type="button" onClick={() => setGiftOpen(true)} className="flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white">
            <Gift className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
        <AnimatePresence>
          {effects.map((effect) => (
            <motion.div
              key={effect.id}
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1.1, 1, 1.2], y: -150 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8 }}
              onAnimationComplete={() => setEffects((items) => items.filter((item) => item.id !== effect.id))}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-white/12 px-5 py-3 font-display text-xl font-black text-white shadow-[0_0_30px_rgba(236,72,153,0.4)] backdrop-blur-md"
            >
              {effect.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute left-1/2 top-[13%] z-50 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white backdrop-blur-md"
          >
            {toast}
          </motion.div>
        )}

        {selectedSeat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end bg-black/40"
            onClick={() => setSelectedSeat(null)}
          >
            <motion.div
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              exit={{ y: 120 }}
              className="w-full rounded-t-3xl border border-white/10 bg-[#0c0828] p-4 pb-7"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-black">麦位 {selectedSeat.id}</h2>
                <button type="button" onClick={() => setSelectedSeat(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {selectedSeat.player ? (
                <div className="mt-4 flex items-center gap-3">
                  <img src={selectedSeat.player.avatarUrl} alt={selectedSeat.player.name} className="h-14 w-14 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base font-black">{selectedSeat.player.isMe ? user.name : selectedSeat.player.name}</p>
                    <p className="text-xs font-semibold text-white/45">Lv.{selectedSeat.player.level} · {selectedSeat.player.followers.toLocaleString()} followers</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => followPlayer(selectedSeat.player!)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 text-[#07111f]"
                  >
                    {followed.has(selectedSeat.player.name) ? <CheckCircle2 className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                  </button>
                </div>
              ) : (
                <p className="mt-4 rounded-2xl bg-white/7 px-3 py-3 text-sm font-semibold text-white/64">
                  {selectedSeat.locked ? '这个麦位已锁定' : '这个麦位当前空闲'}
                </p>
              )}

              <div className="mt-4 grid grid-cols-3 gap-2">
                {!selectedSeat.player && !selectedSeat.locked && (
                  <>
                    <button type="button" onClick={() => joinSeat(selectedSeat.id)} className="rounded-xl bg-cyan-400 px-2 py-2 text-xs font-black text-[#07111f]">上麦</button>
                    <button type="button" onClick={() => inviteToSeat(selectedSeat.id)} className="rounded-xl bg-white/10 px-2 py-2 text-xs font-black">邀请</button>
                  </>
                )}
                {selectedSeat.player?.isMe && (
                  <>
                    <button type="button" onClick={leaveMic} className="rounded-xl bg-white/10 px-2 py-2 text-xs font-black">下麦</button>
                    <button type="button" onClick={toggleSelfMute} className="rounded-xl bg-white/10 px-2 py-2 text-xs font-black">{selectedSeat.muted ? '开麦' : '闭麦'}</button>
                  </>
                )}
                {selectedSeat.player && !selectedSeat.player.isMe && (
                  <>
                    <button type="button" onClick={() => toggleSeatMute(selectedSeat.id)} className="rounded-xl bg-white/10 px-2 py-2 text-xs font-black">禁麦</button>
                    <button type="button" onClick={() => kickSeat(selectedSeat.id)} className="rounded-xl bg-white/10 px-2 py-2 text-xs font-black">踢下麦</button>
                    <button type="button" onClick={() => { setGiftTargetSeatId(selectedSeat.id); setGiftOpen(true); }} className="rounded-xl bg-fuchsia-500 px-2 py-2 text-xs font-black">送礼</button>
                  </>
                )}
                <button type="button" onClick={() => toggleSeatLock(selectedSeat.id)} className="rounded-xl bg-white/10 px-2 py-2 text-xs font-black">
                  {selectedSeat.locked ? '解锁' : '锁麦'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end bg-black/40"
            onClick={() => setChatOpen(false)}
          >
            <motion.form
              onSubmit={sendChat}
              initial={{ y: 130 }}
              animate={{ y: 0 }}
              exit={{ y: 130 }}
              className="w-full rounded-t-3xl border border-white/10 bg-[#0c0828] p-4 pb-7"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-black">公屏</h2>
                <button type="button" onClick={() => setChatOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 max-h-48 space-y-2 overflow-y-auto scrollbar-none">
                {chats.map((chat) => (
                  <p key={chat.id} className={`text-xs font-semibold ${chat.type === 'chat' ? 'text-white/78' : 'text-cyan-100/58'}`}>
                    <span className="font-black text-white">{chat.sender}:</span> {chat.text}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white outline-none"
                  placeholder="说点什么"
                />
                <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-[#07111f]">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}

        {giftOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end bg-black/40"
            onClick={() => setGiftOpen(false)}
          >
            <motion.div
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              exit={{ y: 120 }}
              className="w-full rounded-t-3xl border border-white/10 bg-[#0c0828] p-4 pb-7"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-black">送礼</h2>
                <span className="text-xs font-bold text-cyan-100/70">{coins.toLocaleString()} diamonds</span>
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {seats.filter((seat) => seat.player).map((seat) => (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => setGiftTargetSeatId(seat.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 ${giftTargetSeatId === seat.id ? 'border-cyan-300 bg-cyan-400/14' : 'border-white/10 bg-white/6'}`}
                  >
                    <img src={seat.player!.avatarUrl} alt={seat.player!.name} className="h-7 w-7 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <span className="text-xs font-black">{seat.player!.isMe ? '我' : seat.player!.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {giftOptions.map((gift) => (
                  <button
                    key={gift.name}
                    type="button"
                    onClick={() => sendGift(gift)}
                    className="rounded-2xl border border-white/10 bg-white/8 px-2 py-4 text-center"
                  >
                    <span className="text-2xl">{gift.icon}</span>
                    <span className="mt-2 block text-xs font-black">{gift.name}</span>
                    <span className="mt-1 block text-[0.62rem] font-bold text-white/46">{gift.price}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {manageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end bg-black/40"
            onClick={() => setManageOpen(false)}
          >
            <motion.div
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              exit={{ y: 150 }}
              className="w-full rounded-t-3xl border border-white/10 bg-[#0c0828] p-4 pb-7"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-black">房间管理</h2>
                <button type="button" onClick={() => setManageOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <label className="mt-4 block text-[0.62rem] font-black uppercase tracking-wide text-white/42">房名</label>
              <input
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-white outline-none"
              />

              <label className="mt-3 block text-[0.62rem] font-black uppercase tracking-wide text-white/42">公告</label>
              <textarea
                value={announcement}
                onChange={(event) => setAnnouncement(event.target.value)}
                className="mt-2 h-20 w-full resize-none rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-white outline-none"
              />

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[4, 6, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => applyMicCount(count as 4 | 6 | 8)}
                    className={`rounded-xl px-3 py-2 text-xs font-black ${micCount === count ? 'bg-cyan-400 text-[#07111f]' : 'bg-white/10 text-white'}`}
                  >
                    {count} 麦
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {coverThemes.map((coverTheme) => (
                  <button
                    key={coverTheme}
                    type="button"
                    onClick={() => setTheme(coverTheme)}
                    className={`h-10 rounded-xl border bg-gradient-to-br ${coverTheme} ${theme === coverTheme ? 'border-white' : 'border-white/10'}`}
                    aria-label="封面主题"
                  />
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => showToast('已开启管理员模式')} className="rounded-xl bg-white/10 px-2 py-2 text-xs font-black">
                  <Shield className="mx-auto h-4 w-4" />
                </button>
                <button type="button" onClick={() => seats[0] && toggleSeatLock(seats[0].id)} className="rounded-xl bg-white/10 px-2 py-2 text-xs font-black">
                  {seats[0]?.locked ? <Unlock className="mx-auto h-4 w-4" /> : <Lock className="mx-auto h-4 w-4" />}
                </button>
                <button type="button" onClick={() => seats[1] && toggleSeatMute(seats[1].id)} className="rounded-xl bg-white/10 px-2 py-2 text-xs font-black">
                  <Ban className="mx-auto h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sparkles className="pointer-events-none absolute right-6 top-28 h-4 w-4 text-cyan-100/40" />
    </div>
  );
}
