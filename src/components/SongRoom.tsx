import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  Gem,
  Gift,
  Heart,
  Keyboard,
  Menu,
  Mic,
  MessageCircle,
  Mic2,
  MicOff,
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
  demoPaused?: boolean;
  onPhaseChange?: (phase: RushRoomPhase | null) => void;
  onRequestRematch?: () => void;
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
const GAME_START_INTRO_MS = 2000;
const GRAB_RESULT_DELAY_MS = 2000;
const OPPONENT_SUBMIT_DELAY_MS = 4000;
const OPPONENT_SUCCESS_CARD_MS = 1500;
const LYRIC_WINDOW_SECONDS = 9;
const SUBMIT_WINDOW_SECONDS = LYRIC_WINDOW_SECONDS * 2;
const TOTAL_ROUNDS = 12;
const emojiOptions = [
  { emoji: '😡', label: '生气' },
  { emoji: '🤗', label: '抱抱' },
  { emoji: '😭', label: '泪奔' },
  { emoji: '😍', label: '宣你' },
  { emoji: '👋', label: '挥手' },
  { emoji: '🙋', label: '举手' },
  { emoji: '😏', label: '坏笑' },
  { emoji: '😑', label: '黑线' },
  { emoji: '🤣', label: '捂脸' },
  { emoji: '👏', label: '鼓掌' },
  { emoji: '🎤', label: '开唱' },
  { emoji: '💯', label: '满分' }
];
const keyboardEmojiOptions = [
  '🐵', '😊', '😡', '😺', '☺️', '😎', '😟', '😵',
  '🙈', '🙂', '😁', '😬', '😏', '🥤', '🥺', '😱',
  '😳', '🤣', '😅', '😠', '😮', '😩', '😤', '😭',
  '😢', '🤗', '😱', '🤦', '😤', '🤩', '🤫', '🟣',
  '🤕', '🤭', '🫢', '🤢', '🔥', '😵‍💫', '😘', '😭',
  '🥰', '😂', '😗', '😚', '😯', '😶', '🥹', '😉'
];
const giftOptions = [
  { icon: '🌹', price: 3 },
  { icon: '🎁', price: 9 },
  { icon: '💎', price: 12 },
  { icon: '🎤', price: 18 },
  { icon: '🏆', price: 30 },
  { icon: '🚀', price: 52 },
  { icon: '👑', price: 99 },
  { icon: '💐', price: 188 },
  { icon: '🎇', price: 520 }
];

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

