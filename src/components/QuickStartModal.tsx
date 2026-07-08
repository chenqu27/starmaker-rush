import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Loader2, HelpCircle, X, Check } from 'lucide-react';
import { Room, Song, UserProfile, Player } from '../types';
import SongRoom from './SongRoom';

interface QuickStartModalProps {
  room: Room;
  user: UserProfile;
  onClose: () => void;
}

export default function QuickStartModal({ room, user, onClose }: QuickStartModalProps) {
  const [matchState, setMatchState] = useState<'matching' | 'matched' | 'starting' | 'active'>('matching');
  const [matchedPlayers, setMatchedPlayers] = useState<Array<Player | null>>([
    { name: user.name, avatarUrl: user.avatarUrl }, // Spot 1 is always the user
    null, // Spot 2
    null, // Spot 3
    null  // Spot 4
  ]);
  const [countdown, setCountdown] = useState(3);
  const [selectedSong, setSelectedSong] = useState<Song>(room.songs[0]);

  useEffect(() => {
    // Select a random song from the room
    const randomSong = room.songs[Math.floor(Math.random() * room.songs.length)];
    setSelectedSong(randomSong);

    // Simulate matchmaking connections
    const timer1 = setTimeout(() => {
      // Player 2 connects
      setMatchedPlayers(prev => [prev[0], room.players[0], null, null]);
    }, 800);

    const timer2 = setTimeout(() => {
      // Player 3 connects
      setMatchedPlayers(prev => [prev[0], prev[1], room.players[1], null]);
    }, 1600);

    const timer3 = setTimeout(() => {
      // Player 4 connects
      setMatchedPlayers(prev => [prev[0], prev[1], prev[2], room.players[2]]);
    }, 2400);

    const timer4 = setTimeout(() => {
      // Matched successfully!
      setMatchState('matched');
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [room]);

  // Handle countdown when matched
  useEffect(() => {
    if (matchState !== 'matched' && matchState !== 'starting') return;

    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setMatchState('active');
    }
  }, [matchState, countdown]);

  return (
    <div id="matchmaker-overlay" className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <AnimatePresence mode="wait">
        {matchState !== 'active' ? (
          <motion.div
            key="matchmaker"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-[#0c0c22] border border-purple-500/30 p-6 rounded-3xl flex flex-col items-center justify-between shadow-[0_0_35px_rgba(168,85,247,0.3)] relative overflow-hidden h-[30rem]"
          >
            {/* Glowing background meshes */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

            {/* Header / Close */}
            <div className="w-full flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1 bg-[#1a1a3a] border border-purple-500/20 py-1 px-3 rounded-full text-xs text-purple-300 font-bold">
                <Zap className="w-3.5 h-3.5 fill-purple-300" />
                <span>{room.title} MATCH</span>
              </div>
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Radar / Central Matching Indicator */}
            <div className="my-2 relative flex items-center justify-center w-40 h-40">
              {/* Radar sweep lines */}
              <AnimatePresence>
                {matchState === 'matching' && (
                  <>
                    <motion.div 
                      animate={{ scale: [0.8, 1.8, 2.2], opacity: [0.6, 0.2, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut' }}
                      className="absolute w-20 h-20 border border-purple-500 rounded-full"
                    />
                    <motion.div 
                      animate={{ scale: [0.8, 1.8, 2.2], opacity: [0.6, 0.2, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeOut', delay: 1.25 }}
                      className="absolute w-20 h-20 border border-pink-500 rounded-full"
                    />
                    {/* Rotating scanning ray */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-purple-500/10 to-purple-500/30 rounded-full pointer-events-none origin-center"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Central text indicator */}
              <div className="relative z-10 flex flex-col items-center">
                {matchState === 'matching' ? (
                  <>
                    <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mt-2">Searching</span>
                  </>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.5 }} 
                    animate={{ scale: [1, 1.15, 1] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 drop-shadow-[0_2px_8px_rgba(236,72,153,0.4)]">
                      {countdown}
                    </span>
                    <span className="text-[10px] uppercase font-extrabold text-pink-400 tracking-widest mt-1">Starting</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Match Circle Grid (4 players) */}
            <div className="grid grid-cols-4 gap-4 w-full relative z-10 px-2 mt-2">
              {matchedPlayers.map((player, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    {/* Inner Spot Container */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 overflow-hidden relative ${
                      player 
                        ? idx === 0 
                          ? 'border-purple-500 bg-purple-950/20 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                          : 'border-pink-500 bg-pink-950/20'
                        : 'border-dashed border-gray-700 bg-gray-900/40 animate-pulse'
                    }`}>
                      {player ? (
                        <img 
                          src={player.avatarUrl} 
                          alt={player.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <HelpCircle className="w-5 h-5 text-gray-700" />
                      )}

                      {/* Success Check Badge */}
                      {player && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5 border border-[#0c0c22] z-20"
                        >
                          <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                        </motion.span>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 font-bold truncate max-w-[55px]">
                    {player ? (idx === 0 ? "You" : player.name) : "Waiting"}
                  </span>
                </div>
              ))}
            </div>

            {/* Matching Status Title */}
            <div className="flex flex-col items-center text-center mt-3 relative z-10">
              <h2 className="text-white font-display font-bold text-base">
                {matchState === 'matching' ? "Finding Vocal Opponents..." : "Match Formed!"}
              </h2>
              <p className="text-gray-400 text-xs mt-1 px-4">
                {matchState === 'matching' 
                  ? "Aligning microphone pitch levels with active players..." 
                  : `Joining Karaoke Lobby using "${selectedSong.title}"`}
              </p>
            </div>
          </motion.div>
        ) : (
          <SongRoom 
            key="songroom"
            room={room}
            song={selectedSong}
            currentUserAvatar={user.avatarUrl}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
