import { useState, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Music, Heart, Play, Pause, X, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { UserProfile, Recording } from '../types';
import { sampleRecordings } from '../data';

interface MeTabProps {
  user: UserProfile;
  onOpenShop: (type: 'coins' | 'diamonds') => void;
}

export default function MeTab({ user, onOpenShop: _onOpenShop }: MeTabProps) {
  const [recordings, setRecordings] = useState<Recording[]>(sampleRecordings);
  const [activePlayback, setActivePlayback] = useState<Recording | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Playback timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && activePlayback) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2.5; // increment progress
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activePlayback]);

  const handlePlayRecording = (rec: Recording) => {
    setActivePlayback(rec);
    setPlaybackProgress(0);
    setIsPlaying(true);
  };

  const handleLikeRecording = (id: string, event: MouseEvent) => {
    event.stopPropagation();
    setRecordings(prev => prev.map(rec => {
      if (rec.id === id) {
        return { ...rec, likes: rec.likes + 1 };
      }
      return rec;
    }));
  };

  const badges = [
    { name: "Golden Vocals", icon: Trophy, desc: "Achieved SSS on any Pop classic", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
    { name: "First Mic Grab", icon: Award, desc: "Successfully grabbed mic on TikTok Hits", color: "text-rose-400 border-rose-500/20 bg-rose-500/5" },
    { name: "Lv.25 Veteran", icon: ShieldCheck, desc: "Hit Level 25 milestone", color: "text-blue-400 border-blue-500/20 bg-blue-500/5" }
  ];

  return (
    <div id="me-tab-container" className="relative flex h-full flex-1 flex-col overflow-y-auto bg-[#050514] p-4 pb-24 text-white scrollbar-none select-none">
      
      {/* Top Profile Summary */}
      <div className="flex flex-col items-center text-center py-5 bg-gradient-to-b from-[#12122d]/40 to-transparent border border-white/5 rounded-3xl p-5 shadow">
        <div className="relative">
          <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full border border-black" referrerPolicy="no-referrer" />
          </div>
          {user.vip && (
            <span className="absolute -bottom-1.5 -right-1.5 bg-yellow-500 text-white p-1 rounded-full border border-[#050514] shadow">
              <Trophy className="w-3.5 h-3.5 fill-white" />
            </span>
          )}
        </div>

        <h2 className="text-white font-display font-extrabold text-lg mt-3 flex items-center justify-center gap-1.5">
          {user.name}
          <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-extrabold px-1.5 py-0.2 rounded font-sans">PRO</span>
        </h2>

        <p className="text-gray-400 text-xs font-mono font-bold mt-1 tracking-wider">Lv.{user.level} Vocal Master</p>

        {/* Stats Grid */}
        <div className="flex items-center gap-8 mt-5 border-t border-white/5 pt-4 w-full justify-around">
          <div className="flex flex-col items-center">
            <span className="text-base font-mono font-extrabold text-white">3,425</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Followers</span>
          </div>
          <div className="w-[1px] h-6 bg-white/5" />
          <div className="flex flex-col items-center">
            <span className="text-base font-mono font-extrabold text-white">120</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Following</span>
          </div>
          <div className="w-[1px] h-6 bg-white/5" />
          <div className="flex flex-col items-center">
            <span className="text-base font-mono font-extrabold text-white">{recordings.length}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Records</span>
          </div>
        </div>
      </div>

      {/* Unlocked Badges (Bento Style) */}
      <div className="flex flex-col gap-2.5 mt-6">
        <h3 className="text-gray-400 font-display font-bold text-xs uppercase tracking-wider pl-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span>Vocal Badges</span>
        </h3>
        
        <div className="flex flex-col gap-2">
          {badges.map((badge, idx) => {
            const IconComponent = badge.icon;
            return (
              <div 
                key={idx}
                className={`flex items-center justify-between p-3.5 rounded-2xl border ${badge.color}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center">
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-200">{badge.name}</span>
                    <span className="text-[10px] text-gray-500 font-semibold leading-normal">{badge.desc}</span>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">Unlocked</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past Recordings */}
      <div className="flex flex-col gap-2.5 mt-6">
        <h3 className="text-gray-400 font-display font-bold text-xs uppercase tracking-wider pl-1 flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-purple-400" />
          <span>My Covers ({recordings.length})</span>
        </h3>

        <div className="flex flex-col gap-2">
          {recordings.map((rec) => (
            <motion.div
              key={rec.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlayRecording(rec)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#12122d]/40 border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                {/* Score badge */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600/30 to-pink-500/20 border border-purple-500/20 flex items-center justify-center relative">
                  <span className="text-lg font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500 drop-shadow">
                    {rec.score}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-200">{rec.songTitle}</span>
                  <span className="text-[10px] text-gray-500 font-semibold leading-relaxed">{rec.artist} • <span className="font-mono">{rec.duration}</span></span>
                </div>
              </div>

              {/* Likes & Play Button */}
              <div className="flex items-center gap-3.5">
                <button 
                  onClick={(e) => handleLikeRecording(rec.id, e)}
                  className="flex items-center gap-1 bg-[#1a1a3a] border border-white/5 hover:border-pink-500/20 py-1 px-2 rounded-full text-[10px] text-gray-400 hover:text-pink-400 transition-colors"
                >
                  <Heart className="w-3 h-3 fill-current" />
                  <span className="font-mono font-bold">{rec.likes}</span>
                </button>
                <div className="w-7 h-7 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition-colors">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Playback Overlay Drawer */}
      <AnimatePresence>
        {activePlayback && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-16 left-4 right-4 z-40 bg-[#0c0c24] border border-purple-500/30 p-4 rounded-3xl shadow-[0_0_25px_rgba(168,85,247,0.3)] flex items-center justify-between gap-4"
          >
            {/* Spinning Record disc */}
            <div className="relative">
              <motion.div 
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-900 via-gray-700 to-gray-900 border-2 border-purple-500 flex items-center justify-center shadow-inner"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-purple-300 border border-purple-950" />
              </motion.div>
              <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black px-1 rounded-full text-[8px] font-black font-display shadow animate-pulse">
                {activePlayback.score}
              </span>
            </div>

            {/* Song title and sliding progress */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex justify-between text-xs font-semibold mb-0.5">
                <span className="text-white truncate max-w-[130px] font-sans">{activePlayback.songTitle}</span>
                <span className="text-[10px] text-purple-300 font-mono font-bold">{isPlaying ? 'Playing Cover' : 'Paused'}</span>
              </div>
              
              {/* Progress Bar slider */}
              <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden mt-1.5 relative">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${playbackProgress}%` }}
                />
              </div>
            </div>

            {/* Actions Play / Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setActivePlayback(null);
                  setIsPlaying(false);
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
