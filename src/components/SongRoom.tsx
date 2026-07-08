import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Send, Award, Heart, Flame, Sparkles, Volume2 } from 'lucide-react';
import { Room, Song } from '../types';

interface SongRoomProps {
  key?: string;
  room: Room;
  song: Song;
  onClose: () => void;
  currentUserAvatar: string;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
}

export default function SongRoom({ room, song, onClose, currentUserAvatar }: SongRoomProps) {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [isSinging, setIsSinging] = useState(false);
  const [score, setScore] = useState(0);
  const [rating, setRating] = useState('C');
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [chats, setChats] = useState<Array<{ sender: string; text: string }>>([
    { sender: room.players[0].name, text: "Let's sing! 🎤" },
    { sender: room.players[1].name, text: "Woah, who is going first?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const reactionIdRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll lyrics and simulate other players singing or reacting
  useEffect(() => {
    // Scroll lyrics timer
    const lyricInterval = setInterval(() => {
      setCurrentLyricIndex((prev) => {
        if (prev === song.lyrics.length - 1) {
          // Reset lyric loop
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    // Random reactions from mock players
    const reactionInterval = setInterval(() => {
      const mockEmojis = ['💖', '🔥', '👏', '🎉', '🌟'];
      const randomEmoji = mockEmojis[Math.floor(Math.random() * mockEmojis.length)];
      triggerReaction(randomEmoji);
    }, 2000);

    // Random chats from mock players
    const chatInterval = setInterval(() => {
      const mockChats = [
        "So good! 🌟",
        "Amazing pitch!",
        "Grab the mic! Who's next?",
        "Aha! Let's compete!",
        "OMG SSS tier loading..."
      ];
      const randomChat = mockChats[Math.floor(Math.random() * mockChats.length)];
      const randomPlayer = room.players[Math.floor(Math.random() * room.players.length)];
      setChats((prev) => [...prev.slice(-6), { sender: randomPlayer.name, text: randomChat }]);
    }, 6000);

    return () => {
      clearInterval(lyricInterval);
      clearInterval(reactionInterval);
      clearInterval(chatInterval);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [song, room]);

  // Simulate score tracking when user is singing
  useEffect(() => {
    if (isSinging) {
      timerRef.current = setInterval(() => {
        setScore((prev) => {
          const added = Math.floor(Math.random() * 40) + 20;
          const newScore = prev + added;
          
          // Calculate rating
          if (newScore > 800) setRating('SSS');
          else if (newScore > 600) setRating('SS');
          else if (newScore > 400) setRating('S');
          else if (newScore > 250) setRating('A');
          else if (newScore > 100) setRating('B');
          else setRating('C');
          
          return newScore;
        });
      }, 500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSinging]);

  const triggerReaction = (emoji: string) => {
    const id = reactionIdRef.current++;
    const x = Math.random() * 120 - 60; // horizontal offset range
    setReactions((prev) => [...prev, { id, emoji, x }]);
    
    // Auto clear reactions after animation completes
    setTimeout(() => {
      setReactions((prev) => prev.filter(r => r.id !== id));
    }, 4000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChats((prev) => [...prev, { sender: "You", text: chatInput.trim() }]);
    setChatInput('');
    // Trigger a simulated player reaction to user chat
    setTimeout(() => {
      const responseChats = ["Nice choice!", "Haha cool!", "🎤🙌"];
      const randomResponse = responseChats[Math.floor(Math.random() * responseChats.length)];
      const randomPlayer = room.players[Math.floor(Math.random() * room.players.length)];
      setChats((prev) => [...prev, { sender: randomPlayer.name, text: randomResponse }]);
    }, 1500);
  };

  return (
    <div id="active-song-room" className="absolute inset-0 bg-[#050512] z-50 flex flex-col justify-between overflow-hidden">
      {/* Concert Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Stage spotlight beam effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[600px] bg-gradient-to-b from-purple-500/5 via-indigo-500/2 to-transparent pointer-events-none clip-path-spotlight" />

      {/* Room Header */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Mic className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-white font-display font-bold text-sm tracking-wide truncate max-w-[150px]">{song.title}</h3>
            <span className="text-gray-400 text-xs truncate max-w-[150px]">{song.artist}</span>
          </div>
        </div>

        {/* Live Audience list */}
        <div className="flex items-center gap-1.5 bg-[#12122d]/60 border border-white/5 py-1 px-2.5 rounded-full">
          <div className="flex -space-x-1.5">
            {room.players.map((p, i) => (
              <img 
                key={i} 
                src={p.avatarUrl} 
                alt={p.name} 
                className="w-5 h-5 rounded-full object-cover border border-[#050512]"
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="w-5 h-5 rounded-full bg-purple-500 border border-[#050512] flex items-center justify-center text-[8px] font-bold text-white">
              +4
            </div>
          </div>
          <span className="text-[10px] text-green-400 font-mono font-bold ml-1 animate-pulse">• LIVE</span>
        </div>

        {/* Close Button */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Main Singing/Karaoke Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 overflow-hidden py-2">
        {/* Pitch Feedback / Singing Score */}
        <AnimatePresence>
          {isSinging && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute top-4 flex flex-col items-center gap-1 bg-black/40 backdrop-blur-md px-6 py-2 rounded-2xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Karaoke Score</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold font-mono text-white tracking-tight">{score}</span>
                <span className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] animate-bounce">
                  {rating}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Microphone Graphic */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Animated pulsing wave rings around mic */}
          <motion.div 
            animate={{ 
              scale: isSinging ? [1, 1.25, 1] : [1, 1.1, 1],
              opacity: isSinging ? [0.15, 0.4, 0.15] : [0.1, 0.2, 0.1]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute w-44 h-44 rounded-full bg-purple-500/30 blur-md"
          />
          <motion.div 
            animate={{ 
              scale: isSinging ? [1, 1.45, 1] : [1, 1.2, 1],
              opacity: isSinging ? [0.05, 0.2, 0.05] : [0.02, 0.1, 0.02]
            }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            className="absolute w-44 h-44 rounded-full bg-pink-500/20 blur-md"
          />

          <motion.div 
            animate={isSinging ? { y: [0, -4, 0] } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className={`w-28 h-28 rounded-full flex items-center justify-center border-2 shadow-2xl relative z-10 ${
              isSinging 
                ? 'bg-gradient-to-tr from-purple-600 to-pink-500 border-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.6)]' 
                : 'bg-[#12122a] border-purple-500/30'
            }`}
          >
            {isSinging ? (
              <Mic className="w-12 h-12 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
            ) : (
              <Mic className="w-10 h-10 text-purple-400" />
            )}

            {/* Glowing sparkle badge on mic */}
            {isSinging && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#0c0c22] p-1 rounded-full text-[10px] animate-spin font-bold">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            )}
          </motion.div>
        </div>

        {/* Realtime pitch accuracy wave visualization */}
        <div className="w-full max-w-xs h-10 flex items-center justify-between gap-[2px] px-8 py-2 relative overflow-hidden">
          {Array.from({ length: 24 }).map((_, idx) => {
            // Highlight active bars
            const active = isSinging;
            const heightClass = active 
              ? `h-${[4, 8, 5, 10, 6, 2, 7, 9, 3, 5, 8, 4][idx % 12]}` 
              : 'h-2';
            return (
              <motion.div
                key={idx}
                animate={active ? { 
                  scaleY: [1, Math.random() * 2.5 + 1, 1],
                  backgroundColor: ['#a855f7', '#ec4899', '#6366f1', '#a855f7'][idx % 4]
                } : { scaleY: 1, backgroundColor: '#374151' }}
                transition={{ repeat: Infinity, duration: 0.6 + (idx % 5) * 0.1, ease: 'easeInOut' }}
                className="w-1.5 bg-gray-700 rounded-full origin-center"
                style={{ height: '8px' }}
              />
            );
          })}
        </div>

        {/* Scrolling Lyrics Display */}
        <div className="w-full max-w-sm h-36 flex flex-col items-center justify-center relative overflow-hidden mt-2 border-t border-b border-white/5 bg-[#08081a]/20 py-2">
          {/* Faders for top and bottom lyrics */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#050512] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#050512] to-transparent z-10 pointer-events-none" />

          {/* Sliding lyrics container */}
          <div 
            className="flex flex-col items-center gap-4 transition-transform duration-500 ease-out"
            style={{ transform: `translateY(${(1 - currentLyricIndex) * 36 - 12}px)` }}
          >
            {song.lyrics.map((lyric, idx) => {
              const isActive = idx === currentLyricIndex;
              const isPast = idx < currentLyricIndex;
              
              return (
                <p 
                  key={idx}
                  className={`text-center transition-all duration-300 font-display font-semibold select-none px-4 ${
                    isActive 
                      ? 'text-lg text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 scale-105 drop-shadow-[0_1px_8px_rgba(244,63,94,0.3)]' 
                      : isPast 
                        ? 'text-gray-600 text-sm line-through' 
                        : 'text-gray-400 text-sm'
                  }`}
                >
                  {lyric}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Reactions Spawner Panel (Renders on top of everything) */}
      <div className="absolute bottom-40 right-12 w-28 h-64 pointer-events-none z-30 select-none overflow-hidden">
        <AnimatePresence>
          {reactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              initial={{ y: 220, x: reaction.x, scale: 0.5, opacity: 0 }}
              animate={{ 
                y: 0, 
                x: reaction.x + Math.sin(reaction.id) * 20, 
                scale: [0.8, 1.3, 1], 
                opacity: [0, 1, 1, 0] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.5, ease: 'easeOut' }}
              className="absolute bottom-0 left-1/2 text-2xl"
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Control & Interaction Panels */}
      <div className="relative z-10 bg-gradient-to-t from-black/90 to-[#0c0c22]/90 border-t border-white/5 p-4 flex flex-col gap-3">
        {/* Chats and floating triggers layout */}
        <div className="flex gap-4 items-end h-28 overflow-hidden">
          {/* Chat scrolling log */}
          <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-1.5 h-full justify-end text-xs">
            {chats.map((c, i) => (
              <div key={i} className="bg-white/5 rounded-xl py-1 px-2.5 max-w-[90%] self-start border border-white/5 backdrop-blur-sm">
                <span className="font-bold text-purple-300 mr-1">{c.sender}:</span>
                <span className="text-gray-200">{c.text}</span>
              </div>
            ))}
          </div>

          {/* Quick interactive reaction buttons */}
          <div className="flex flex-col gap-2">
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={() => triggerReaction('💖')}
              className="w-9 h-9 rounded-full bg-[#12122d] hover:bg-pink-500/20 border border-pink-500/20 flex items-center justify-center text-pink-400 text-sm shadow-[0_0_8px_rgba(236,72,153,0.15)]"
            >
              <Heart className="w-4 h-4 fill-pink-400" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={() => triggerReaction('🔥')}
              className="w-9 h-9 rounded-full bg-[#12122d] hover:bg-orange-500/20 border border-orange-500/20 flex items-center justify-center text-orange-400 text-sm shadow-[0_0_8px_rgba(249,115,22,0.15)]"
            >
              <Flame className="w-4 h-4 fill-orange-400" />
            </motion.button>
          </div>
        </div>

        {/* Input & Action buttons row */}
        <div className="flex items-center gap-2">
          {/* Chat Form */}
          <form onSubmit={handleSendChat} className="flex-1 flex items-center bg-[#121230] border border-white/5 rounded-full px-3 py-1.5">
            <input 
              type="text" 
              placeholder="Send message..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white outline-none placeholder-gray-500"
            />
            <button type="submit" className="text-purple-400 hover:text-purple-300 ml-1.5 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Grab Mic or Sing control */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isSinging) {
                // Stop singing
                setIsSinging(false);
              } else {
                // Start singing
                setIsSinging(true);
                setScore(0);
                setRating('C');
                triggerReaction('🎤');
              }
            }}
            className={`px-5 py-2.5 rounded-full font-display font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 relative overflow-hidden ${
              isSinging 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
            }`}
          >
            {/* Glossy sheen reflection on button */}
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full animate-shine pointer-events-none" style={{ width: '50%' }} />
            
            {isSinging ? (
              <>
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Stop Solo</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Grab Mic</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
