import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Satellite, Sparkles, X, Zap } from 'lucide-react';
import { Room, Song, UserProfile, Player } from '../types';
import SongRoom from './SongRoom';

interface QuickStartModalProps {
  room: Room;
  user: UserProfile;
  onClose: () => void;
}

export default function QuickStartModal({ room, user, onClose }: QuickStartModalProps) {
  const [matchState, setMatchState] = useState<'matching' | 'active'>('matching');
  const [matchedPlayers, setMatchedPlayers] = useState<Array<Player | null>>([
    { name: user.name, avatarUrl: user.avatarUrl }, // Spot 1 is always the user
    null, // Spot 2
    null, // Spot 3
    null  // Spot 4
  ]);
  const [selectedSong, setSelectedSong] = useState<Song>(room.songs[0]);
  const stars = Array.from({ length: 42 }, (_, idx) => ({
    id: idx,
    left: `${(idx * 37) % 100}%`,
    top: `${(idx * 61) % 100}%`,
    size: idx % 5 === 0 ? 'h-1.5 w-1.5' : idx % 3 === 0 ? 'h-1 w-1' : 'h-0.5 w-0.5',
    delay: (idx % 9) * 0.22
  }));
  const orbitSlots = [
    'left-[50%] top-[28%] -translate-x-1/2',
    'left-[79%] top-[50%] -translate-x-1/2 -translate-y-1/2',
    'left-[50%] top-[72%] -translate-x-1/2 -translate-y-full',
    'left-[21%] top-[50%] -translate-x-1/2 -translate-y-1/2'
  ];

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
      // Enter the room immediately after a full match.
      setMatchState('active');
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [room]);

  return (
    <div id="matchmaker-overlay" className="absolute inset-0 z-50 overflow-hidden bg-[#02020c] text-white select-none">
      <AnimatePresence mode="wait">
        {matchState !== 'active' ? (
          <motion.div
            key="matchmaker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            className="absolute inset-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(139,92,246,0.36),transparent_22%),radial-gradient(circle_at_18%_24%,rgba(236,72,153,0.24),transparent_30%),radial-gradient(circle_at_82%_68%,rgba(34,211,238,0.22),transparent_26%),linear-gradient(180deg,#03020b_0%,#11062f_48%,#02020c_100%)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
              className="absolute left-1/2 top-[48%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/10 bg-[conic-gradient(from_0deg,transparent,rgba(168,85,247,0.18),transparent,rgba(34,211,238,0.12),transparent)] blur-[1px]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 38, ease: 'linear' }}
              className="absolute left-1/2 top-[48%] h-[25rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10"
            />
            {stars.map((star) => (
              <motion.span
                key={star.id}
                className={`absolute rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)] ${star.size}`}
                style={{ left: star.left, top: star.top }}
                animate={{ opacity: [0.18, 1, 0.2], scale: [0.7, 1.35, 0.8] }}
                transition={{ repeat: Infinity, duration: 2.2 + (star.id % 4) * 0.35, delay: star.delay }}
              />
            ))}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 pt-9">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-wide text-purple-100 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 fill-fuchsia-300 text-fuchsia-300" />
                <span>{room.title} Match</span>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-md transition-colors hover:bg-white/16 hover:text-white"
                aria-label="Close match"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="absolute inset-x-0 top-[16%] z-10 text-center">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                className="mx-auto flex w-fit items-center gap-2 rounded-full border border-cyan-300/15 bg-black/18 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-cyan-100/80 backdrop-blur-md"
              >
                <Satellite className="h-3.5 w-3.5 text-cyan-200" />
                Signal scanning
              </motion.div>
            </div>

            <div className="absolute left-1/2 top-[47%] z-10 h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-purple-300/18"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
                className="absolute inset-8 rounded-full border border-cyan-300/14"
              />
              <motion.div
                animate={{ scale: [0.82, 1.12, 0.82], opacity: [0.45, 0.85, 0.45] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/16 blur-2xl"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(236,72,153,0.72),rgba(34,211,238,0.36),transparent)] p-px"
              >
                <div className="h-full w-full rounded-full bg-[#060317]/80" />
              </motion.div>

              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/10 bg-white/8 backdrop-blur-md">
                <Sparkles className="h-6 w-6 text-fuchsia-200" />
                <span className="mt-2 text-[0.6rem] font-black uppercase tracking-[0.18em] text-white/75">Searching</span>
              </div>

              {matchedPlayers.map((player, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.45, opacity: 0 }}
                  animate={{ scale: player ? 1 : 0.82, opacity: player ? 1 : 0.55, y: [0, -6, 0] }}
                  transition={{ scale: { duration: 0.32 }, opacity: { duration: 0.32 }, y: { repeat: Infinity, duration: 3 + idx * 0.25, ease: 'easeInOut' } }}
                  className={`absolute ${orbitSlots[idx]} flex flex-col items-center gap-2`}
                >
                  <div className={`relative flex h-16 w-16 items-center justify-center rounded-full border backdrop-blur-md ${
                    player
                      ? idx === 0
                        ? 'border-fuchsia-300 bg-fuchsia-400/14 shadow-[0_0_24px_rgba(236,72,153,0.72)]'
                        : 'border-cyan-300 bg-cyan-400/12 shadow-[0_0_22px_rgba(34,211,238,0.56)]'
                      : 'border-dashed border-white/20 bg-white/5'
                  }`}>
                    {player ? (
                      <>
                        <img
                          src={player.avatarUrl}
                          alt={player.name}
                          className="h-14 w-14 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -right-0.5 bottom-1 h-3 w-3 rounded-full border-2 border-[#07031a] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                      </>
                    ) : (
                      <HelpCircle className="h-5 w-5 text-white/28" />
                    )}
                  </div>
                  <span className="max-w-[4.5rem] truncate text-[0.68rem] font-bold text-white/75">
                    {player ? (idx === 0 ? 'You' : player.name) : 'Waiting'}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-[13%] z-10 px-8 text-center">
              <motion.h2
                animate={{ opacity: [0.78, 1, 0.78] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                className="font-display text-xl font-extrabold text-white"
              >
                Finding Vocal Opponents...
              </motion.h2>
              <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-relaxed text-cyan-100/64">
                Searching the galaxy for live voices with matching pitch energy.
              </p>
              <div className="mx-auto mt-6 flex w-44 items-center gap-2">
                {[0, 1, 2, 3, 4].map((bar) => (
                  <motion.span
                    key={bar}
                    animate={{ scaleY: [0.45, 1.25, 0.6], opacity: [0.35, 1, 0.45] }}
                    transition={{ repeat: Infinity, duration: 0.9, delay: bar * 0.12 }}
                    className="h-8 flex-1 origin-center rounded-full bg-gradient-to-t from-fuchsia-500 to-cyan-300"
                  />
                ))}
              </div>
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
