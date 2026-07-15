import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coins, Gem, ShoppingBag } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onClose: () => void;
}

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

export default function ProfileModal({ setUser, onClose }: ProfileModalProps) {
  const [rechargeSuccess, setRechargeSuccess] = useState<string | null>(null);

  const showSuccessNotification = (message: string) => {
    setRechargeSuccess(message);
    setTimeout(() => {
      setRechargeSuccess(null);
    }, 2500);
  };

  const handleBuyCoins = (amount: number, bonusText: string) => {
    const cleanBonus = parseInt(bonusText.replace(/,/g, ''), 10);
    const totalAdded = amount + (isNaN(cleanBonus) ? 0 : cleanBonus);

    setUser(prev => ({
      ...prev,
      coins: prev.coins + totalAdded
    }));

    showSuccessNotification(`Successfully recharged ${totalAdded.toLocaleString()} Gold Coins! 🪙`);
  };

  const handleBuyDiamonds = (amount: number, bonusText: string) => {
    const cleanBonus = parseInt(bonusText.replace(/,/g, ''), 10);
    const totalAdded = amount + (isNaN(cleanBonus) ? 0 : cleanBonus);

    setUser(prev => ({
      ...prev,
      diamonds: prev.diamonds + totalAdded
    }));

    showSuccessNotification(`Successfully recharged ${totalAdded.toLocaleString()} Diamonds! 💎`);
  };

  return (
    <div id="profile-shop-overlay" className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
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
        <div className="flex items-center bg-[#121230] border-b border-white/5 relative z-10">
          <div className="flex-1 px-5 py-4 text-sm font-display font-extrabold text-purple-300">
            Recharge Shop
          </div>
          <button
            onClick={onClose}
            className="px-4 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Close recharge shop"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none p-5 relative">
          <motion.div
            key="shop-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-indigo-900/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-xs font-extrabold uppercase tracking-wider">Weekly Special Deals</h4>
                <p className="text-purple-300 text-[10px] mt-0.5">Receive up to +15% more coins this week!</p>
              </div>
            </div>

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

            <span className="text-[8px] text-gray-600 text-center mt-3 font-semibold">
              *This is a frontend mock prototype. Simulated purchases do not charge real money.
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
