import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Wifi, 
  ChevronLeft, 
  Mic, 
  Music, 
  Zap, 
  Trophy, 
  Volume2, 
  RefreshCw, 
  Sparkles,
  Gauge,
  Ban,
  CheckCircle2
} from 'lucide-react';
import { MatchState, MatchedPlayer, NetworkState, Soundtrack } from '../types';
import avatar04 from '../assets/avatars/avatar_04.jpg';
import avatar12 from '../assets/avatars/avatar_12.jpg';
import avatar18 from '../assets/avatars/avatar_18.jpg';
import avatar30 from '../assets/avatars/avatar_30.jpg';
import avatar31 from '../assets/avatars/avatar_31.jpg';
import avatar32 from '../assets/avatars/avatar_32.jpg';

interface MatchingViewProps {
  onBackToLogin: () => void;
  loginMethod: string;
  networkLatency: NetworkState;
  soundtrack: Soundtrack;
  demoPhase: MatchState;
  onDemoPhaseChange: (phase: MatchState) => void;
}

const MOCK_OPPONENTS: MatchedPlayer[] = [
  { id: 'p1', name: 'Luna 🌙', avatarUrl: avatar18, level: 12, country: '🇨🇦 Canada', micStatus: 'connecting' },
  { id: 'p2', name: 'RhythmKing 👑', avatarUrl: avatar12, level: 24, country: '🇧🇷 Brazil', micStatus: 'muted' },
  { id: 'p3', name: 'Yuki ✨', avatarUrl: avatar30, level: 18, country: '🇯🇵 Japan', micStatus: 'ready' },
  { id: 'p4', name: 'Sarah 💖', avatarUrl: avatar04, level: 9, country: '🇺🇸 USA', micStatus: 'ready' }
];

