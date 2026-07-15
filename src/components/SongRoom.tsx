import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  Gift,
  Heart,
  Menu,
  MessageCircle,
  Mic2,
  Send,
  SmilePlus,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { Room, RushDemoCommand, RushRoomPhase, Song, Player } from '../types';
import avatar05 from '../assets/avatars/avatar_05.jpg';
import avatar08 from '../assets/avatars/avatar_08.jpg';
import avatar16 from '../assets/avatars/avatar_16.jpg';
import avatar19 from '../assets/avatars/avatar_19.jpg';
import avatar33 from '../assets/avatars/avatar_33.jpg';
import avatar36 from '../assets/avatars/avatar_36.jpg';

interface SongRoomProps {
  key?: string;
  room: Room;
  song: Song;
  onClose: () => void;
  currentUserAvatar: string;
  demoCommand?: RushDemoCommand | null;
  onPhaseChange?: (phase: RushRoomPhase | null) => void;
}

interface SeatPlayer extends Player {
  seat: number;
}

type GrabWinner = 'me' | 'other' | null;
type SingerStage = 'hidden' | 'enter' | 'singing' | 'celebrate' | 'sad' | 'exit';

interface PlayerStat {
  buzzes: number;
  successes: number;
}

const fallbackPlayers: Player[] = [
  { name: 'Luna', avatarUrl: avatar05 },
  { name: 'Jay', avatarUrl: avatar33 },
  { name: 'Alex', avatarUrl: avatar19 },
  { name: 'Zoe', avatarUrl: avatar36 },
  { name: 'Mia', avatarUrl: avatar16 },
  { name: 'Leo', avatarUrl: avatar08 }
];

const seatPositions = [
  'left-[4%] top-[42.5%]',
  'right-[4%] top-[42.5%]',
  'left-[4%] top-[53%]',
  'right-[4%] top-[53%]',
  'left-[4%] top-[63.5%]',
  'right-[4%] top-[63.5%]'
];

const BUZZ_LOCK_SECONDS = 3;
const LYRIC_WINDOW_SECONDS = 9;
const SUBMIT_WINDOW_SECONDS = LYRIC_WINDOW_SECONDS * 2;
const TOTAL_ROUNDS = 12;