export default function SongRoom({ room, song, onClose, currentUserAvatar, demoCommand, demoPaused = false, onPhaseChange, onRequestRematch }: SongRoomProps) {
  const [phase, setPhase] = useState<RushRoomPhase>('intro');
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
  const [vacatedSeat, setVacatedSeat] = useState<number | null>(null);
  const [readyPlayerNames, setReadyPlayerNames] = useState<Set<string>>(new Set());
  const [playerStats, setPlayerStats] = useState<Record<string, PlayerStat>>({});
  const [frozenLyricLines, setFrozenLyricLines] = useState<string[] | null>(null);
  const [toast, setToast] = useState('');
  const [successCardVisible, setSuccessCardVisible] = useState(false);
  const [grabResultPending, setGrabResultPending] = useState(false);
  const [lampEffectVisible, setLampEffectVisible] = useState(false);
  const [lampMessageVisible, setLampMessageVisible] = useState(false);
  const [freeLampUsed, setFreeLampUsed] = useState(false);
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [introCue, setIntroCue] = useState<'ready' | 'go'>('ready');
  const [singerStage, setSingerStage] = useState<SingerStage>('hidden');
  const [roomMenuOpen, setRoomMenuOpen] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [coins, setCoins] = useState(2860);
  const [chatOpen, setChatOpen] = useState(false);
  const [emojiPanelOpen, setEmojiPanelOpen] = useState(false);
  const [keyboardEmojiOpen, setKeyboardEmojiOpen] = useState(false);
  const [giftPanelOpen, setGiftPanelOpen] = useState(false);
  const [giftPanelMode, setGiftPanelMode] = useState<'all' | 'single'>('all');
  const [giftRecipientName, setGiftRecipientName] = useState<string>('You');
  const [giftToast, setGiftToast] = useState<{ id: number; fromId: number; toName: string; icon: string } | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [muted, setMuted] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<SeatPlayer | null>(null);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [followedPlayers, setFollowedPlayers] = useState<Set<string>>(new Set());
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string }>>([]);
  const [sentChatBubbles, setSentChatBubbles] = useState<Array<{ id: number; sender: string; text: string }>>([]);
  const roomRef = useRef<HTMLDivElement | null>(null);
  const handledDemoCommandIdRef = useRef<number | null>(null);
  const [chats, setChats] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'System', text: 'Entered room. Game is starting.' }
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
  const displayedSeats = players.map((player) => player.seat === vacatedSeat ? null : player);
  const activeReadyPlayers = displayedSeats.filter((player): player is SeatPlayer => Boolean(player));
  const youReady = readyPlayerNames.has('You');
  const allPlayersReady = activeReadyPlayers.length > 0 && activeReadyPlayers.every((player) => readyPlayerNames.has(player.name));
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
  const resultWinnerId = resultWinner ? 834200 + resultWinner.seat : null;
  const performerHighlightActive = Boolean(resultWinner) && !successCardVisible && phase === 'singing';
  const buzzLocked = phase === 'live' && buzzCountdown > 0;
  const opponentSinging = phase === 'singing' && grabWinner === 'other';
  const opponentLampActive = opponentSinging && !successCardVisible;
  const submitWindowActive = phase === 'singing' && grabWinner === 'me' && !grabResultPending && !successCardVisible;
  const showMainActionButton = phase !== 'intro' && phase !== 'ended' && phase !== 'result' && phase !== 'missed' && !(phase === 'ready' && youReady) && !(opponentSinging && successCardVisible);
  const showLyricProgress = (phase === 'live' && !buzzLocked) || submitWindowActive;
  const activeProgressSeconds = phase === 'singing' ? SUBMIT_WINDOW_SECONDS : LYRIC_WINDOW_SECONDS;
  const lyricElapsedDegrees = Math.round((1 - lyricProgress) * 360);
  const readyElapsedDegrees = Math.round(((60 - readyCountdown) / 60) * 360);
  const lyricProgressRing = {
    background: `conic-gradient(from 0deg, rgba(255,255,255,0.16) 0deg ${lyricElapsedDegrees}deg, #ff5cf1 ${lyricElapsedDegrees}deg, #ff8a3d ${Math.min(360, lyricElapsedDegrees + 120)}deg, #ffe45c 360deg)`,
    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))',
    mask: 'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))'
  };
  const readyProgressRing = {
    background: `conic-gradient(from 0deg, rgba(255,255,255,0.16) 0deg ${readyElapsedDegrees}deg, #ff5cf1 ${readyElapsedDegrees}deg, #ff8a3d ${Math.min(360, readyElapsedDegrees + 120)}deg, #ffe45c 360deg)`,
    WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))',
    mask: 'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))'
  };
  const buzzLabel = phase === 'ready'
    ? 'READY'
    : phase === 'singing'
      ? opponentLampActive ? '爆灯' : submitWindowActive ? 'SUBMIT' : 'BUZZ'
      : phase === 'ended'
        ? 'DONE'
        : buzzLocked ? `${buzzCountdown}` : 'BUZZ';

  useEffect(() => {
    const animations = roomRef.current?.getAnimations({ subtree: true }) ?? [];
    animations.forEach((animation) => {
      if (demoPaused) {
        animation.pause();
      } else {
        animation.play();
      }
    });
  }, [demoPaused, phase, singerStage, successCardVisible, toast, floatingEmojis, lampEffectVisible, lampMessageVisible, rechargeOpen]);

  useEffect(() => {
    onPhaseChange?.(phase);
    return () => onPhaseChange?.(null);
  }, [phase, onPhaseChange]);

  useEffect(() => {
    if (phase !== 'ready' || vacatedSeat !== null || !allPlayersReady) return;

    setReadyCountdown(0);
    setPhase('intro');
  }, [allPlayersReady, phase, vacatedSeat]);

  useEffect(() => {
    if (phase !== 'intro' || demoHold || demoPaused) return undefined;

    setIntroCue('ready');
    const goTimer = window.setTimeout(() => setIntroCue('go'), GAME_START_INTRO_MS / 2);
    const timer = window.setTimeout(() => {
      setPhase('live');
      setChats((items) => [...items.slice(-3), { sender: 'System', text: 'Game started. Tap BUZZ to grab the mic.' }]);
    }, GAME_START_INTRO_MS);

    return () => {
      window.clearTimeout(goTimer);
      window.clearTimeout(timer);
    };
  }, [phase, demoHold, demoPaused]);

  useEffect(() => {
    if (phase !== 'ready' || demoHold || demoPaused) return undefined;

    const timer = window.setInterval(() => {
      setReadyCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          if (allPlayersReady) {
            setPhase('intro');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, demoHold, demoPaused, allPlayersReady]);

  useEffect(() => {
    if (phase !== 'live' || demoPaused) return undefined;

    const lyricInterval = window.setInterval(() => {
      setCurrentLyricIndex((prev) => (prev + 1) % song.lyrics.length);
    }, 2200);

    return () => window.clearInterval(lyricInterval);
  }, [phase, song.lyrics.length, demoPaused]);

  useEffect(() => {
    if (!showLyricProgress) {
      setLyricProgress(1);
      return undefined;
    }
    if (demoPaused) return undefined;

    const startedAt = window.performance.now();
    const initialProgress = lyricProgress;

    let frameId = 0;
    const updateProgress = (now: number) => {
      const elapsed = now - startedAt;
      const nextProgress = Math.max(0, initialProgress - elapsed / (activeProgressSeconds * 1000));
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

      if (submitWindowActive && !demoHold) {
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
  }, [showLyricProgress, lyricWindowKey, activeProgressSeconds, phase, buzzLocked, demoHold, submitWindowActive, demoPaused]);

  useEffect(() => {
    if (phase !== 'live' || demoHold || demoPaused) return undefined;

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
  }, [phase, round, demoHold, demoPaused]);

  useEffect(() => {
    if (!toast || demoPaused) return undefined;

    const timer = window.setTimeout(() => setToast(''), 1700);
    return () => window.clearTimeout(timer);
  }, [toast, demoPaused]);

  useEffect(() => {
    if (!successCardVisible || demoPaused) return undefined;

    const timer = window.setTimeout(() => {
      setSuccessCardVisible(false);
      if (phase === 'singing' && (grabWinner === 'me' || grabWinner === 'other')) {
        setSingerStage('enter');
      }
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [grabWinner, phase, successCardVisible, demoPaused]);

  useEffect(() => {
    if (!grabResultPending || demoPaused) return undefined;

    const timer = window.setTimeout(() => {
      setGrabResultPending(false);
      setSuccessCardVisible(true);
    }, GRAB_RESULT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [grabResultPending, demoPaused]);

  useEffect(() => {
    if (!lampEffectVisible || demoPaused) return undefined;

    const timer = window.setTimeout(() => setLampEffectVisible(false), 1000);
    return () => window.clearTimeout(timer);
  }, [lampEffectVisible, demoPaused]);

  useEffect(() => {
    if (opponentSinging) return;

    setLampEffectVisible(false);
    setLampMessageVisible(false);
    setFreeLampUsed(false);
  }, [opponentSinging]);

  useEffect(() => {
    if (!opponentSinging || successCardVisible || singerStage !== 'singing' || demoHold || demoPaused) return undefined;

    const timer = window.setTimeout(() => {
      setLastSuccess(true);
      setPhase('result');
      setChats((items) => [...items.slice(-3), { sender: 'System', text: `${resultWinner?.name ?? '其他玩家'} 抢唱成功` }]);
    }, OPPONENT_SUBMIT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [demoHold, opponentSinging, resultWinner?.name, singerStage, successCardVisible, demoPaused]);

  useEffect(() => {
    if (singerStage !== 'enter' || demoPaused) return undefined;

    const timer = window.setTimeout(() => setSingerStage('singing'), 1450);
    return () => window.clearTimeout(timer);
  }, [singerStage, demoPaused]);

  useEffect(() => {
    if (singerStage !== 'celebrate' || demoPaused) return undefined;

    const exitTimer = window.setTimeout(() => setSingerStage('exit'), 2000);
    const hideTimer = window.setTimeout(() => setSingerStage('hidden'), 3450);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [singerStage, demoPaused]);

  useEffect(() => {
    if (phase !== 'result' || grabWinner !== 'other' || !lastSuccess || demoHold || demoPaused) return undefined;

    const timer = window.setTimeout(() => setSingerStage('celebrate'), OPPONENT_SUCCESS_CARD_MS);
    return () => window.clearTimeout(timer);
  }, [demoHold, grabWinner, lastSuccess, phase, demoPaused]);

  useEffect(() => {
    if (phase !== 'result' || grabWinner !== 'me' || !lastSuccess || demoHold || demoPaused) return undefined;

    const timer = window.setTimeout(() => setSingerStage('celebrate'), 1000);
    return () => window.clearTimeout(timer);
  }, [demoHold, grabWinner, lastSuccess, phase, demoPaused]);

  useEffect(() => {
    if (phase !== 'result' || grabWinner !== 'me' || lastSuccess || demoHold || demoPaused) return undefined;

    const sadTimer = window.setTimeout(() => setSingerStage('sad'), 1000);
    const exitTimer = window.setTimeout(() => setSingerStage('exit'), 2200);
    const hideTimer = window.setTimeout(() => setSingerStage('hidden'), 3600);
    return () => {
      window.clearTimeout(sadTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [demoHold, grabWinner, lastSuccess, phase, demoPaused]);

  useEffect(() => {
    if (phase !== 'singing') {
      setSuccessCardVisible(false);
      setFrozenLyricLines(null);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'missed' || demoHold || demoPaused) return undefined;

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
  }, [phase, round, demoHold, song.lyrics.length, demoPaused]);

  useEffect(() => {
    if (phase !== 'result' || demoHold || demoPaused) return undefined;

    const resultDelay = grabWinner === 'me'
      ? (lastSuccess ? 4700 : 4000)
      : grabWinner === 'other'
        ? 5200
        : 1800;

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
    }, resultDelay);

    return () => window.clearTimeout(timer);
  }, [phase, round, demoHold, song.lyrics.length, grabWinner, lastSuccess, demoPaused]);

  useEffect(() => {
    if (phase !== 'ended' || demoPaused) return undefined;

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
  }, [phase, demoPaused]);

  useEffect(() => {
    if (!demoCommand) return;
    if (handledDemoCommandIdRef.current === demoCommand.id) return;
    handledDemoCommandIdRef.current = demoCommand.id;

    const opponent = players.find((player) => player.name !== 'You') ?? players[0];
    setSelectedPlayer(null);
    setChatOpen(false);

    switch (demoCommand.shortcut) {
      case 'other-grabbed':
        setDemoHold(false);
        setPhase('singing');
        setLastSuccess(true);
        setGrabWinner('other');
        setSingerStage('hidden');
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
      case 'user-left':
        if (phase !== 'ready') break;
        setVacatedSeat((prev) => {
          const nextSeat = players.find((player) => player.name !== 'You')?.seat ?? 2;
          return prev ?? nextSeat;
        });
        setReadyPlayerNames((prev) => {
          const next = new Set(prev);
          players.filter((player) => player.name !== 'You').forEach((player) => next.delete(player.name));
          return next;
        });
        setChats([{ sender: 'System', text: 'A player left. Waiting for rematch.' }]);
        break;
      case 'users-ready':
        if (phase !== 'ready') break;
        setReadyPlayerNames((prev) => {
          const next = new Set(prev);
          displayedSeats.forEach((player) => {
            if (player && player.name !== 'You') {
              next.add(player.name);
            }
          });
          return next;
        });
        setChats([{ sender: 'System', text: 'Other players are ready.' }]);
        break;
    }
  }, [demoCommand, displayedSeats, phase, players]);

  const showToast = (message: string) => {
    setToast(message);
  };

  const handleGameplayInfo = () => {
    setRoomMenuOpen(false);
    showToast('游戏玩法');
  };

  const handleExitRoom = () => {
    setRoomMenuOpen(false);
    if (phase === 'ready') {
      onClose();
      return;
    }
    setExitConfirmOpen(true);
  };

  const handleReady = () => {
    if (vacatedSeat !== null) {
      onRequestRematch?.();
      return;
    }

    const nextReadyPlayers = new Set(readyPlayerNames);
    nextReadyPlayers.add('You');
    setReadyPlayerNames(nextReadyPlayers);
    setChats((items) => [...items.slice(-3), { sender: 'You', text: 'Ready!' }]);

    if (activeReadyPlayers.every((player) => nextReadyPlayers.has(player.name))) {
      setReadyCountdown(0);
      setPhase('intro');
    }
  };

  const handleBuzz = () => {
    setDemoHold(false);

    if (opponentLampActive) {
      if (freeLampUsed) {
        setRechargeOpen(true);
        return;
      }

      setFreeLampUsed(true);
      setLampEffectVisible(true);
      setLampMessageVisible(true);
      return;
    }

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
      setSuccessCardVisible(false);
      setGrabResultPending(true);
      setChats((items) => [...items.slice(-3), { sender: 'System', text: 'You grabbed the mic.' }]);
      setToast('');
      return;
    }

    if (phase === 'singing') {
      if (!submitWindowActive) return;

      const nextScore = Math.floor(88 + Math.random() * 11);
      const success = true;
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
      setPhase('result');
      setChats((items) => [...items.slice(-3), { sender: 'System', text: success ? `Challenge cleared +${nextScore}` : `Missed pitch +${nextScore}` }]);
    }
  };

  const openGiftPanel = (playerName?: string, mode: 'all' | 'single' = 'all') => {
    const firstPlayer = displayedSeats.find((player): player is SeatPlayer => Boolean(player));
    setGiftRecipientName(playerName ?? firstPlayer?.name ?? 'You');
    setGiftPanelMode(mode);
    setGiftPanelOpen(true);
  };

  const handleGift = (gift: { icon: string; price: number }) => {
    const recipient = players.find((player) => player.name === giftRecipientName) ?? players.find((player) => player.name === 'You') ?? players[0];
    const you = players.find((player) => player.name === 'You') ?? players[0];
    const id = Date.now();
    setCoins((prev) => Math.max(0, prev - gift.price));
    setGiftPanelOpen(false);
    setGiftToast({ id, fromId: 834200 + you.seat, toName: recipient.name, icon: gift.icon });
    setSentChatBubbles((items) => [
      ...items.slice(-2),
      { id, sender: `${834200 + you.seat}`, text: `给${recipient.name}送了${gift.icon}` }
    ]);
    window.setTimeout(() => {
      setGiftToast((current) => current?.id === id ? null : current);
    }, 3000);
  };

  const handleEmoji = (emoji: string) => {
    const id = Date.now();
    setFloatingEmojis((items) => [...items, { id, emoji }]);
    window.setTimeout(() => {
      setFloatingEmojis((items) => items.filter((item) => item.id !== id));
    }, 3000);
    setEmojiPanelOpen(false);
  };

  const appendChatInput = (value: string) => {
    setChatInput((current) => `${current}${value}`);
  };

  const deleteChatInput = () => {
    setChatInput((current) => current.slice(0, -1));
  };

  const handleSendChat = (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChats((items) => [...items.slice(-4), { sender: 'You', text }]);
    setSentChatBubbles((items) => [...items.slice(-2), { id: Date.now(), sender: 'You', text }]);
    setChatInput('');
    setChatOpen(false);
    setKeyboardEmojiOpen(false);
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
    setVacatedSeat(null);
    setReadyPlayerNames(new Set());
    setGrabWinner(null);
    setContinueCountdown(5);
    setFrozenLyricLines(null);
    setGrabResultPending(false);
    setSuccessCardVisible(false);
    setSingerStage('hidden');
    setSelectedPlayer(null);
    setChatOpen(false);
    setMicMuted(false);
    setChats([{ sender: 'System', text: 'Back in room. Waiting for next start.' }]);
  };

  const buzzAction = phase === 'ended' ? returnToRoom : handleBuzz;

  return (
    <div ref={roomRef} id="active-song-room" className="absolute inset-0 z-50 overflow-hidden bg-[#080024] text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_74%,rgba(72,233,255,0.34),transparent_16%),radial-gradient(circle_at_20%_58%,rgba(253,28,220,0.34),transparent_28%),radial-gradient(circle_at_80%_40%,rgba(23,100,255,0.34),transparent_30%),linear-gradient(180deg,#05001f_0%,#140044_52%,#05001d_100%)]" />
      <div className="absolute inset-0 opacity-55 bg-[linear-gradient(115deg,transparent_0%,rgba(255,40,230,0.28)_12%,transparent_28%),linear-gradient(245deg,transparent_0%,rgba(33,164,255,0.28)_13%,transparent_31%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,transparent,rgba(18,0,58,0.84)),repeating-linear-gradient(90deg,rgba(255,255,255,0.14)_0_1px,transparent_1px_42px),repeating-linear-gradient(0deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_34px)] [perspective:480px]" />
      <div className="absolute left-1/2 top-[62%] h-[22%] w-[74%] -translate-x-1/2 rounded-t-full border-t border-cyan-200/70 opacity-80" />

      {phase !== 'ended' && (
      <header className="absolute left-0 right-0 top-0 z-[80] flex items-start justify-between px-4 pt-11">
        <div className="relative">
          <button
            onClick={() => setRoomMenuOpen((prev) => !prev)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/95 transition-colors hover:bg-white/10"
            aria-label="Room menu"
            aria-expanded={roomMenuOpen}
          >
            <Menu className="h-5 w-5 stroke-[3]" />
          </button>

          <AnimatePresence>
            {roomMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.16 }}
                className="absolute left-0 top-9 z-[90] w-28 overflow-hidden rounded-xl border border-white/12 bg-black/70 py-1.5 text-xs font-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.34)] backdrop-blur-md"
              >
                <button
                  onClick={handleGameplayInfo}
                  className="block w-full px-3 py-2 text-left transition-colors hover:bg-white/10"
                >
                  游戏玩法
                </button>
                <button
                  onClick={handleExitRoom}
                  className="block w-full px-3 py-2 text-left text-rose-100 transition-colors hover:bg-white/10"
                >
                  退出房间
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-1 text-center">
          <h1 className="font-display text-[0.92rem] font-extrabold leading-none tracking-normal">Room 5187024</h1>
          <div className="mt-1.5 flex items-center justify-center gap-2 text-[0.74rem] font-semibold text-white/85">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.62rem] uppercase text-white/70">
              {phase === 'intro' ? introCue : phase === 'ready' ? `Ready ${readyCountdown}` : phase === 'ended' ? 'Ended' : `Round ${round}/${TOTAL_ROUNDS}`}
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
            {phase === 'intro' ? (
              <motion.div
                key="game-start-intro"
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 1.03 }}
                transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
                className="relative h-[9.55rem] overflow-hidden rounded-[1.8rem] border-[2px] border-cyan-200/90 bg-[#080033]/78 px-5 py-5 text-center shadow-[0_0_22px_rgba(34,211,238,0.76),inset_0_0_30px_rgba(236,72,153,0.28)] backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.4, 1.12, 1], opacity: [0, 1, 0.75] }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/22 bg-[conic-gradient(from_0deg,rgba(34,211,238,0.04),rgba(236,72,153,0.42),rgba(251,191,36,0.24),rgba(34,211,238,0.04))]"
                />
                <motion.div
                  initial={{ opacity: 0, scaleX: 0.2 }}
                  animate={{ opacity: [0, 1, 0], scaleX: [0.2, 1.2, 1.8] }}
                  transition={{ duration: 1.2, repeat: 1, ease: 'easeOut' }}
                  className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-100 to-transparent"
                />
                <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.6)]">
                  <Sparkles className="h-7 w-7 fill-white/70 text-white" />
                </div>
                <motion.h2
                  key={introCue}
                  initial={{ opacity: 0, scale: 0.74, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.22, y: -8 }}
                  transition={{ duration: 0.26, ease: 'easeOut' }}
                  className="relative z-10 mt-3 font-display text-[2.35rem] font-black uppercase leading-none text-white"
                >
                  {introCue}
                </motion.h2>
                <p className="relative z-10 mt-2 text-[0.72rem] font-bold text-cyan-100/70">
                  {room.title} · {song.title}
                </p>
                <div className="relative z-10 mx-auto mt-4 flex w-36 items-center gap-1.5">
                  {[0, 1, 2, 3, 4, 5].map((bar) => (
                    <motion.span
                      key={bar}
                      animate={{ scaleY: [0.35, 1.25, 0.45], opacity: [0.35, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 0.72, delay: bar * 0.08 }}
                      className="h-7 flex-1 origin-center rounded-full bg-gradient-to-t from-fuchsia-500 to-cyan-300"
                    />
                  ))}
                </div>
              </motion.div>
            ) : phase === 'ready' ? (
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
                  <span className="text-[0.68rem] font-bold uppercase text-white/55">
                    {youReady ? '等待开始游戏' : 'Auto ready in'}
                  </span>
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

        <div className="pointer-events-none absolute inset-0 z-35">
          {displayedSeats.map((player, index) => {
            const isPerformer = Boolean(player && performerHighlightActive && player.name === resultWinner?.name);

            return (
              <button
                key={`${player?.name ?? 'vacant'}-${index}`}
                onClick={() => {
                  if (!player) return;
                  setReportMenuOpen(false);
                  setSelectedPlayer(player);
                }}
                disabled={!player}
                className={`pointer-events-auto absolute ${seatPositions[index]} w-[3.15rem] transition-transform duration-300 ${isPerformer ? 'z-40 scale-125' : 'z-30 scale-100'}`}
              >
                <div className="relative flex flex-col items-center">
                  {isPerformer && (
                    <motion.span
                      className="pointer-events-none absolute -inset-1.5 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.55),rgba(236,72,153,0.32),transparent_72%)] blur-sm"
                      animate={{ opacity: [0.55, 1, 0.55] }}
                      transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                    />
                  )}
                  <span className={`absolute -left-0.5 -top-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-full text-[0.56rem] font-extrabold shadow-[0_0_12px_rgba(72,111,255,0.9)] ${index % 2 === 0 ? 'bg-gradient-to-br from-fuchsia-400 to-indigo-500' : 'bg-gradient-to-br from-cyan-400 to-indigo-500'}`}>
                    {index + 1}
                  </span>
                  <div className={`relative flex h-[2.85rem] w-[2.85rem] items-center justify-center overflow-hidden rounded-full border-2 bg-[#10003b] transition-all duration-300 ${player ? isPerformer ? 'border-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.9),0_0_28px_rgba(34,211,238,0.75)]' : player.name === singer.name && phase === 'live' ? 'border-amber-300 shadow-[0_0_12px_rgba(130,74,255,0.78)]' : index % 2 === 0 ? 'border-fuchsia-400 shadow-[0_0_12px_rgba(130,74,255,0.78)]' : 'border-cyan-400 shadow-[0_0_12px_rgba(130,74,255,0.78)]' : 'border-dashed border-white/24 bg-white/6 shadow-[0_0_12px_rgba(130,74,255,0.78)]'}`}>
                    {player ? (
                      <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Users className="h-4 w-4 text-white/28" />
                    )}
                  </div>
                  {player?.name === 'You' && floatingEmojis.map((item) => (
                    <span
                      key={item.id}
                      className="pointer-events-none absolute left-1/2 top-[-1.55rem] z-50 -translate-x-1/2 text-2xl leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    >
                      {item.emoji}
                    </span>
                  ))}
                  {player && phase === 'ready' && readyPlayerNames.has(player.name) && (
                    <span className="absolute right-0 top-0 z-20 h-3.5 w-3.5 rounded-full border-2 border-[#080024] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.95)]" />
                  )}
                  {player && (
                    <div className={`-mt-0.5 w-full rounded-full px-1 py-0.5 text-center shadow-[0_7px_12px_rgba(0,0,0,0.26)] backdrop-blur-sm ${isPerformer ? 'bg-amber-300/20' : 'bg-black/34'}`}>
                      <p className="truncate font-display text-[0.62rem] font-extrabold leading-none text-white">{player.name}</p>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
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

        <AnimatePresence>
          {lampEffectVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="pointer-events-none absolute inset-0 z-[45] overflow-hidden"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((stick) => {
                const fromLeft = stick % 2 === 0;
                return (
                  <motion.span
                    key={stick}
                    initial={{
                      opacity: 0,
                      y: 76,
                      x: fromLeft ? -34 : 34,
                      rotate: fromLeft ? -28 : 28,
                      scale: 0.76
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [-10, -112, -176],
                      x: fromLeft ? [0, 22, 52] : [0, -22, -52],
                      rotate: fromLeft ? [-28, -8, 10] : [28, 8, -10],
                      scale: [0.76, 1.1, 0.86]
                    }}
                    transition={{ duration: 1, delay: stick * 0.045, ease: 'easeOut' }}
                    className={`absolute bottom-[7.8rem] h-14 w-2.5 rounded-full shadow-[0_0_18px_currentColor] ${
                      fromLeft ? 'left-[22%] text-cyan-200' : 'right-[22%] text-fuchsia-200'
                    }`}
                  >
                    <span className={`block h-full w-full rounded-full ${
                      stick % 3 === 0
                        ? 'bg-cyan-300'
                        : stick % 3 === 1
                          ? 'bg-fuchsia-300'
                          : 'bg-amber-200'
                    }`} />
                  </motion.span>
                );
              })}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 0], scale: [0.6, 1.25, 1.75] }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute left-1/2 top-[46%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/35 bg-[radial-gradient(circle,rgba(34,211,238,0.28),rgba(236,72,153,0.12),transparent_68%)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {lampMessageVisible && opponentSinging && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="pointer-events-none absolute left-1/2 top-[63%] z-40 -translate-x-1/2 rounded-full border border-amber-200/28 bg-black/52 px-4 py-2 text-[0.72rem] font-black text-amber-50 shadow-[0_0_20px_rgba(251,191,36,0.22)] backdrop-blur-md"
            >
              You给{resultWinner?.name ?? '其他玩家'}爆灯x1
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {giftToast && (
            <motion.div
              key={giftToast.id}
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              className="pointer-events-none absolute left-1/2 top-[48%] z-[70] -translate-x-1/2 rounded-2xl border border-fuchsia-200/28 bg-black/62 px-4 py-3 text-center text-sm font-black text-white shadow-[0_0_24px_rgba(236,72,153,0.3)] backdrop-blur-md"
            >
              <span className="text-cyan-200">{giftToast.fromId}</span>
              <span> 给 {giftToast.toName} 送了 </span>
              <span className="align-middle text-3xl">{giftToast.icon}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-3 left-3 z-30 flex gap-2">
          <button onClick={() => setEmojiPanelOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Emoji">
            <SmilePlus className="h-5 w-5" />
          </button>
          <button onClick={() => setChatOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Chat">
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-3 right-3 z-30 flex gap-2">
          <button onClick={() => openGiftPanel()} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Gift">
            <Gift className="h-5 w-5" />
          </button>
          <button onClick={() => setMuted((prev) => !prev)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Volume">
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          {phase === 'ready' && (
            <button
              onClick={() => setMicMuted((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md"
              aria-label={micMuted ? 'Turn mic on' : 'Turn mic off'}
            >
              {micMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          )}
        </div>

        {showMainActionButton && (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={buzzAction}
            disabled={buzzLocked}
            className={`absolute bottom-[4.65rem] right-4 z-30 flex h-[5.65rem] w-[5.65rem] items-center justify-center rounded-full p-[0.36rem] text-white shadow-[0_0_0_7px_rgba(254,73,255,0.18),0_0_28px_rgba(255,76,220,0.95)] transition-transform ${buzzLocked ? 'cursor-default' : ''}`}
            aria-label={buzzLabel}
          >
            {(showLyricProgress || phase === 'ready') && (
              <>
                <span className="pointer-events-none absolute -inset-2 rounded-full border-[6px] border-white/16" />
                <span
                  className="pointer-events-none absolute -inset-2 rounded-full drop-shadow-[0_0_10px_rgba(255,76,220,0.95)]"
                  style={phase === 'ready' ? readyProgressRing : lyricProgressRing}
                  aria-hidden="true"
                />
              </>
            )}
            <span className={`absolute inset-[0.52rem] rounded-full border-[3px] ${
              submitWindowActive
                ? 'border-cyan-200/90 bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500'
                : opponentLampActive
                  ? 'border-rose-100/90 bg-gradient-to-br from-red-500 via-fuchsia-600 to-amber-300'
                : 'border-fuchsia-200/90 bg-gradient-to-br from-rose-400 via-orange-400 to-amber-300'
            }`} />
            <span className="relative flex flex-col items-center leading-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)]">
              <span className={buzzLocked ? 'font-display text-[2.15rem] font-black' : submitWindowActive ? 'text-[0.96rem] font-black' : opponentLampActive ? 'text-[1.02rem] font-black' : 'text-[1.18rem] font-black'}>
                {buzzLabel}
              </span>
              {opponentLampActive && !freeLampUsed && (
                <span className="mt-1 text-[0.62rem] font-black text-white/82">免费</span>
              )}
            </span>
            <Mic2 className="absolute bottom-5 h-4 w-4 text-white/26" />
          </motion.button>
        )}

        <AnimatePresence>
          {rechargeOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[85] flex items-end bg-black/42 backdrop-blur-[2px]"
              onClick={() => setRechargeOpen(false)}
            >
              <motion.div
                initial={{ y: 240 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ y: 240 }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className="w-full rounded-t-[1.55rem] border border-white/10 bg-[#0d0730]/96 px-4 pb-5 pt-4 shadow-[0_-16px_40px_rgba(236,72,153,0.2)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/18" />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-black text-white">充值钻石</h3>
                    <p className="mt-0.5 text-[0.68rem] font-semibold text-white/45">爆灯需要💎X1</p>
                  </div>
                  <button
                    onClick={() => setRechargeOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
                    aria-label="Close recharge"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { gems: 60, price: '$0.99' },
                    { gems: 300, price: '$4.99' },
                    { gems: 680, price: '$9.99' }
                  ].map((pack) => (
                    <button
                      key={pack.gems}
                      className="rounded-2xl border border-cyan-200/18 bg-white/[0.07] px-2 py-3 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    >
                      <Gem className="mx-auto h-5 w-5 fill-cyan-200/70 text-cyan-200" />
                      <p className="mt-1 font-display text-sm font-black">{pack.gems}</p>
                      <p className="mt-0.5 text-[0.62rem] font-bold text-white/45">{pack.price}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {giftPanelOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[84] flex items-end bg-black/24"
              onClick={() => setGiftPanelOpen(false)}
            >
              <motion.div
                initial={{ y: 310 }}
                animate={{ y: 0 }}
                exit={{ y: 310 }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className="h-[43%] w-full rounded-t-[1.55rem] bg-[#241052]/98 px-4 pb-5 pt-3 shadow-[0_-16px_40px_rgba(0,0,0,0.28)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/22" />
                <div className="mb-4 flex items-start gap-2 overflow-hidden">
                  {(giftPanelMode === 'single'
                    ? displayedSeats.filter((player): player is SeatPlayer => Boolean(player && player.name === giftRecipientName))
                    : displayedSeats
                  ).map((player, index) => (
                    <button
                      key={`${player?.name ?? 'empty'}-${index}`}
                      disabled={!player}
                      onClick={() => player && giftPanelMode === 'all' && setGiftRecipientName(player.name)}
                      className={`min-w-0 rounded-xl p-1.5 transition ${giftPanelMode === 'single' ? 'w-16 flex-none' : 'flex-1'} ${player && giftRecipientName === player.name ? 'bg-cyan-300/18 ring-1 ring-cyan-200/70' : 'bg-white/[0.04]'} ${!player ? 'opacity-35' : ''}`}
                    >
                      <div className="mx-auto h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-white/10">
                        {player && <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />}
                      </div>
                      <p className="mt-1 truncate text-[0.55rem] font-black text-white/78">{player?.name ?? ''}</p>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {giftOptions.map((gift) => (
                    <button
                      key={`${gift.icon}-${gift.price}`}
                      onClick={() => handleGift(gift)}
                      className="rounded-2xl border border-white/10 bg-white/[0.07] px-2 py-3 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:bg-white/[0.1]"
                    >
                      <div className="text-3xl leading-none">{gift.icon}</div>
                      <p className="mt-1 text-[0.68rem] font-black text-cyan-100">💎{gift.price}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute left-5 top-[72%] z-30 flex max-w-[15rem] flex-col gap-1.5">
          {sentChatBubbles.slice(-3).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="w-fit max-w-full rounded-2xl bg-black/46 px-3 py-2 text-[0.72rem] font-bold text-white shadow-[0_0_16px_rgba(34,211,238,0.18)] backdrop-blur-md"
            >
              <span className="text-cyan-200">{item.sender}：</span>{item.text}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {emojiPanelOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[84] flex items-end bg-black/18"
              onClick={() => setEmojiPanelOpen(false)}
            >
              <motion.div
                initial={{ y: 310 }}
                animate={{ y: 0 }}
                exit={{ y: 310 }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className="h-[47%] w-full rounded-t-[1.55rem] bg-[#2a0f56]/98 px-5 pb-6 pt-3 shadow-[0_-16px_40px_rgba(0,0,0,0.28)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/22" />
                <div className="mb-2 flex items-center justify-end text-white">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white/82" onClick={() => setEmojiPanelOpen(false)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-x-5 gap-y-6">
                  {emojiOptions.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleEmoji(item.emoji)}
                      className="flex items-center justify-center rounded-2xl p-1.5 transition-colors hover:bg-white/8"
                    >
                      <span className="text-[2.35rem] leading-none">{item.emoji}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[84] flex items-end bg-black/18"
              onClick={() => setChatOpen(false)}
            >
              <motion.form
                onSubmit={handleSendChat}
                initial={{ y: 320 }}
                animate={{ y: 0 }}
                exit={{ y: 320 }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className="w-full bg-[#d6d9df] pb-5 pt-3"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center gap-2 bg-white px-4 py-3">
                  <div className="flex h-11 min-w-0 flex-1 items-center rounded-full bg-[#f2f3f6] px-3">
                    <input
                      autoFocus
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="说点什么"
                      className="h-full min-w-0 flex-1 bg-transparent text-base text-[#111827] outline-none placeholder:text-[#9ca3af]"
                    />
                    <button type="button" onClick={() => setKeyboardEmojiOpen((open) => !open)} className="flex h-9 w-9 items-center justify-center rounded-full text-[#30343b]">
                      {keyboardEmojiOpen ? <Keyboard className="h-7 w-7" /> : <SmilePlus className="h-7 w-7" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-400 text-white shadow-sm"
                    aria-label="发送"
                  >
                    <Send className="h-6 w-6 fill-white" />
                  </button>
                </div>
                <div className={`border-t border-black/10 text-[#111827] ${keyboardEmojiOpen ? 'bg-white px-5 pb-2 pt-4' : 'px-2 pt-3'}`}>
                  {keyboardEmojiOpen ? (
                    <>
                      <div className="grid max-h-[17.5rem] grid-cols-8 gap-x-3 gap-y-3 overflow-hidden">
                        {keyboardEmojiOptions.map((emoji, index) => (
                          <button
                            key={`${emoji}-${index}`}
                            type="button"
                            onClick={() => appendChatInput(emoji)}
                            className="flex h-9 items-center justify-center text-[1.75rem]"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between px-1 text-[#5b6068]">
                        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef0f4]" onClick={() => setKeyboardEmojiOpen(true)}>
                          <SmilePlus className="h-8 w-8" />
                        </button>
                        <button type="button" className="flex h-12 w-12 items-center justify-center text-4xl leading-none text-[#30343b]">☆</button>
                        <button type="button" onClick={deleteChatInput} className="flex h-12 w-12 items-center justify-center rounded-full text-2xl">⌫</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-3 grid grid-cols-8 gap-2 text-center text-xl">
                        {['我', '你', '好', '这', '那', '是', '这个', '不'].map((key) => (
                          <button key={key} type="button" onClick={() => appendChatInput(key)} className="rounded-md py-1.5">{key}</button>
                        ))}
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {['123', ',。?!', 'ABC', 'DEF', '⌫', '#@¥', 'GHI', 'JKL', 'MNO', '^^', 'ABC', 'PQRS', 'TUV', 'WXYZ'].map((key, index) => (
                          <button
                            key={`${key}-${index}`}
                            type="button"
                            onClick={() => key === '⌫' ? deleteChatInput() : appendChatInput(key)}
                            className="h-12 rounded-lg bg-white text-lg shadow-sm"
                          >
                            {key}
                          </button>
                        ))}
                        <button type="button" onClick={() => setKeyboardEmojiOpen(true)} className="h-12 rounded-lg bg-white text-lg">☺</button>
                        <button type="button" onClick={() => appendChatInput(' ')} className="col-span-2 h-12 rounded-lg bg-white text-lg">空格</button>
                        <button type="submit" className="col-span-2 h-12 rounded-lg bg-[#0a8cff] text-lg font-bold text-white">发送</button>
                      </div>
                    </>
                  )}
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[95] flex items-center justify-center bg-black/32 px-5 pt-40"
              onClick={() => {
                setReportMenuOpen(false);
                setSelectedPlayer(null);
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.96 }}
                className="w-full max-w-[20rem] rounded-3xl border border-white/10 bg-[#0d0730]/95 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.34)] backdrop-blur-md"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center gap-3">
                  <img src={selectedPlayer.avatarUrl} alt={selectedPlayer.name} className="h-14 w-14 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg font-black text-white">{selectedPlayer.name}</p>
                    <p className="text-[0.78rem] text-white/45">Seat {selectedPlayer.seat} · ID {834200 + selectedPlayer.seat}</p>
                  </div>
                  <div className="relative flex items-center gap-2">
                    <button
                      onClick={() => setReportMenuOpen((open) => !open)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-amber-100"
                      aria-label="Report user"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                    <AnimatePresence>
                      {reportMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.96 }}
                          className="absolute right-10 top-9 z-10 w-24 rounded-xl border border-white/12 bg-black/72 px-2 py-1.5 text-center text-[0.68rem] font-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur-md"
                        >
                          <button
                            onClick={() => {
                              setReportMenuOpen(false);
                              showToast('举报该用户');
                            }}
                            className="w-full rounded-lg px-2 py-1.5 hover:bg-white/10"
                          >
                            举报该用户
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={() => {
                        setReportMenuOpen(false);
                        setSelectedPlayer(null);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleFollow(selectedPlayer)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-cyan-400 px-3 py-3 text-sm font-black text-[#05051a]"
                  >
                    {followedPlayers.has(selectedPlayer.name) ? <CheckCircle2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    {followedPlayers.has(selectedPlayer.name) ? 'Following' : 'Follow'}
                  </button>
                  <button
                    onClick={() => openGiftPanel(selectedPlayer.name, 'single')}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-fuchsia-500 px-3 py-3 text-sm font-black text-white"
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
          {exitConfirmOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[90] flex items-center justify-center bg-black/46 px-6 backdrop-blur-sm"
              onClick={() => setExitConfirmOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-[18rem] rounded-[1.35rem] border border-white/12 bg-[#10052f]/94 px-5 py-5 text-center shadow-[0_0_28px_rgba(236,72,153,0.22)]"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="font-display text-base font-black leading-snug text-white">
                  当前唱的正嗨，确定要离开吗
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => setExitConfirmOpen(false)}
                    className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-3 py-2.5 text-xs font-black text-white shadow-[0_0_18px_rgba(34,211,238,0.28)]"
                  >
                    再玩一会
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-full bg-white/12 px-3 py-2.5 text-xs font-black text-white/82 transition-colors hover:bg-white/18"
                  >
                    离开房间
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'result' && !((grabWinner === 'me' && ((lastSuccess && (singerStage === 'celebrate' || singerStage === 'exit')) || (!lastSuccess && (singerStage === 'sad' || singerStage === 'exit')))) || (grabWinner === 'other' && lastSuccess && (singerStage === 'celebrate' || singerStage === 'exit'))) && (
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
                  ? lastSuccess ? `恭喜${resultWinnerId}抢唱成功` : '抢唱失败'
                  : grabWinner === 'other'
                    ? `恭喜${resultWinnerId ?? '其他玩家'}抢唱成功`
                    : lastSuccess ? 'Success' : 'Miss'}
              </p>
              {!grabWinner && (
                <p className="mt-1 text-xs font-bold text-white/58">
                  Score {score}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
