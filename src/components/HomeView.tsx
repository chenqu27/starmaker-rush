import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, MessageSquare, RadioTower, User, Zap } from 'lucide-react';
import { Room, RushDemoCommand, RushRoomPhase, UserProfile } from '../types';
import { sampleRooms, initialUserProfile } from '../data';
import Header from './Header';
import Carousel from './Carousel';
import QuickStartModal from './QuickStartModal';
import ProfileModal from './ProfileModal';
import MessagesTab from './MessagesTab';
import MeTab from './MeTab';
import RoomsTab from './RoomsTab';
import MultiMicRoomVisual from './MultiMicRoomVisual';
import homeBackgroundImage from '../assets/images/home_background.png';

type TabType = 'home' | 'messages' | 'me' | 'rooms';
type ActiveRoomSession = {
  room: Room;
  sessionKey: string;
};

interface HomeViewProps {
  initialProfile?: UserProfile;
  rushDemoCommand?: RushDemoCommand | null;
  rushDemoPaused?: boolean;
  onRushPhaseChange?: (phase: RushRoomPhase | null) => void;
}

export const HomeView = ({ initialProfile = initialUserProfile, rushDemoCommand, rushDemoPaused = false, onRushPhaseChange }: HomeViewProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [rooms] = useState<Room[]>(sampleRooms);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(1);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [matchmakingOpen, setMatchmakingOpen] = useState(false);
  const [quickStartSessionKey, setQuickStartSessionKey] = useState(0);
  const [activeQuickStartCommand, setActiveQuickStartCommand] = useState<RushDemoCommand | null>(null);
  const [activeRoomSession, setActiveRoomSession] = useState<ActiveRoomSession | null>(null);
  const matchmakingOpenRef = useRef(matchmakingOpen);

  const handleOpenProfile = () => {
    setActiveTab('me');
  };

  const handleOpenShop = (_type?: 'coins' | 'diamonds') => {
    setProfileModalOpen(true);
  };

  const activeRoom = rooms[activeCarouselIndex];

  useEffect(() => {
    matchmakingOpenRef.current = matchmakingOpen;
  }, [matchmakingOpen]);

  useEffect(() => {
    if (!rushDemoCommand) return;

    setActiveRoomSession(null);
    setActiveQuickStartCommand(rushDemoCommand);
    if (!matchmakingOpenRef.current) {
      setQuickStartSessionKey((key) => key + 1);
    }
    setMatchmakingOpen(true);
  }, [rushDemoCommand]);

  const handleOpenQuickStart = () => {
    setActiveRoomSession(null);
    setActiveQuickStartCommand(null);
    setQuickStartSessionKey((key) => key + 1);
    setMatchmakingOpen(true);
    onRushPhaseChange?.(null);
  };

  const handleCloseQuickStart = () => {
    setMatchmakingOpen(false);
    setActiveQuickStartCommand(null);
    onRushPhaseChange?.(null);
  };

  const handleEnterRoom = (room: Room) => {
    setActiveRoomSession({
      room,
      sessionKey: `${room.id}-${Date.now()}`
    });
  };

  return (
    <div
      id="post-login-home-view"
      className="relative flex h-full w-full flex-col overflow-hidden bg-[#050514] text-white font-sans antialiased select-none"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${homeBackgroundImage})` }}
        animate={{ opacity: activeTab === 'home' ? 1 : 0 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/34 via-black/10 to-black/44"
        animate={{ opacity: activeTab === 'home' ? 1 : 0 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 bg-[#050514]"
        animate={{ opacity: activeTab === 'home' ? 0 : 1 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      />

      <AnimatePresence initial={false}>
        {activeTab === 'home' && (
          <motion.div
            key="home-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 top-0 z-30"
          >
            <Header
              user={userProfile}
              onOpenProfile={handleOpenProfile}
              onOpenShop={handleOpenShop}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <motion.div
            animate={{ opacity: activeTab === 'home' ? 1 : 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className={`absolute inset-0 flex min-h-0 flex-col justify-between pt-[5.55rem] ${activeTab === 'home' ? 'z-20 pointer-events-auto' : 'z-0 pointer-events-none'}`}
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
                onClick={handleOpenQuickStart}
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

          <motion.div
            animate={{ opacity: activeTab === 'messages' ? 1 : 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className={`absolute inset-0 flex min-h-0 flex-col bg-[#050514] ${activeTab === 'messages' ? 'z-20 pointer-events-auto' : 'z-0 pointer-events-none'}`}
          >
            <MessagesTab />
          </motion.div>

          <motion.div
            animate={{ opacity: activeTab === 'me' ? 1 : 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className={`absolute inset-0 flex min-h-0 flex-col bg-[#050514] ${activeTab === 'me' ? 'z-20 pointer-events-auto' : 'z-0 pointer-events-none'}`}
          >
            <MeTab user={userProfile} onOpenShop={handleOpenShop} />
          </motion.div>

          <motion.div
            animate={{ opacity: activeTab === 'rooms' ? 1 : 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className={`absolute inset-0 flex min-h-0 flex-col bg-[#050514] ${activeTab === 'rooms' ? 'z-20 pointer-events-auto' : 'z-0 pointer-events-none'}`}
          >
            <RoomsTab rooms={rooms} onEnterRoom={handleEnterRoom} />
          </motion.div>
        </div>
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
          onClick={() => setActiveTab('rooms')}
          className="relative flex flex-1 flex-col items-center gap-1"
        >
          <RadioTower className={`h-5 w-5 transition-colors duration-200 ${activeTab === 'rooms' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-400'}`} />
          <span className={`text-[10px] font-bold transition-colors duration-200 ${activeTab === 'rooms' ? 'text-purple-400' : 'text-gray-500'}`}>
            房间
          </span>
          {activeTab === 'rooms' && (
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
            key={quickStartSessionKey}
            room={activeRoom}
            user={userProfile}
            demoCommand={activeQuickStartCommand}
            demoPaused={rushDemoPaused}
            onPhaseChange={onRushPhaseChange}
            onClose={handleCloseQuickStart}
          />
        )}

        {profileModalOpen && (
          <ProfileModal
            setUser={setUserProfile}
            onClose={() => setProfileModalOpen(false)}
          />
        )}

        {activeRoomSession && (
          <MultiMicRoomVisual
            key={activeRoomSession.sessionKey}
            room={activeRoomSession.room}
            user={userProfile}
            onClose={() => setActiveRoomSession(null)}
            embedded
          />
        )}
      </AnimatePresence>
    </div>
  );
};