const SONG_LIST = [
  { title: 'Blinding Lights', artist: 'The Weeknd', lyric: "“I've been on my own for long enough, maybe you can...”", bpm: 171 },
  { title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', lyric: "“I do the same thing I told you that I never would...”", bpm: 150 },
  { title: 'Flowers', artist: 'Miley Cyrus', lyric: "“I can buy myself flowers, write my name in the sand...”", bpm: 118 }
];

const makeCurrentPlayer = (loginMethod: string): MatchedPlayer => ({
  id: 'me',
  name: loginMethod === 'Guest' ? 'Guest-3904' : `Starmaker_${loginMethod}`,
  avatarUrl: avatar32,
  level: 1,
  country: 'Global',
  micStatus: 'ready',
  isMe: true
});

const getSeedPlayers = (loginMethod: string): MatchedPlayer[] => [
  makeCurrentPlayer(loginMethod),
  MOCK_OPPONENTS[0],
  MOCK_OPPONENTS[1]
];

const getNetworkDetails = (networkLatency: NetworkState) => {
  switch (networkLatency) {
    case 'OPTIMAL':
      return {
        label: 'Optimal 24ms',
        color: 'text-green-400',
        accent: 'text-green-300',
        wait: '< 1.8s',
        queue: '14,208 Online',
        delay: 1800,
        foundDelay: 1700,
        introDelay: 2400,
        status: 'Low-latency queue lock'
      };
    case 'LAGGY':
      return {
        label: 'Laggy 180ms',
        color: 'text-yellow-400',
        accent: 'text-yellow-300',
        wait: '~ 3.8s',
        queue: '8,642 Online',
        delay: 3800,
        foundDelay: 2400,
        introDelay: 3200,
        status: 'Compensating room sync'
      };
    case 'INTERMITTENT':
      return {
        label: 'Unstable 340ms',
        color: 'text-red-400',
        accent: 'text-red-300',
        wait: '~ 6.5s',
        queue: '3,109 Online',
        delay: 6500,
        foundDelay: 3200,
        introDelay: 4200,
        status: 'Retrying stage handshake'
      };
  }
};

export const MatchingView: React.FC<MatchingViewProps> = ({ 
  onBackToLogin, 
  loginMethod,
  networkLatency,
  soundtrack,
  demoPhase,
  onDemoPhaseChange
}) => {
  const [matchState, setMatchState] = useState<MatchState>('SEARCHING');
  const [dots, setDots] = useState('...');
  const [activeSong] = useState(SONG_LIST[0]);
  const [matchedPlayers, setMatchedPlayers] = useState<MatchedPlayer[]>([]);
  const [score, setScore] = useState(0);
  const [singingPulse, setSingingPulse] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [progressWidth, setProgressWidth] = useState(0);
  const networkDetails = getNetworkDetails(networkLatency);

  const applyMatchState = (phase: MatchState) => {
    setMatchState(phase);
    onDemoPhaseChange(phase);
  };

  useEffect(() => {
    setMatchState(demoPhase);
    if (demoPhase === 'SEARCHING') {
      setMatchedPlayers([]);
      setScore(0);
      setProgressWidth(0);
      return;
    }

    if (demoPhase !== 'SEARCHING') {
      setMatchedPlayers((players) => (
        players.length >= 3 ? players : getSeedPlayers(loginMethod)
      ));
    }
  }, [demoPhase, loginMethod]);

  // Animated loading dots
  useEffect(() => {
    if (matchState !== 'SEARCHING') return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [matchState]);

  // Handle matching phase transition
  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;

    if (matchState === 'SEARCHING') {
      // 1. Find players in 3 seconds
      t1 = setTimeout(() => {
        const shuffled = [...MOCK_OPPONENTS].sort(() => 0.5 - Math.random());
        const chosen = shuffled.slice(0, 2);

        setMatchedPlayers([makeCurrentPlayer(loginMethod), ...chosen]);
        applyMatchState('FOUND');
      }, networkDetails.delay);
    } else if (matchState === 'FOUND') {
      // 2. Introduce players / Show VS overlay for 3 seconds
      t2 = setTimeout(() => {
        applyMatchState('INTRO_VS');
      }, networkDetails.foundDelay);
    } else if (matchState === 'INTRO_VS') {
      // 3. Ready to play after 3.5 seconds
      t3 = setTimeout(() => {
        applyMatchState('READY');
      }, networkDetails.introDelay);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [matchState, loginMethod, networkDetails.delay, networkDetails.foundDelay, networkDetails.introDelay]);

  // Periodic simulated lyric progress bar during gameplay
  useEffect(() => {
    if (matchState !== 'READY') return;
    const interval = setInterval(() => {
      setProgressWidth((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [matchState]);

  // Interactive mock singing score builder
  const handleMockSing = () => {
    setSingingPulse(true);
    setTimeout(() => setSingingPulse(false), 200);

    const scores = [85, 92, 98, 100];
    const feedbacks = ['COOL!', 'GREAT! ✨', 'PERFECT! 🔥', 'STREAK! ⚡'];
    const idx = Math.floor(Math.random() * scores.length);
    
    setScore((prev) => prev + scores[idx]);
    setFeedbackText(feedbacks[idx]);

    // Clear feedback text after 1s
    const t = setTimeout(() => setFeedbackText(''), 1000);
    return () => clearTimeout(t);
  };

  const handleRestartMatch = () => {
    applyMatchState('SEARCHING');
    setScore(0);
    setProgressWidth(0);
    setMatchedPlayers([]);
  };

  return (
    <div
      id="matching-view-container"
      className="relative flex flex-col h-full w-full overflow-hidden select-none app-container-immersive"
      style={{
        '--rush-accent': soundtrack.accent,
        '--rush-secondary': soundtrack.secondary
      } as React.CSSProperties}
    >
      
      {/* 1. Immersive UI Background Glow Sphere */}
      <div className="glow-sphere-immersive" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: `${soundtrack.accent}1f` }} />
      <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full blur-[70px] pointer-events-none" style={{ backgroundColor: `${soundtrack.secondary}1f` }} />

      {/* HEADER BAR */}
      <div id="matching-header" className="relative flex items-center justify-between px-4 pt-11 pb-3 border-b border-white/5 bg-black/20 backdrop-blur-md z-30">
        <button 
          id="btn-back-to-login"
          onClick={onBackToLogin}
          className="flex items-center gap-1 text-white/70 hover:text-white text-xs font-medium cursor-pointer transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Leave</span>
        </button>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
          <Wifi size={10} className={`${networkDetails.color} animate-pulse`} />
          <span className="text-[9px] font-mono font-medium text-white/80">{networkDetails.label}</span>
        </div>

        <span className="text-[10px] font-mono uppercase font-bold text-pink-400 tracking-wider">
          RUSH #1
        </span>
      </div>

      {/* BODY WORKSPACE */}
      <div id="matching-body" className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 flex flex-col justify-between z-10">

        {/* ========================================================= */}
        {/* PHASE 1: SEARCHING FOR PLAYERS (Interactive Radar) */}
        {/* ========================================================= */}
        {matchState === 'SEARCHING' && (
          <div id="searching-phase" className="flex-1 flex flex-col justify-between py-6">
            <div className="text-center">
              <h2 className="text-xl font-bold font-display text-white tracking-tight">
                Finding Room Match
              </h2>
              <p className="text-xs text-white/50 font-sans mt-1">
                Lobbying fast singing battle competitors...
              </p>
            </div>

            {/* Radar Animation Area with Immersive UI Sound Waves */}
            <div className="relative h-[200px] w-full flex items-center justify-center my-6">
              
              {/* Sound wave rings radiating */}
              <div className="sound-wave-immersive wave-immersive-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ripple" />
              <div className="sound-wave-immersive wave-immersive-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ripple" style={{ animationDelay: '1s' }} />
              <div className="sound-wave-immersive wave-immersive-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ripple" style={{ animationDelay: '2s' }} />

              {/* Central User Glow bubble */}
              <div className="relative w-16 h-16 rounded-full avatar-bubble-immersive z-20 overflow-hidden">
                <img 
                  src={avatar31}
                  alt="My Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Floating micro star */}
                <motion.div 
                  className="absolute bottom-1 right-1 text-yellow-400 bg-black/60 p-1 rounded-full border border-yellow-400/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={8} />
                </motion.div>
              </div>

              {/* Mock floating icons indicating finding users */}
              <motion.div 
                className="absolute top-2 left-[20%] text-cyan-400"
                animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mic size={14} />
              </motion.div>
              <motion.div 
                className="absolute bottom-4 right-[25%] text-pink-400"
                animate={{ scale: [1.1, 0.8, 1.1], opacity: [0.9, 0.4, 0.9] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Music size={12} />
              </motion.div>
            </div>

            <div className="space-y-4">
              {/* Searching progress status indicator (Immersive Glass card) */}
              <div className="login-card-immersive rounded-[24px] p-4.5 flex flex-col gap-2 shadow-inner">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-purple-400" />
                    <span>Active Queue</span>
                  </span>
                  <span className="text-white font-bold">{networkDetails.queue}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                  <span>Estimated Wait</span>
                  <span className={`${networkDetails.accent} font-bold`}>{networkDetails.wait}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                  <span>Match Status</span>
                  <span className="text-cyan-300 font-medium font-sans flex items-center gap-1">
                    {networkDetails.status}{dots}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                  <span className="flex items-center gap-1">
                    <Gauge size={12} style={{ color: soundtrack.accent }} />
                    <span>{soundtrack.genre}</span>
                  </span>
                  <span className="text-white/80 font-bold">{soundtrack.bpm > 0 ? `${soundtrack.bpm} BPM` : 'Muted'}</span>
                </div>
              </div>

              <button 
                id="btn-cancel-search"
                onClick={onBackToLogin}
                className="btn-guest-immersive w-full h-[40px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer text-xs font-semibold"
              >
                <Ban size={12} />
                <span>Cancel Matchmaking</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PHASE 2: MATCH FOUND (Lobby Entry) */}
        {/* ========================================================= */}
        {matchState === 'FOUND' && (
          <div id="found-phase" className="flex-1 flex flex-col justify-between py-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wide">
                <Zap size={10} /> Match Found!
              </span>
              <h2 className="text-xl font-black font-display text-white tracking-tight mt-2">
                Assembling Room...
              </h2>
            </div>

            {/* Matched Players Row Cards */}
            <div className="space-y-3 my-6">
              {matchedPlayers.map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.25, type: 'spring' }}
                  className={`flex items-center justify-between p-3.5 rounded-[20px] ${
                    player.isMe 
                      ? 'border-2 bg-white/8' 
                      : 'login-card-immersive'
                  }`}
                  style={player.isMe ? {
                    borderColor: soundtrack.accent,
                    background: `linear-gradient(90deg, ${soundtrack.accent}26, ${soundtrack.secondary}26)`
                  } : undefined}
                >
                  <div className="flex items-center gap-3">
                    {/* Level Badge and Avatar bubble */}
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 avatar-bubble-immersive" style={{ borderColor: player.isMe ? soundtrack.accent : undefined }}>
                        <img 
                          src={player.avatarUrl} 
                          alt={player.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-[8px] px-1 bg-purple-600 text-white border border-white/10 rounded-full font-mono font-bold">
                        {player.level}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                        {player.name}
                        {player.isMe && (
                          <span className="text-[9px] px-1 text-white rounded font-mono uppercase font-black" style={{ backgroundColor: soundtrack.accent }}>Me</span>
                        )}
                      </span>
                      <span className="text-[10px] text-white/55 font-sans mt-0.5 flex items-center gap-1">
                        <span>{player.country}</span>
                      </span>
                    </div>
                  </div>

                  {/* Status Ring */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-mono text-cyan-300 font-medium">Ready</span>
                    </div>
                    <CheckCircle2 size={16} className="text-cyan-400" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center font-mono text-[11px] text-white/30 animate-pulse">
              Buffering stage sync with players...
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PHASE 3: INTRO BATTLE VS (Hype Screen) */}
        {/* ========================================================= */}
        {matchState === 'INTRO_VS' && (
          <div id="intro-vs-phase" className="flex-1 flex flex-col justify-between py-6">
            <div className="text-center">
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-pink-400">Battle Song</span>
              <h2 className="text-2xl font-black font-display text-white tracking-tight mt-1">
                {activeSong.title}
              </h2>
              <p className="text-xs text-white/60 font-sans">{activeSong.artist}</p>
            </div>

            {/* Dramatic VS graphics */}
            <div className="relative h-[220px] my-4 flex items-center justify-center">
              {/* Circular radiant background behind VS */}
              <div className="absolute w-[180px] h-[180px] rounded-full blur-xl animate-pulse" style={{ background: `linear-gradient(45deg, ${soundtrack.accent}33, ${soundtrack.secondary}33)` }} />

              {/* Dynamic split panels layout */}
              <div className="flex items-center justify-between w-full px-4 relative z-10">
                {/* Me Profile */}
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 avatar-bubble-immersive" style={{ borderColor: soundtrack.accent, backgroundColor: `${soundtrack.accent}26` }}>
                    <img 
                      src={matchedPlayers[0]?.avatarUrl} 
                      alt="Me" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-[11px] font-bold text-white font-display truncate w-20 text-center">
                    {matchedPlayers[0]?.name}
                  </span>
                  <span className="text-[9px] font-mono text-pink-300">GUEST</span>
                </motion.div>

                {/* VS Badge with Immersive style */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/20 text-white font-extrabold font-display italic text-lg shadow-lg shadow-purple-500/30 glow-purple"
                  style={{ background: `linear-gradient(90deg, ${soundtrack.accent}, ${soundtrack.secondary}, #22d3ee)` }}
                >
                  VS
                </motion.div>

                {/* Opponents Stack */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex -space-x-4 relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500 bg-purple-500/20 shadow-md avatar-bubble-immersive">
                      <img 
                        src={matchedPlayers[1]?.avatarUrl} 
                        alt="Opponent 1" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400 bg-cyan-400/20 shadow-md avatar-bubble-immersive">
                      <img 
                        src={matchedPlayers[2]?.avatarUrl} 
                        alt="Opponent 2" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-white font-display w-24 text-center">
                    Room Competitors
                  </span>
                  <span className="text-[9px] font-mono text-purple-300">LVL 12 & 24</span>
                </motion.div>
              </div>

              {/* Lightning overlay beam */}
              <div className="absolute w-[3px] h-[160px] bg-yellow-400 rotate-45 opacity-60 glow-purple pointer-events-none" />
            </div>

            <div className="text-center">
              <span className="text-xs font-mono font-bold" style={{ color: soundtrack.accent }}>Quick Grab rule:</span>
              <p className="text-xs text-white/50 px-4 mt-0.5 leading-relaxed font-sans">
                {soundtrack.moodLine}. The fastest to tap and sing the next line correctly claims the round points!
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PHASE 4: GAMEPLAY BOARD (Ready / Sing Active) */}
        {/* ========================================================= */}
        {matchState === 'READY' && (
          <div id="gameplay-phase" className="flex-1 flex flex-col justify-between py-3">
            
            {/* Round status & Scoreboard */}
            <div className="flex items-center justify-between login-card-immersive p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5">
                <Trophy size={14} className="text-yellow-400" />
                <span className="text-xs font-bold text-white font-display">BATTLE POINT SCORE</span>
              </div>
              <span
                className="text-sm font-mono font-bold px-2.5 py-0.5 rounded-full border"
                style={{
                  color: soundtrack.accent,
                  backgroundColor: `${soundtrack.accent}14`,
                  borderColor: `${soundtrack.accent}45`
                }}
              >
                {score} pts
              </span>
            </div>

            {/* Opponent score bars mock */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="login-card-immersive p-2 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <img 
                    src={matchedPlayers[1]?.avatarUrl} 
                    alt="P1" 
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-purple-500 avatar-bubble-immersive" 
                  />
                  <span className="text-[10px] text-white/70 truncate">{matchedPlayers[1]?.name}</span>
                </div>
                <span className="text-[10px] font-mono text-purple-300 font-bold">1,420</span>
              </div>
              <div className="login-card-immersive p-2 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <img 
                    src={matchedPlayers[2]?.avatarUrl} 
                    alt="P2" 
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-cyan-400 avatar-bubble-immersive" 
                  />
                  <span className="text-[10px] text-white/70 truncate">{matchedPlayers[2]?.name}</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">950</span>
              </div>
            </div>

            {/* Central Live Lyric board with Immersive Glass layout */}
            <div
              className="login-card-immersive rounded-2xl p-4.5 my-4 border-2 flex flex-col gap-3 relative overflow-hidden"
              style={{ borderColor: `${soundtrack.accent}4d` }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none" style={{ background: `linear-gradient(225deg, ${soundtrack.accent}24, transparent)` }} />
              
              <div className="flex items-center justify-between text-[9px] font-mono text-white/40 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Volume2 size={10} style={{ color: soundtrack.accent }} />
                  {soundtrack.id === 'OFF' ? 'Review Mode' : 'Now Playing'}
                </span>
                <span>{soundtrack.genre}</span>
              </div>

              {/* Lyric prompt */}
              <div className="py-2">
                <p className="text-xs text-white/55 font-sans italic leading-relaxed">
                  {activeSong.lyric}
                </p>
                <div className="h-[2px] w-full bg-white/10 rounded-full mt-3 overflow-hidden">
	                  <div 
	                    className="h-full transition-all ease-linear" 
	                    style={{ width: `${progressWidth}%`, backgroundColor: soundtrack.accent }}
	                  />
                </div>
              </div>

              {/* NEXT LINE challenge strip */}
              <div
                className="p-2.5 rounded-xl bg-purple-950/40 border text-center relative overflow-hidden"
                style={{ borderColor: `${soundtrack.accent}4d` }}
              >
                <span className="absolute top-1 left-2 text-[8px] font-mono font-bold uppercase tracking-wider" style={{ color: soundtrack.accent }}>
                  Finish Lyrical Line!
                </span>
                <p
                  className="text-sm font-extrabold text-transparent bg-clip-text font-display mt-2"
                  style={{ backgroundImage: `linear-gradient(90deg, ${soundtrack.accent}, ${soundtrack.secondary}, #fff)` }}
                >
                  “I look around and, sin city's cold and ...”
                </p>
              </div>

              {/* Feedback Popups */}
              <AnimatePresence>
                {feedbackText && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 10 }}
                    animate={{ scale: 1.1, opacity: 1, y: -20 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none z-30"
                  >
                    <span
                      className="px-4 py-1.5 rounded-full text-white font-black text-xs font-display shadow-lg uppercase italic tracking-wider scale-110"
                      style={{ background: `linear-gradient(90deg, ${soundtrack.accent}, ${soundtrack.secondary})` }}
                    >
                      {feedbackText}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Mock Singing Controller */}
            <div className="space-y-3.5">
              
              <div className="flex flex-col items-center">
                {/* Audio wave rings radiating */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className={`absolute w-full h-full rounded-full border-2 ${singingPulse ? 'scale-125 opacity-100' : 'scale-100 opacity-0'} transition-all duration-300`} style={{ borderColor: `${soundtrack.accent}55` }} />
                  <div className={`absolute w-full h-full rounded-full border border-purple-500/30 ${singingPulse ? 'scale-150 opacity-100' : 'scale-100 opacity-0'} transition-all duration-300 delay-75`} />

                  <button 
                    id="btn-mock-sing"
                    onClick={handleMockSing}
                    className="relative w-16 h-16 rounded-full hover:brightness-110 shadow-lg active:scale-90 transition-transform flex items-center justify-center cursor-pointer glow-purple border border-white/20 z-10"
                    style={{ background: `linear-gradient(45deg, ${soundtrack.accent}, ${soundtrack.secondary}, #22d3ee)` }}
                  >
                    <Mic size={24} className="text-white animate-pulse" />
                  </button>
                </div>
                <span className="text-[10px] font-mono tracking-wide mt-1.5 animate-pulse" style={{ color: soundtrack.accent }}>
                  {soundtrack.id === 'OFF' ? 'AUDIO MUTED - TAP TO SCORE MOCK' : 'TAP MIC TO SING NEXT LINE'}
                </span>
              </div>

              {/* Finish or rematch menu */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                  id="btn-rematch"
                  onClick={handleRestartMatch}
                  className="btn-secondary-immersive h-10 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer text-xs font-semibold"
                >
                  <RefreshCw size={12} className="text-cyan-400" />
                  <span>Restart Match</span>
                </button>
                <button 
                  id="btn-quit-match"
                  onClick={onBackToLogin}
                  className="h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-red-500/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Ban size={12} />
                  <span>Leave Battle</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