function SingingCharacter({ stage }: { stage: SingerStage }) {
  if (stage === 'hidden') return null;

  const isSinging = stage === 'singing';
  const isCelebrate = stage === 'celebrate';
  const isSad = stage === 'sad';

  return (
    <motion.div
      initial={{ x: -300, y: 10, opacity: 0, scale: 1.08 }}
      animate={
        stage === 'enter'
          ? { x: 0, y: 0, opacity: 1, scale: 1.08 }
          : stage === 'singing'
            ? { x: 0, y: [0, -5, 0], opacity: 1, scale: 1.08 }
            : stage === 'celebrate'
              ? { x: 0, y: [0, -28, 0, -20, 0], opacity: 1, scale: [1.08, 1.2, 1.08] }
              : stage === 'sad'
                ? { x: 0, y: [0, 7, 3, 9], opacity: 1, scale: 1.04 }
              : { x: 280, y: 4, opacity: 0, scale: 1.18 }
      }
      transition={
        stage === 'singing'
          ? { repeat: Infinity, duration: 0.9, ease: 'easeInOut' }
          : { duration: stage === 'celebrate' ? 0.9 : stage === 'sad' ? 1.2 : 1.4, ease: 'easeInOut' }
      }
      className="pointer-events-none absolute left-1/2 top-[38%] z-[25] h-56 w-40 -translate-x-1/2"
    >
      <motion.div
        animate={isCelebrate ? { rotate: [-4, 8, -6, 5, 0] } : isSad ? { rotate: [0, -6, 4, -3] } : isSinging ? { rotate: [-2, 2, -2] } : {}}
        transition={{ repeat: isSinging ? Infinity : 0, duration: 0.72 }}
        className="relative h-full w-full"
      >
        <div className="absolute left-1/2 top-0 h-[4.7rem] w-[4.7rem] -translate-x-1/2 rounded-full border-2 border-white/18 bg-gradient-to-br from-amber-100 via-pink-100 to-fuchsia-200 shadow-[0_0_18px_rgba(251,191,36,0.28)]">
          <div className="absolute left-5 top-8 h-2.5 w-2.5 rounded-full bg-[#1a1230]" />
          <div className="absolute right-5 top-8 h-2.5 w-2.5 rounded-full bg-[#1a1230]" />
          <motion.div
            animate={isSad ? { height: '0.18rem', width: '1.35rem' } : isSinging ? { height: ['0.25rem', '0.55rem', '0.25rem'] } : {}}
            transition={{ repeat: Infinity, duration: 0.42 }}
            className="absolute left-1/2 top-12 w-6 -translate-x-1/2 rounded-full bg-pink-500/70"
          />
        </div>

        <div className="absolute left-1/2 top-[4.25rem] h-[7.7rem] w-[5.5rem] -translate-x-1/2 rounded-[2rem] bg-gradient-to-br from-fuchsia-400 via-purple-500 to-cyan-400 shadow-[0_0_24px_rgba(236,72,153,0.38)]" />
        <motion.div
          animate={isCelebrate ? { rotate: [-35, -76, -35] } : isSad ? { rotate: [-55, -62, -55] } : isSinging ? { rotate: [-25, -12, -25] } : {}}
          transition={{ repeat: isSinging ? Infinity : 0, duration: 0.5 }}
          className="absolute left-4 top-[6.1rem] h-4 w-14 origin-right -rotate-[35deg] rounded-full bg-gradient-to-r from-pink-200 to-fuchsia-400"
        />
        <motion.div
          animate={isCelebrate ? { rotate: [35, 76, 35] } : isSad ? { rotate: [55, 62, 55] } : isSinging ? { rotate: [25, 12, 25] } : {}}
          transition={{ repeat: isSinging ? Infinity : 0, duration: 0.5 }}
          className="absolute right-4 top-[6.1rem] h-4 w-14 origin-left rotate-[35deg] rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
        />
        <motion.div
          animate={isSinging ? { rotate: [7, -8, 7] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute left-[3.55rem] top-[11.25rem] h-16 w-4 origin-top rounded-full bg-gradient-to-b from-fuchsia-300 to-purple-700"
        />
        <motion.div
          animate={isSinging ? { rotate: [-7, 8, -7] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute right-[3.55rem] top-[11.25rem] h-16 w-4 origin-top rounded-full bg-gradient-to-b from-cyan-300 to-blue-700"
        />
        <div className="absolute left-[2.65rem] bottom-1 h-3.5 w-10 rounded-full bg-fuchsia-300/90" />
        <div className="absolute right-[2.65rem] bottom-1 h-3.5 w-10 rounded-full bg-cyan-300/90" />

        {isSinging && (
          <div className="absolute -right-3 top-1 flex flex-col gap-1 text-cyan-100">
            <motion.span animate={{ opacity: [0, 1, 0], y: [-2, -18] }} transition={{ repeat: Infinity, duration: 0.9 }} className="text-sm">♪</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0], y: [-2, -16] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.28 }} className="text-xs text-fuchsia-200">♫</motion.span>
          </div>
        )}
        {isCelebrate && (
          <>
            <Sparkles className="absolute -right-1 top-2 h-5 w-5 fill-amber-200 text-amber-200" />
            <Sparkles className="absolute -left-2 top-8 h-4 w-4 fill-cyan-200 text-cyan-200" />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function SongRoom({ room, song, onClose, currentUserAvatar, demoCommand, onPhaseChange }: SongRoomProps) {
  const [phase, setPhase] = useState<RushRoomPhase>('live');
  const [demoHold, setDemoHold] = useState(false);
  const [readyCountdown, setReadyCountdown] = useState(60);
  const [buzzCountdown, setBuzzCountdown] = useState(BUZZ_LOCK_SECONDS);
  const [lyricWindowKey, setLyricWindowKey] = useState(0);
  const [lyricProgress, setLyricProgress] = useState(1);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(2);
  const [score, setScore] = useState(0);
  const [lastSuccess, setLastSuccess] = useState(true);
  const [grabWinner, setGrabWinner] = useState<GrabWinner>(null);
  const [continueCountdown, setContinueCountdown] = useState(5);
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerStat>>({});
  const [frozenLyricLines, setFrozenLyricLines] = useState<string[] | null>(null);
  const [toast, setToast] = useState('');
  const [successCardVisible, setSuccessCardVisible] = useState(false);
  const [singerStage, setSingerStage] = useState<SingerStage>('hidden');
  const [coins, setCoins] = useState(2860);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [muted, setMuted] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<SeatPlayer | null>(null);
  const [followedPlayers, setFollowedPlayers] = useState<Set<string>>(new Set());
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string }>>([]);
  const [chats, setChats] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'System', text: 'Game started. Tap BUZZ to grab the mic.' }
  ]);

  const players = useMemo<SeatPlayer[]>(() => {
    const merged = [
      ...room.players,
      { name: 'You', avatarUrl: currentUserAvatar },
      ...fallbackPlayers
    ];
    return merged.slice(0, 6).map((player, index) => ({
      ...player,
      seat: index + 1
    }));
  }, [room.players, currentUserAvatar]);

  const singer = players[(round + 1) % players.length];
  const scoreboard = players.map((player, index) => {
    const stat = playerStats[player.name] ?? {
      buzzes: player.name === 'You' ? 0 : 1 + ((index + round) % 3),
      successes: player.name === 'You' ? 0 : (index + round) % 2
    };
    return { player, ...stat };
  });
  const activeLine = song.lyrics[currentLyricIndex] ?? "I'm walking on sunshine";
  const lyricLines = [
    activeLine,
    song.lyrics[(currentLyricIndex + 1) % song.lyrics.length],
    song.lyrics[(currentLyricIndex + 2) % song.lyrics.length],
    song.lyrics[(currentLyricIndex + 3) % song.lyrics.length]
  ].filter(Boolean);
  const displayedLyricLines = phase === 'singing' && frozenLyricLines ? frozenLyricLines : lyricLines;
  const resultWinner = grabWinner === 'me'
    ? players.find((player) => player.name === 'You')
    : grabWinner === 'other'
      ? players.find((player) => player.name !== 'You')
      : null;
  const buzzLocked = phase === 'live' && buzzCountdown > 0;
  const showLyricProgress = (phase === 'live' && !buzzLocked) || phase === 'singing';
  const activeProgressSeconds = phase === 'singing' ? SUBMIT_WINDOW_SECONDS : LYRIC_WINDOW_SECONDS;
  const lyricElapsedDegrees = Math.round((1 - lyricProgress) * 360);
  const lyricProgressRing = {
    background: `conic-gradient(from 0deg, rgba(255,255,255,0.16) 0deg ${lyricElapsedDegrees}deg, #ff5cf1 ${lyricElapsedDegrees}deg, #ff8a3d ${Math.min(360, lyricElapsedDegrees + 120)}deg, #ffe45c 360deg)`,
    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))',
    mask: 'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))'
  };
  const buzzLabel = phase === 'ready'
    ? 'READY'
    : phase === 'singing'
      ? 'SUBMIT'
      : phase === 'ended'
        ? 'DONE'
        : buzzLocked ? `${buzzCountdown}` : 'BUZZ';

  useEffect(() => {
    onPhaseChange?.(phase);
    return () => onPhaseChange?.(null);
  }, [phase, onPhaseChange]);

  useEffect(() => {
    if (phase !== 'ready' || demoHold) return undefined;

    const timer = window.setInterval(() => {
      setReadyCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setPhase('live');
          setChats((items) => [...items.slice(-3), { sender: 'System', text: 'Game started. Tap BUZZ to grab the mic.' }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, demoHold]);

  useEffect(() => {
    if (phase !== 'live') return undefined;

    const lyricInterval = window.setInterval(() => {
      setCurrentLyricIndex((prev) => (prev + 1) % song.lyrics.length);
    }, 2200);

    return () => window.clearInterval(lyricInterval);
  }, [phase, song.lyrics.length]);

  useEffect(() => {
    if (!showLyricProgress) {
      setLyricProgress(1);
      return undefined;
    }

    const startedAt = window.performance.now();
    setLyricProgress(1);

    let frameId = 0;
    const updateProgress = (now: number) => {
      const elapsed = now - startedAt;
      const nextProgress = Math.max(0, 1 - elapsed / (activeProgressSeconds * 1000));
      setLyricProgress(nextProgress);

      if (nextProgress > 0) {
        frameId = window.requestAnimationFrame(updateProgress);
        return;
      }

      if (phase === 'live' && !buzzLocked && !demoHold) {
        setPhase('missed');
        setGrabWinner(null);
        setChats((items) => [...items.slice(-3), { sender: 'System', text: 'No one grabbed the mic.' }]);
      }

      if (phase === 'singing' && grabWinner === 'me' && !demoHold) {
        setScore((prev) => prev + 42);
        setLastSuccess(false);
        setGrabWinner('me');
        setLives((prev) => Math.max(0, prev - 1));
        setPlayerStats((prev) => {
          const current = prev.You ?? { buzzes: 0, successes: 0 };
          return {
            ...prev,
            You: {
              buzzes: current.buzzes + 1,
              successes: current.successes
            }
          };
        });
        setPhase('result');
        setChats((items) => [...items.slice(-3), { sender: 'System', text: 'Auto submit failed.' }]);
      }
    };

    frameId = window.requestAnimationFrame(updateProgress);
    return () => window.cancelAnimationFrame(frameId);
  }, [showLyricProgress, lyricWindowKey, activeProgressSeconds, phase, buzzLocked, demoHold]);

  useEffect(() => {
    if (phase !== 'live' || demoHold) return undefined;

    setBuzzCountdown(BUZZ_LOCK_SECONDS);

    const timer = window.setInterval(() => {
      setBuzzCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setLyricWindowKey((key) => key + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, round, demoHold]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(''), 1700);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!successCardVisible) return undefined;

    const timer = window.setTimeout(() => {
      setSuccessCardVisible(false);
      if (phase === 'singing' && grabWinner === 'me') {
        setSingerStage('enter');
      }
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [grabWinner, phase, successCardVisible]);

  useEffect(() => {
    if (singerStage !== 'enter') return undefined;

    const timer = window.setTimeout(() => setSingerStage('singing'), 1450);
    return () => window.clearTimeout(timer);
  }, [singerStage]);

  useEffect(() => {
    if (singerStage !== 'celebrate') return undefined;

    const exitTimer = window.setTimeout(() => setSingerStage('exit'), 2000);
    const hideTimer = window.setTimeout(() => setSingerStage('hidden'), 3450);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [singerStage]);

  useEffect(() => {
    if (phase !== 'result' || grabWinner !== 'me' || !lastSuccess || demoHold) return undefined;

    const timer = window.setTimeout(() => setSingerStage('celebrate'), 1000);
    return () => window.clearTimeout(timer);
  }, [demoHold, grabWinner, lastSuccess, phase]);

  useEffect(() => {
    if (phase !== 'result' || grabWinner !== 'me' || lastSuccess || demoHold) return undefined;

    const sadTimer = window.setTimeout(() => setSingerStage('sad'), 1000);
    const exitTimer = window.setTimeout(() => setSingerStage('exit'), 2200);
    const hideTimer = window.setTimeout(() => setSingerStage('hidden'), 3600);
    return () => {
      window.clearTimeout(sadTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [demoHold, grabWinner, lastSuccess, phase]);

  useEffect(() => {
    if (phase !== 'singing') {
      setSuccessCardVisible(false);
      setFrozenLyricLines(null);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'missed' || demoHold) return undefined;

    const timer = window.setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        setPhase('ended');
        setContinueCountdown(5);
        return;
      }

      setCurrentLyricIndex((prev) => (prev + 2) % song.lyrics.length);
      setRound((prev) => prev + 1);
      setGrabWinner(null);
      setBuzzCountdown(BUZZ_LOCK_SECONDS);
      setPhase('live');
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [phase, round, demoHold, song.lyrics.length]);

  useEffect(() => {
    if (phase !== 'result' || demoHold) return undefined;

    const timer = window.setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        setPhase('ended');
        setContinueCountdown(5);
      } else {
        setCurrentLyricIndex((prev) => (prev + 2) % song.lyrics.length);
        setRound((prev) => prev + 1);
        setBuzzCountdown(BUZZ_LOCK_SECONDS);
        setGrabWinner(null);
        setSingerStage('hidden');
        setPhase('live');
      }
    }, grabWinner === 'me' ? (lastSuccess ? 4700 : 4000) : 1800);

    return () => window.clearTimeout(timer);
  }, [phase, round, demoHold, song.lyrics.length, grabWinner, lastSuccess]);

  useEffect(() => {
    if (phase !== 'ended') return undefined;

    const timer = window.setInterval(() => {
      setContinueCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          returnToRoom();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (!demoCommand) return;

    const opponent = players.find((player) => player.name !== 'You') ?? players[0];
    setSelectedPlayer(null);
    setChatOpen(false);

    switch (demoCommand.shortcut) {
      case 'other-grabbed':
        setDemoHold(false);
        setPhase('singing');
        setLastSuccess(true);
        setGrabWinner('other');
        setFrozenLyricLines(lyricLines.slice(0, 3));
        setLyricWindowKey((prev) => prev + 1);
        setSuccessCardVisible(true);
        setScore(88);
        setPlayerStats((prev) => ({
          ...prev,
          [opponent.name]: {
            buzzes: (prev[opponent.name]?.buzzes ?? 0) + 1,
            successes: (prev[opponent.name]?.successes ?? 0) + 1
          }
        }));
        setChats([{ sender: 'System', text: `Demo: ${opponent.name} grabbed the mic.` }]);
        break;
      case 'round-ended':
        setDemoHold(false);
        setPhase('ended');
        setGrabWinner(null);
        setContinueCountdown(5);
        setScore((prev) => Math.max(prev, 246));
        setChats([{ sender: 'System', text: 'Demo: round ended.' }]);
        break;
    }
  }, [demoCommand, lyricLines, players, song.title]);

  const showToast = (message: string) => {
    setToast(message);
  };

  const handleReady = () => {
    setReadyCountdown(0);
    setPhase('live');
    setChats((items) => [...items.slice(-3), { sender: 'You', text: 'Ready!' }]);
  };

  const handleBuzz = () => {
    setDemoHold(false);

    if (phase === 'ready') {
      handleReady();
      return;
    }

    if (phase === 'live') {
      if (buzzLocked) return;
      setPhase('singing');
      setGrabWinner('me');
      setSingerStage('hidden');
      setFrozenLyricLines(lyricLines.slice(0, 3));
      setLyricWindowKey((prev) => prev + 1);
      setSuccessCardVisible(true);
      setChats((items) => [...items.slice(-3), { sender: 'System', text: 'You grabbed the mic.' }]);
      setToast('');
      return;
    }

    if (phase === 'singing') {
      const nextScore = Math.floor(72 + Math.random() * 27);
      const success = nextScore >= 82;
      setScore((prev) => prev + nextScore);
      setLastSuccess(success);
      setGrabWinner('me');
      setPlayerStats((prev) => {
        const current = prev.You ?? { buzzes: 0, successes: 0 };
        return {
          ...prev,
          You: {
            buzzes: current.buzzes + 1,
            successes: current.successes + (success ? 1 : 0)
          }
        };
      });
      if (!success) {
        setLives((prev) => Math.max(0, prev - 1));
      }
      if (!success) {
        setSingerStage('exit');
      }
      setPhase('result');
      setChats((items) => [...items.slice(-3), { sender: 'System', text: success ? `Challenge cleared +${nextScore}` : `Missed pitch +${nextScore}` }]);
    }
  };

  const handleGift = () => {
    setCoins((prev) => Math.max(0, prev - 99));
    showToast('Gift sent -99');
    setFloatingEmojis((items) => [...items, { id: Date.now(), emoji: '🎁' }]);
  };

  const handleEmoji = () => {
    const emoji = ['🔥', '💜', '✨', '👏'][Math.floor(Math.random() * 4)];
    setFloatingEmojis((items) => [...items, { id: Date.now(), emoji }]);
  };

  const handleSendChat = (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatInput.trim()) return;
    setChats((items) => [...items.slice(-4), { sender: 'You', text: chatInput.trim() }]);
    setChatInput('');
  };

  const handleFollow = (player: SeatPlayer) => {
    setFollowedPlayers((prev) => {
      const next = new Set(prev);
      next.add(player.name);
      return next;
    });
    showToast(`Followed ${player.name}`);
  };

  const returnToRoom = () => {
    setDemoHold(false);
    setPhase('ready');
    setReadyCountdown(60);
    setBuzzCountdown(BUZZ_LOCK_SECONDS);
    setCurrentLyricIndex(0);
    setRound(1);
    setLives(2);
    setScore(0);
    setGrabWinner(null);
    setContinueCountdown(5);
    setFrozenLyricLines(null);
    setSuccessCardVisible(false);
    setSingerStage('hidden');
    setSelectedPlayer(null);
    setChatOpen(false);
    setChats([{ sender: 'System', text: 'Back in room. Waiting for next start.' }]);
  };

  const buzzAction = phase === 'ended' ? returnToRoom : handleBuzz;

  return (
    <div id="active-song-room" className="absolute inset-0 z-50 overflow-hidden bg-[#080024] text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_74%,rgba(72,233,255,0.34),transparent_16%),radial-gradient(circle_at_20%_58%,rgba(253,28,220,0.34),transparent_28%),radial-gradient(circle_at_80%_40%,rgba(23,100,255,0.34),transparent_30%),linear-gradient(180deg,#05001f_0%,#140044_52%,#05001d_100%)]" />
      <div className="absolute inset-0 opacity-55 bg-[linear-gradient(115deg,transparent_0%,rgba(255,40,230,0.28)_12%,transparent_28%),linear-gradient(245deg,transparent_0%,rgba(33,164,255,0.28)_13%,transparent_31%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,transparent,rgba(18,0,58,0.84)),repeating-linear-gradient(90deg,rgba(255,255,255,0.14)_0_1px,transparent_1px_42px),repeating-linear-gradient(0deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_34px)] [perspective:480px]" />
      <div className="absolute left-1/2 top-[62%] h-[22%] w-[74%] -translate-x-1/2 rounded-t-full border-t border-cyan-200/70 opacity-80" />

      {phase !== 'ended' && (
      <header className="absolute left-0 right-0 top-0 z-30 flex items-start justify-between px-4 pt-11">
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/95 transition-colors hover:bg-white/10"
          aria-label="Exit room"
        >
          <Menu className="h-5 w-5 stroke-[3]" />
        </button>

        <div className="pt-1 text-center">
          <h1 className="font-display text-[0.92rem] font-extrabold leading-none tracking-normal">Room 5187024</h1>
          <div className="mt-1.5 flex items-center justify-center gap-2 text-[0.74rem] font-semibold text-white/85">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            <span>6/6</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.62rem] uppercase text-white/70">
              {phase === 'ready' ? `Ready ${readyCountdown}` : phase === 'ended' ? 'Ended' : `Round ${round}/${TOTAL_ROUNDS}`}
            </span>
          </div>
        </div>

        <button
          onClick={() => showToast('6 players online')}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/95 transition-colors hover:bg-white/10"
          aria-label="Room users"
        >
          <Users className="h-5 w-5 stroke-[2.8]" />
        </button>
      </header>
      )}

      {phase !== 'ended' && (
        <div className="absolute left-4 top-[5.1rem] z-30 flex items-center gap-1.5 rounded-full bg-black/24 px-2.5 py-1.5 backdrop-blur-sm">
          {Array.from({ length: 2 }).map((_, index) => (
            <Heart
              key={index}
              className={`h-3.5 w-3.5 ${index < lives ? 'fill-rose-400 text-rose-300' : 'text-white/24'}`}
            />
          ))}
        </div>
      )}

      <main className="relative z-20 h-full w-full">
        <section className="absolute left-1/2 top-[18%] w-[86%] -translate-x-1/2">
          <AnimatePresence mode="wait">
            {phase === 'ready' ? (
              <motion.div
                key="ready-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative h-[9.55rem] rounded-[1.8rem] border-[2px] border-fuchsia-300/95 bg-[#080033]/76 px-5 py-6 text-center shadow-[0_0_18px_rgba(246,75,255,0.9),inset_0_0_28px_rgba(28,12,98,0.92)] backdrop-blur-sm"
              >
                <div className="mx-auto mb-3 w-fit rounded-full border border-cyan-300/20 bg-white/8 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-cyan-100">
                  {room.title}
                </div>
                <p className="font-display text-[0.86rem] font-extrabold text-white">{song.title}</p>
                <p className="mt-1 text-[0.68rem] font-semibold text-white/55">{song.artist}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-[0.68rem] font-bold uppercase text-white/55">Auto ready in</span>
                  <motion.span
                    key={readyCountdown}
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-lg font-black shadow-[0_0_18px_rgba(236,72,153,0.75)]"
                  >
                    {readyCountdown}
                  </motion.span>
                </div>
              </motion.div>
            ) : phase === 'singing' ? (
              <motion.div
                key="singing-lyrics"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="relative min-h-[9.55rem] px-4 py-4 text-center"
              >
                {displayedLyricLines.slice(0, 3).map((line, index) => (
                  <p
                    key={`${line}-${index}`}
                    className={`font-display font-extrabold leading-tight drop-shadow-[0_0_16px_rgba(34,211,238,0.32)] ${index === 0 ? 'text-[1.08rem] text-cyan-100' : 'mt-3 text-[0.82rem] text-white/68'}`}
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="live-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="relative h-[9.55rem] rounded-[1.8rem] border-[2px] border-fuchsia-300/95 bg-[#080033]/76 px-5 py-4 text-center shadow-[0_0_18px_rgba(246,75,255,0.9),inset_0_0_28px_rgba(28,12,98,0.92)] backdrop-blur-sm"
              >
                <div className="absolute -top-5 left-1/2 h-8 w-8 -translate-x-1/2 rotate-45 border-[3px] border-fuchsia-300 bg-[#32105e] shadow-[0_0_16px_rgba(246,75,255,0.9)]" />
                <div className="mb-2 flex items-center justify-center gap-2">
                  <img src={singer.avatarUrl} alt={singer.name} className="h-8 w-8 rounded-full border border-cyan-300 object-cover" referrerPolicy="no-referrer" />
                  <div className="text-left">
                    <p className="max-w-[8rem] truncate text-[0.72rem] font-black text-white">{song.title}</p>
                    <p className="max-w-[8rem] truncate text-[0.58rem] font-semibold text-white/48">{song.artist}</p>
                  </div>
                </div>
                <div className="relative h-[3.15rem] overflow-hidden">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={`lyrics-${currentLyricIndex}`}
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '-100%' }}
                      transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-x-0 top-0"
                    >
                      <p className="font-display text-[0.92rem] font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300">
                        {displayedLyricLines[0]}
                      </p>
                      <p className="mt-2 font-display text-[0.76rem] font-extrabold leading-tight text-white/70">
                        {displayedLyricLines[1]}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mx-auto mt-3 flex w-24 items-center justify-center gap-2.5 text-fuchsia-200">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-fuchsia-300 to-white" />
                  <span className="text-base leading-none">✦</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-white via-cyan-300 to-transparent" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <div className="absolute left-1/2 top-[42.5%] z-[28] h-[45%] w-20 -translate-x-1/2">
          <div className={`absolute left-1/2 top-0 h-20 w-14 -translate-x-1/2 rounded-[1.5rem] border-[3px] border-white/80 bg-[linear-gradient(90deg,#ff42de,#f9f7ff_48%,#24c8ff)] shadow-[0_0_20px_rgba(255,61,232,0.9)] ${phase === 'singing' ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-x-3 top-3 h-1.5 rounded-full bg-[#080024]" />
            <div className="absolute inset-x-3 top-6 h-1.5 rounded-full bg-[#080024]" />
            <div className="absolute inset-x-3 top-9 h-1.5 rounded-full bg-[#080024]" />
            <div className="absolute bottom-0 left-1/2 h-7 w-7 -translate-x-1/2 rounded-t-full bg-[#080024]" />
          </div>
          <div className="absolute left-1/2 top-[4.5rem] h-[79%] w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-200 via-fuchsia-400 to-[#17003e] shadow-[0_0_16px_rgba(78,226,255,0.8)]" />
          <div className="absolute bottom-0 left-1/2 h-6 w-20 -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-[#180031] via-fuchsia-500 to-[#0b0d4f] shadow-[0_0_24px_rgba(248,45,232,0.8)]" />
        </div>

        <SingingCharacter stage={singerStage} />

        <div className="absolute inset-0 z-20">
          {players.map((player, index) => (
            <button
              key={`${player.name}-${index}`}
              onClick={() => setSelectedPlayer(player)}
              className={`absolute ${seatPositions[index]} w-[3.15rem]`}
            >
              <div className="relative flex flex-col items-center">
                <span className={`absolute -left-0.5 -top-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-full text-[0.56rem] font-extrabold shadow-[0_0_12px_rgba(72,111,255,0.9)] ${index % 2 === 0 ? 'bg-gradient-to-br from-fuchsia-400 to-indigo-500' : 'bg-gradient-to-br from-cyan-400 to-indigo-500'}`}>
                  {player.seat}
                </span>
                <div className={`h-[2.85rem] w-[2.85rem] overflow-hidden rounded-full border-2 bg-[#10003b] shadow-[0_0_12px_rgba(130,74,255,0.78)] ${player.name === singer.name && phase === 'live' ? 'border-amber-300' : index % 2 === 0 ? 'border-fuchsia-400' : 'border-cyan-400'}`}>
                  <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="-mt-0.5 w-full rounded-full bg-black/34 px-1 py-0.5 text-center shadow-[0_7px_12px_rgba(0,0,0,0.26)] backdrop-blur-sm">
                  <p className="truncate font-display text-[0.62rem] font-extrabold leading-none text-white">{player.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {successCardVisible && phase === 'singing' && Boolean(grabWinner) && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-40 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[1.45rem] border border-cyan-200/30 bg-[#080033]/82 px-5 py-4 text-center shadow-[0_0_26px_rgba(34,211,238,0.34),inset_0_0_26px_rgba(236,72,153,0.18)] backdrop-blur-md"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-fuchsia-500 shadow-[0_0_20px_rgba(34,211,238,0.55)]">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <p className="mt-3 font-display text-[1.05rem] font-black text-white">
                {resultWinner?.name ?? 'You'} 抢到麦克风
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'missed' && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-40 w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-[1.45rem] border border-fuchsia-200/26 bg-[#080033]/86 px-5 py-4 text-center shadow-[0_0_26px_rgba(236,72,153,0.32),inset_0_0_26px_rgba(34,211,238,0.14)] backdrop-blur-md"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-300 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                <X className="h-6 w-6 text-white" />
              </div>
              <p className="mt-3 font-display text-[1rem] font-black leading-tight text-white">
                哎呀，歌曲太难了，无人抢唱
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 left-3 z-30 flex gap-2">
          <button onClick={handleEmoji} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Emoji">
            <SmilePlus className="h-5 w-5" />
          </button>
          <button onClick={() => setChatOpen((prev) => !prev)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Chat">
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-3 right-3 z-30 flex gap-2">
          <button onClick={handleGift} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Gift">
            <Gift className="h-5 w-5" />
          </button>
          <button onClick={() => setMuted((prev) => !prev)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Volume">
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>

        {phase !== 'ended' && phase !== 'result' && phase !== 'missed' && (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={buzzAction}
            disabled={buzzLocked}
            className={`absolute bottom-[4.65rem] right-4 z-30 flex h-[5.65rem] w-[5.65rem] items-center justify-center rounded-full p-[0.36rem] text-white shadow-[0_0_0_7px_rgba(254,73,255,0.18),0_0_28px_rgba(255,76,220,0.95)] transition-transform ${buzzLocked ? 'cursor-default' : ''}`}
            aria-label={buzzLabel}
          >
            {showLyricProgress && (
              <>
                <span className="pointer-events-none absolute -inset-2 rounded-full border-[6px] border-white/16" />
                <span
                  className="pointer-events-none absolute -inset-2 rounded-full drop-shadow-[0_0_10px_rgba(255,76,220,0.95)]"
                  style={lyricProgressRing}
                  aria-hidden="true"
                />
              </>
            )}
            <span className={`absolute inset-[0.52rem] rounded-full border-[3px] ${
              phase === 'singing'
                ? 'border-cyan-200/90 bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500'
                : 'border-fuchsia-200/90 bg-gradient-to-br from-rose-400 via-orange-400 to-amber-300'
            }`} />
            <span className="relative flex flex-col items-center leading-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)]">
              <span className={buzzLocked ? 'font-display text-[2.15rem] font-black' : phase === 'singing' ? 'text-[0.96rem] font-black' : 'text-[1.18rem] font-black'}>
                {buzzLabel}
              </span>
              {phase === 'ready' && (
                <span className="mt-1 text-[0.66rem] font-black text-white/82">{readyCountdown}s</span>
              )}
            </span>
            <Mic2 className="absolute bottom-5 h-4 w-4 text-white/26" />
          </motion.button>
        )}

        <AnimatePresence>
          {chatOpen && (
            <motion.form
              onSubmit={handleSendChat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-14 left-3 right-3 z-40 rounded-2xl border border-white/10 bg-black/54 p-3 backdrop-blur-md"
            >
              <div className="mb-2 max-h-20 space-y-1 overflow-hidden text-[0.68rem]">
                {chats.slice(-3).map((chat, index) => (
                  <p key={`${chat.sender}-${index}`} className="truncate text-white/75">
                    <span className="font-black text-cyan-200">{chat.sender}:</span> {chat.text}
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Send message"
                  className="min-w-0 flex-1 rounded-full bg-white/10 px-3 py-2 text-xs text-white outline-none placeholder:text-white/35"
                />
                <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-[#05051a]">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-end bg-black/32"
              onClick={() => setSelectedPlayer(null)}
            >
              <motion.div
                initial={{ y: 90 }}
                animate={{ y: 0 }}
                exit={{ y: 90 }}
                className="w-full rounded-t-3xl border border-white/10 bg-[#0d0730]/95 p-4 backdrop-blur-md"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <img src={selectedPlayer.avatarUrl} alt={selectedPlayer.name} className="h-12 w-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base font-black text-white">{selectedPlayer.name}</p>
                    <p className="text-xs text-white/45">Seat {selectedPlayer.seat} · ID {834200 + selectedPlayer.seat}</p>
                  </div>
                  <button onClick={() => setSelectedPlayer(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleFollow(selectedPlayer)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-cyan-400 px-3 py-2 text-xs font-black text-[#05051a]"
                  >
                    {followedPlayers.has(selectedPlayer.name) ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {followedPlayers.has(selectedPlayer.name) ? 'Following' : 'Follow'}
                  </button>
                  <button
                    onClick={handleGift}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-fuchsia-500 px-3 py-2 text-xs font-black text-white"
                  >
                    <Gift className="h-4 w-4" />
                    Gift
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-1/2 top-[13%] z-[60] -translate-x-1/2 rounded-full bg-black/58 px-4 py-2 text-xs font-black text-white shadow-[0_0_18px_rgba(34,211,238,0.34)] backdrop-blur-md"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'result' && !(grabWinner === 'me' && ((lastSuccess && (singerStage === 'celebrate' || singerStage === 'exit')) || (!lastSuccess && (singerStage === 'sad' || singerStage === 'exit')))) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.78 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
              className="absolute left-1/2 top-[39%] z-50 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-black/68 px-5 py-5 text-center backdrop-blur-md"
            >
              {resultWinner && (
                <img
                  src={resultWinner.avatarUrl}
                  alt={resultWinner.name}
                  className="mx-auto mb-3 h-12 w-12 rounded-full border-2 border-cyan-200 object-cover shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                  referrerPolicy="no-referrer"
                />
              )}
              <p className={`font-display text-xl font-black ${lastSuccess ? 'text-cyan-200' : 'text-rose-200'}`}>
                {grabWinner === 'me'
                  ? lastSuccess ? '我抢唱成功' : '抢唱失败'
                  : grabWinner === 'other'
                    ? `${resultWinner?.name ?? '其他玩家'} 抢唱成功`
                    : lastSuccess ? 'Success' : 'Miss'}
              </p>
              <p className="mt-1 text-xs font-bold text-white/58">
                {grabWinner ? '系统判定结果' : `Score ${score}`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 z-50">
          <AnimatePresence>
            {floatingEmojis.map((item) => (
              <motion.span
                key={item.id}
                initial={{ opacity: 0, y: 0, scale: 0.7 }}
                animate={{ opacity: [0, 1, 0], y: -130, scale: [0.7, 1.2, 1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4 }}
                onAnimationComplete={() => setFloatingEmojis((items) => items.filter((emoji) => emoji.id !== item.id))}
                className="absolute bottom-16 left-1/2 text-2xl"
              >
                {item.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-[3.35rem] right-4 z-30 rounded-full bg-black/30 px-2 py-1 text-[0.58rem] font-black text-amber-100/80 backdrop-blur-sm">
          {coins} coins
        </div>

        <AnimatePresence>
          {phase === 'ended' && (
            <motion.div
              key="game-end-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[80] flex flex-col bg-[#050017]/96 px-4 pb-5 pt-[4.6rem] backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(251,191,36,0.22),transparent_24%),radial-gradient(circle_at_18%_58%,rgba(236,72,153,0.24),transparent_28%),radial-gradient(circle_at_86%_70%,rgba(34,211,238,0.18),transparent_30%)]" />

              <div className="relative z-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-fuchsia-500 shadow-[0_0_28px_rgba(251,191,36,0.62)]">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <h2 className="mt-3 font-display text-xl font-black text-white">Game Results</h2>
                <p className="mt-1 text-[0.72rem] font-semibold text-white/50">
                  Total score {score} · Round {round}/{TOTAL_ROUNDS}
                </p>
              </div>

              <div className="relative z-10 mt-5 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
                <div className="grid grid-cols-[1fr_3.2rem_3.2rem] px-3 text-[0.62rem] font-black uppercase tracking-wide text-white/42">
                  <span>Player</span>
                  <span className="text-center">Buzz</span>
                  <span className="text-center">Success</span>
                </div>

                <div className="space-y-2 overflow-hidden">
                  {scoreboard.map((item, index) => (
                    <motion.div
                      key={item.player.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`grid grid-cols-[1fr_3.2rem_3.2rem] items-center rounded-2xl border px-3 py-2 ${
                        item.player.name === 'You'
                          ? 'border-cyan-300/35 bg-cyan-300/12'
                          : 'border-white/8 bg-white/7'
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
                          <p className="truncate text-[0.78rem] font-black text-white">
                            {item.player.name}
                          </p>
                          <p className="text-[0.58rem] font-semibold text-white/38">
                            ID {834200 + item.player.seat}
                          </p>
                        </div>
                      </div>
                      <span className="text-center font-display text-lg font-black text-fuchsia-200">
                        {item.buzzes}
                      </span>
                      <span className="text-center font-display text-lg font-black text-cyan-200">
                        {item.successes}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <button
                onClick={returnToRoom}
                className="relative z-10 mt-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-3 py-3 text-sm font-black text-white shadow-[0_0_22px_rgba(34,211,238,0.34)]"
              >
                确认 {continueCountdown}s
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
