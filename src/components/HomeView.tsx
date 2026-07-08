import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, MessageSquare, User, Zap } from 'lucide-react';
import { Room, UserProfile } from '../types';
import { sampleRooms, initialUserProfile } from '../data';
import Header from './Header';
import Carousel from './Carousel';
import QuickStartModal from './QuickStartModal';
import ProfileModal from './ProfileModal';
import MessagesTab from './MessagesTab';
import MeTab from './MeTab';

type TabType = 'home' | 'messages' | 'me';

export const HomeView = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [rooms] = useState<Room[]>(sampleRooms);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(1);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [shopInitialTab, setShopInitialTab] = useState<'profile' | 'shop'>('profile');
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);

  const handleOpenProfile = () => {
    setShopInitialTab('profile');
    setProfileModalOpen(true);
  };

  const handleOpenShop = () => {
    setShopInitialTab('shop');
    setProfileModalOpen(true);
  };

  const activeRoom = rooms[activeCarouselIndex];

  return (
    <div
      id="post-login-home-view"
      className="relative flex h-full w-full flex-col overflow-hidden bg-[#050514] text-white font-sans antialiased select-none"
    >
      {activeTab === 'home' && (
        <Header
          user={userProfile}
          onOpenProfile={handleOpenProfile}
          onOpenShop={handleOpenShop}
        />
      )}

      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-1 flex-col justify-between"
            >
              <Carousel
                rooms={rooms}
                activeIndex={activeCarouselIndex}
                setActiveIndex={setActiveCarouselIndex}
              />

              <div id="quickstart-action-panel" className="relative z-10 flex flex-col items-center px-5 pb-5 select-none">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMatchmakingOpen(true)}
                  className="relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-[1.35rem] border border-white/20 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-base font-black uppercase tracking-widest text-white shadow-[0_4px_25px_rgba(168,85,247,0.45)] font-display"
                >
                  <span className="absolute inset-0 w-1/2 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shine pointer-events-none" />
                  <Zap className="h-5 w-5 fill-yellow-300 text-yellow-300 animate-pulse" />
                  <span>Quick Start</span>
                </motion.button>

                <span className="mt-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-gray-500">
                  <span className="text-purple-500 animate-pulse">-| -</span>
                  <span>Match online players, sing & compete</span>
                  <span className="text-purple-500 animate-pulse">-| -</span>
                </span>
              </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              key="messages-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <MessagesTab />
            </motion.div>
          )}

          {activeTab === 'me' && (
            <motion.div
              key="me-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <MeTab user={userProfile} onOpenShop={handleOpenShop} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav
        id="starmaker-tab-bar"
        className="relative z-40 flex items-center justify-between border-t border-white/5 bg-[#0b0b20]/90 px-6 pt-2 pb-8 backdrop-blur-md select-none"
      >
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="relative flex flex-1 flex-col items-center gap-1"
        >
          <Home className={`h-5 w-5 transition-colors duration-200 ${activeTab === 'home' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-400'}`} />
          <span className={`text-[10px] font-bold transition-colors duration-200 ${activeTab === 'home' ? 'text-purple-400' : 'text-gray-500'}`}>
            Home
          </span>
          {activeTab === 'home' && (
            <motion.span layoutId="active-tab-indicator" className="absolute -bottom-1.5 h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className="relative flex flex-1 flex-col items-center gap-1"
        >
          <div className="relative">
            <MessageSquare className={`h-5 w-5 transition-colors duration-200 ${activeTab === 'messages' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-400'}`} />
            <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-red-500 animate-bounce" />
          </div>
          <span className={`text-[10px] font-bold transition-colors duration-200 ${activeTab === 'messages' ? 'text-purple-400' : 'text-gray-500'}`}>
            Messages
          </span>
          {activeTab === 'messages' && (
            <motion.span layoutId="active-tab-indicator" className="absolute -bottom-1.5 h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('me')}
          className="relative flex flex-1 flex-col items-center gap-1"
        >
          <User className={`h-5 w-5 transition-colors duration-200 ${activeTab === 'me' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-400'}`} />
          <span className={`text-[10px] font-bold transition-colors duration-200 ${activeTab === 'me' ? 'text-purple-400' : 'text-gray-500'}`}>
            Me
          </span>
          {activeTab === 'me' && (
            <motion.span layoutId="active-tab-indicator" className="absolute -bottom-1.5 h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          )}
        </button>
      </nav>

      <AnimatePresence>
        {matchmakingOpen && (
          <QuickStartModal
            room={activeRoom}
            user={userProfile}
            onClose={() => setMatchmakingOpen(false)}
          />
        )}

        {profileModalOpen && (
          <ProfileModal
            user={userProfile}
            setUser={setUserProfile}
            initialTab={shopInitialTab}
            onClose={() => setProfileModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
