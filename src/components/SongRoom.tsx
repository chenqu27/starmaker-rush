import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Menu, MessageCircle, Mic2, SmilePlus, Users, Volume2 } from 'lucide-react';
import { Room, Song, Player } from '../types';

interface SongRoomProps {
  key?: string;
  room: Room;
  song: Song;
  onClose: () => void;
  currentUserAvatar: string;
}

interface SeatPlayer extends Player {
  seat: number;
}

const fallbackPlayers: Player[] = [
  { name: 'Luna', avatarUrl: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&q=80&w=200' },
  { name: 'Jay', avatarUrl: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200' },
  { name: 'Alex', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
  { name: 'Zoe', avatarUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=200' },
  { name: 'Mia', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200' },
  { name: 'Leo', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
];

const seatPositions = [
  'left-[4%] top-[42.5%]',
  'right-[4%] top-[42.5%]',
  'left-[4%] top-[53%]',
  'right-[4%] top-[53%]',
  'left-[4%] top-[63.5%]',
  'right-[4%] top-[63.5%]'
];

export default function SongRoom({ room, song, onClose, currentUserAvatar }: SongRoomProps) {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [buzzed, setBuzzed] = useState(false);

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

  const activeLine = song.lyrics[currentLyricIndex] ?? "I'm walking on sunshine";
  const nextLine = song.lyrics[(currentLyricIndex + 1) % song.lyrics.length] ?? "woah-oh, and don't it feel good";

  useEffect(() => {
    const lyricInterval = window.setInterval(() => {
      setCurrentLyricIndex((prev) => (prev + 1) % song.lyrics.length);
    }, 3200);

    return () => window.clearInterval(lyricInterval);
  }, [song.lyrics.length]);

  return (
    <div id="active-song-room" className="absolute inset-0 z-50 overflow-hidden bg-[#080024] text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_74%,rgba(72,233,255,0.34),transparent_16%),radial-gradient(circle_at_20%_58%,rgba(253,28,220,0.34),transparent_28%),radial-gradient(circle_at_80%_40%,rgba(23,100,255,0.34),transparent_30%),linear-gradient(180deg,#05001f_0%,#140044_52%,#05001d_100%)]" />
      <div className="absolute inset-0 opacity-55 bg-[linear-gradient(115deg,transparent_0%,rgba(255,40,230,0.28)_12%,transparent_28%),linear-gradient(245deg,transparent_0%,rgba(33,164,255,0.28)_13%,transparent_31%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,transparent,rgba(18,0,58,0.84)),repeating-linear-gradient(90deg,rgba(255,255,255,0.14)_0_1px,transparent_1px_42px),repeating-linear-gradient(0deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_34px)] [perspective:480px]" />
      <div className="absolute left-1/2 top-[62%] h-[22%] w-[74%] -translate-x-1/2 rounded-t-full border-t border-cyan-200/70 opacity-80" />

      <header className="absolute left-0 right-0 top-0 z-30 flex items-start justify-between px-4 pt-11">
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/95 transition-colors hover:bg-white/10"
          aria-label="Close room"
        >
          <Menu className="h-5 w-5 stroke-[3]" />
        </button>

        <div className="pt-1 text-center">
          <h1 className="font-display text-[0.92rem] font-extrabold leading-none tracking-normal">Room 5187024</h1>
          <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[0.74rem] font-semibold text-white/85">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            <span>6/6</span>
          </div>
        </div>

        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-white/95 transition-colors hover:bg-white/10" aria-label="Room users">
          <Users className="h-5 w-5 stroke-[2.8]" />
        </button>
      </header>

      <main className="relative z-20 h-full w-full">
        <section className="absolute left-1/2 top-[18%] w-[86%] -translate-x-1/2">
          <div className="relative h-[9.55rem] rounded-[1.8rem] border-[2px] border-fuchsia-300/95 bg-[#080033]/76 px-5 py-7 text-center shadow-[0_0_18px_rgba(246,75,255,0.9),inset_0_0_28px_rgba(28,12,98,0.92)] backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 h-7 w-16 -translate-x-1/2 rounded-[50%] border-t-[3px] border-fuchsia-300 shadow-[0_0_16px_rgba(246,75,255,0.9)]" />
            <div className="absolute -top-5 left-1/2 h-8 w-8 -translate-x-1/2 rotate-45 border-[3px] border-fuchsia-300 bg-[#32105e] shadow-[0_0_16px_rgba(246,75,255,0.9)]" />
            <div className="absolute -top-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />

            <p className="font-display text-[1.03rem] font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-300 to-cyan-300">
              {activeLine}
            </p>
            <p className="mt-4 font-display text-[0.92rem] font-extrabold leading-tight text-white">
              {nextLine}
            </p>
            <div className="mx-auto mt-4 flex w-24 items-center justify-center gap-2.5 text-fuchsia-200">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-fuchsia-300 to-white" />
              <span className="text-lg leading-none">✦</span>
              <span className="h-px flex-1 bg-gradient-to-r from-white via-cyan-300 to-transparent" />
            </div>
          </div>
        </section>

        <div className="absolute left-1/2 top-[42.5%] z-10 h-[45%] w-20 -translate-x-1/2">
          <div className="absolute left-1/2 top-0 h-20 w-14 -translate-x-1/2 rounded-[1.5rem] border-[3px] border-white/80 bg-[linear-gradient(90deg,#ff42de,#f9f7ff_48%,#24c8ff)] shadow-[0_0_20px_rgba(255,61,232,0.9)]">
            <div className="absolute inset-x-3 top-3 h-1.5 rounded-full bg-[#080024]" />
            <div className="absolute inset-x-3 top-6 h-1.5 rounded-full bg-[#080024]" />
            <div className="absolute inset-x-3 top-9 h-1.5 rounded-full bg-[#080024]" />
            <div className="absolute bottom-0 left-1/2 h-7 w-7 -translate-x-1/2 rounded-t-full bg-[#080024]" />
          </div>
          <div className="absolute left-1/2 top-[4.5rem] h-[79%] w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-200 via-fuchsia-400 to-[#17003e] shadow-[0_0_16px_rgba(78,226,255,0.8)]" />
          <div className="absolute bottom-0 left-1/2 h-6 w-20 -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-[#180031] via-fuchsia-500 to-[#0b0d4f] shadow-[0_0_24px_rgba(248,45,232,0.8)]" />
        </div>

        <div className="absolute inset-0 z-20">
          {players.map((player, index) => (
            <div key={`${player.name}-${index}`} className={`absolute ${seatPositions[index]} w-[3.15rem]`}>
              <div className="relative flex flex-col items-center">
                <span className={`absolute -left-0.5 -top-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-full text-[0.56rem] font-extrabold shadow-[0_0_12px_rgba(72,111,255,0.9)] ${index % 2 === 0 ? 'bg-gradient-to-br from-fuchsia-400 to-indigo-500' : 'bg-gradient-to-br from-cyan-400 to-indigo-500'}`}>
                  {player.seat}
                </span>
                <div className={`h-[2.85rem] w-[2.85rem] overflow-hidden rounded-full border-2 bg-[#10003b] shadow-[0_0_12px_rgba(130,74,255,0.78)] ${index % 2 === 0 ? 'border-fuchsia-400' : 'border-cyan-400'}`}>
                  <img src={player.avatarUrl} alt={player.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="-mt-0.5 w-full rounded-full bg-black/34 px-1 py-0.5 text-center shadow-[0_7px_12px_rgba(0,0,0,0.26)] backdrop-blur-sm">
                  <p className="truncate font-display text-[0.62rem] font-extrabold leading-none text-white">{player.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 left-3 z-30 flex gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Emoji">
            <SmilePlus className="h-5 w-5" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Chat">
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-3 right-3 z-30 flex gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Gift">
            <Gift className="h-5 w-5" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md" aria-label="Volume">
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setBuzzed(true)}
          className={`absolute bottom-[4.65rem] right-4 z-30 flex h-[5.65rem] w-[5.65rem] items-center justify-center rounded-full border-[4px] border-fuchsia-400 bg-gradient-to-br from-rose-400 via-orange-400 to-amber-300 text-[1.38rem] font-black tracking-normal text-white shadow-[0_0_0_7px_rgba(254,73,255,0.18),0_0_28px_rgba(255,76,220,0.95)] transition-transform ${buzzed ? 'scale-95' : ''}`}
          aria-label="Buzz"
        >
          <span className="drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)]">BUZZ</span>
          <Mic2 className="absolute bottom-5 h-4 w-4 text-white/26" />
        </motion.button>
      </main>
    </div>
  );
}
