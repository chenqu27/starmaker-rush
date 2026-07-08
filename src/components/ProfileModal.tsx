import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Coins, Gem, Crown, ChevronRight, ShoppingBag } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  initialTab: 'profile' | 'shop';
  onClose: () => void;
}

export default function ProfileModal({ user, setUser, initialTab, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'shop'>(initialTab);
  const [rechargeSuccess, setRechargeSuccess] = useState<string | null>(null);

  // Recharge packs configurations
  const coinPacks = [
    { id: 'c1', amount: 1000, price: '$0.99', bonus: '100 Bonus' },
    { id: 'c2', amount: 5000, price: '$4.99', bonus: '600 Bonus' },
    { id: 'c3', amount: 12000, price: '$9.99', bonus: '1,500 Bonus' },
  ];

  const diamondPacks = [
    { id: 'd1', amount: 250, price: '$1.99', bonus: '25 Bonus' },
    { id: 'd2', amount: 1000, price: '$6.99', bonus: '150 Bonus' },
    { id: 'd3', amount: 3000, price: '$19.99', bonus: '500 Bonus' },
  ];

  const handleBuyCoins = (amount: number, bonusText: string) => {
    // Add real bonus calculation
    const cleanBonus = parseInt(bonusText.replace(/,/g, ''));
    const totalAdded = amount + (isNaN(cleanBonus) ? 0 : cleanBonus);
    
    setUser(prev => ({
      ...prev,
      coins: prev.coins + totalAdded
    }));
    
    showSuccessNotification(`Successfully recharged ${totalAdded.toLocaleString()} Gold Coins! 🪙`);
  };

  const handleBuyDiamonds = (amount: number, bonusText: string) => {
    const cleanBonus = parseInt(bonusText.replace(/,/g, ''));
    const totalAdded = amount + (isNaN(cleanBonus) ? 0 : cleanBonus);

    setUser(prev => ({
      ...prev,
      diamonds: prev.diamonds + totalAdded
    }));

    showSuccessNotification(`Successfully recharged ${totalAdded.toLocaleString()} Diamonds! 💎`);
  };

  const showSuccessNotification = (message: string) => {
    setRechargeSuccess(message);
    setTimeout(() => {
      setRechargeSuccess(null);
    }, 2500);
  };

  const handleToggleVip = () => {
    setUser(prev => {
      const isVipNow = !prev.vip;
      showSuccessNotification(isVipNow ? "VIP status activated! 👑 Welcome back, Star!" : "VIP status deactivated.");
      return {
        ...prev,
        vip: isVipNow
      };
    });
  };

  return (
    <div id="profile-shop-overlay" className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {rechargeSuccess && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-4 left-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-600 border border-green-400 p-3 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2.5"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">✓</div>
            <p className="text-white text-xs font-bold font-sans">{rechargeSuccess}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm bg-[#0c0c22] border border-purple-500/30 rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(168,85,247,0.25)] flex flex-col h-[32rem]"
      >
        {/* Tab Selection Headers */}
        <div className="flex bg-[#121230] border-b border-white/5 relative z-10">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 text-center text-sm font-display font-extrabold transition-all duration-300 ${
              activeTab === 'profile' ? 'text-purple-300 bg-purple-500/5 shadow-inner' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            User Profile
          </button>
          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-4 text-center text-sm font-display font-extrabold transition-all duration-300 ${
              activeTab === 'shop' ? 'text-purple-300 bg-purple-500/5 shadow-inner' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Recharge Shop
          </button>
          {/* Close button */}
          <button 
            onClick={onClose}
            className="px-4 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-5 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.div
                key="profile-content"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col gap-5"
              >
                {/* Profile Center Avatar Card */}
                <div className="flex flex-col items-center bg-[#11112e]/50 border border-white/5 rounded-2xl p-4 text-center">
                  <div className="relative">
                    <div className="w-18 h-18 rounded-full p-[3px] bg-gradient-to-tr from-purple-500 to-pink-500 shadow-lg">
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name} 
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {user.vip && (
                      <span className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border border-[#0c0c22] shadow">
                        <Crown className="w-3 h-3 text-white fill-white" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-display font-bold text-base mt-2">{user.name}</h3>
                  <p className="text-gray-400 text-xs font-semibold mt-0.5">Lv.{user.level} Vocal Master</p>
                  
                  {/* Progress bar info */}
                  <div className="w-full max-w-[200px] mt-3">
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono font-bold mb-1">
                      <span>EXP PROGRESS</span>
                      <span>{user.levelProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                        style={{ width: `${user.levelProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Level / Vocals Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#121230]/40 border border-white/5 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Level Rewards</span>
                    <span className="text-white font-display font-extrabold text-sm mt-1">Unlocked</span>
                    <span className="text-purple-400 text-[10px] font-semibold mt-1">Diamond Buffs x1.2</span>
                  </div>
                  <div className="bg-[#121230]/40 border border-white/5 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Profile Title</span>
                    <span className="text-yellow-400 font-display font-extrabold text-sm mt-1">Golden Vocalist</span>
                    <span className="text-gray-500 text-[10px] font-semibold mt-1">Rating: SSS Expert</span>
                  </div>
                </div>

                {/* Account Status Items */}
                <div className="flex flex-col gap-2.5">
                  <div className="bg-[#121230]/40 border border-white/5 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Crown className={`w-4.5 h-4.5 ${user.vip ? 'text-yellow-400 fill-yellow-400/20' : 'text-gray-500'}`} />
                      <div className="flex flex-col">
                        <span className="text-white text-xs font-bold">VIP Membership Status</span>
                        <span className="text-gray-500 text-[10px]">Access to unlimited TikTok rooms</span>
                      </div>
                    </div>
                    {/* VIP TOGGLE BUTTON */}
                    <button 
                      onClick={handleToggleVip}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                        user.vip 
                          ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400' 
                          : 'bg-white/5 border border-white/10 text-gray-300'
                      }`}
                    >
                      {user.vip ? 'Active' : 'Enable'}
                    </button>
                  </div>

                  <div className="bg-[#121230]/40 border border-white/5 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4.5 h-4.5 text-purple-400" />
                      <div className="flex flex-col">
                        <span className="text-white text-xs font-bold">Microphone Calibration</span>
                        <span className="text-gray-500 text-[10px]">Gain +10% Pitch precision</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="shop-content"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col gap-4"
              >
                {/* Shop Banner header */}
                <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-indigo-900/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-300">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-extrabold uppercase tracking-wider">Weekly Special Deals</h4>
                    <p className="text-purple-300 text-[10px] mt-0.5">Receive up to +15% more coins this week!</p>
                  </div>
                </div>

                {/* GOLD COINS RECHARGE SECTIONS */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-gray-400 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 pl-1 mb-1">
                    <Coins className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Gold Coin Packages</span>
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2.5">
                    {coinPacks.map((pack) => (
                      <motion.div 
                        key={pack.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleBuyCoins(pack.amount, pack.bonus)}
                        className="bg-[#121230]/50 border border-yellow-500/10 rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer hover:border-yellow-500/40 hover:bg-[#121235] transition-all"
                      >
                        <Coins className="w-6 h-6 text-yellow-500" />
                        <span className="text-white font-mono font-extrabold text-xs mt-1.5">
                          {pack.amount.toLocaleString()}
                        </span>
                        <span className="text-[8px] text-yellow-400 font-bold bg-yellow-500/10 px-1 py-0.2 rounded-full mt-1.5">
                          {pack.bonus}
                        </span>
                        <span className="text-gray-400 font-bold text-[10px] mt-3 font-mono">
                          {pack.price}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* DIAMOND RECHARGE SECTIONS */}
                <div className="flex flex-col gap-2 mt-2">
                  <h3 className="text-gray-400 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 pl-1 mb-1">
                    <Gem className="w-3.5 h-3.5 text-purple-400" />
                    <span>Diamond Packages</span>
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2.5">
                    {diamondPacks.map((pack) => (
                      <motion.div 
                        key={pack.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleBuyDiamonds(pack.amount, pack.bonus)}
                        className="bg-[#121230]/50 border border-purple-500/10 rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer hover:border-purple-500/40 hover:bg-[#121235] transition-all"
                      >
                        <Gem className="w-6 h-6 text-purple-400" />
                        <span className="text-white font-mono font-extrabold text-xs mt-1.5">
                          {pack.amount.toLocaleString()}
                        </span>
                        <span className="text-[8px] text-purple-400 font-bold bg-purple-500/10 px-1 py-0.2 rounded-full mt-1.5">
                          {pack.bonus}
                        </span>
                        <span className="text-gray-400 font-bold text-[10px] mt-3 font-mono">
                          {pack.price}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Disclaimers */}
                <span className="text-[8px] text-gray-600 text-center mt-3 font-semibold">
                  *This is a frontend mock prototype. Simulated purchases do not charge real money.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
