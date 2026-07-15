import { motion } from 'motion/react';
import { Gem, Plus } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenShop: (type: 'diamonds') => void;
}

export default function Header({ user, onOpenProfile, onOpenShop }: HeaderProps) {
  return (
    <motion.header 
      id="starmaker-header"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      className="flex items-center justify-between px-4 pt-11 pb-3 bg-gradient-to-b from-[#08081a] to-transparent relative z-40 select-none"
    >
      {/* Profile Section */}
      <div className="flex min-w-0 items-center gap-2">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          onClick={onOpenProfile}
          className="relative cursor-pointer"
        >
          {/* Glowing Avatar border */}
          <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-full h-full rounded-full object-cover border-2 border-[#050515]"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Active status bubble */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#050515] rounded-full"></span>
        </motion.div>

        <div className="flex min-w-0 flex-col">
          <span onClick={onOpenProfile} className="truncate text-white font-display font-semibold text-sm cursor-pointer hover:text-purple-300 transition-colors">
            {user.name}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-1.5 py-0.2 rounded-full font-bold font-mono tracking-wider">
              Lv.{user.level}
            </span>
            {/* Custom progress bar */}
            <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" 
                style={{ width: `${user.levelProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Section */}
      <div className="flex shrink-0 items-center gap-1.5">
        {/* Diamonds container */}
        <motion.div 
          whileTap={{ scale: 0.96 }}
          onClick={() => onOpenShop('diamonds')}
          className="flex items-center gap-1 bg-[#12122d]/80 border border-purple-500/30 rounded-full pl-1.5 pr-1 py-1 cursor-pointer hover:border-purple-500/60 transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-b from-purple-400 to-indigo-600 flex items-center justify-center shadow-[0_0_5px_rgba(168,85,247,0.4)]">
            <Gem className="w-3 h-3 text-purple-100" />
          </div>
          <span className="text-purple-300 font-bold font-mono text-xs pr-1">
            {user.diamonds.toLocaleString()}
          </span>
          <div className="w-4 h-4 rounded-full bg-[#1e1e4a] flex items-center justify-center hover:bg-purple-500/20 transition-colors">
            <Plus className="w-2.5 h-2.5 text-purple-300" />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
