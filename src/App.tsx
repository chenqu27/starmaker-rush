import { useState } from 'react';
import { Radio } from 'lucide-react';
import { RushDemoCommand, RushDemoShortcut, RushRoomPhase } from './types';
import { PhoneMockup } from './components/PhoneMockup';
import { SplashView } from './components/SplashView';
import { HomeView } from './components/HomeView';
import RushDemoConsole from './components/RushDemoConsole';
import ProfileSetupView, { BasicProfileInfo } from './components/ProfileSetupView';
import { initialUserProfile } from './data';

type EntryStep = 'login' | 'profile' | 'home';

export default function App() {
  const [entryStep, setEntryStep] = useState<EntryStep>('login');
  const [basicProfile, setBasicProfile] = useState<BasicProfileInfo | null>(null);
  const [rushDemoCommand, setRushDemoCommand] = useState<RushDemoCommand | null>(null);
  const [activeDemoShortcut, setActiveDemoShortcut] = useState<RushDemoShortcut | null>(null);
  const [rushRoomPhase, setRushRoomPhase] = useState<RushRoomPhase | null>(null);
  const [rushDemoPaused, setRushDemoPaused] = useState(false);

  const handleRushDemoJump = (shortcut: RushDemoShortcut) => {
    setRushDemoPaused(false);
    setActiveDemoShortcut(shortcut);
    setRushDemoCommand({
      id: Date.now(),
      shortcut
    });
  };

  const handleProfileComplete = (profile: BasicProfileInfo) => {
    setBasicProfile(profile);
    setEntryStep('home');
  };

  return (
    <div
      id="app-root-container"
      className="min-h-screen w-full bg-[#030107] text-white flex flex-col justify-between relative overflow-x-hidden font-sans antialiased"
    >
      <div
        id="bg-ambient-aurora"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-gradient-to-tr from-purple-800/10 via-pink-600/10 to-cyan-500/5 blur-[120px] pointer-events-none"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      <header
        id="desktop-showcase-header"
        className="relative w-full px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Radio size={18} className="text-white" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono font-black text-pink-400">
              UI Prototype
            </span>
            <h1 className="text-base font-black font-display text-white leading-none">
              StarMaker Rush
            </h1>
          </div>
        </div>

        <span className="text-xs font-mono text-white/40 hidden sm:inline">
          Static interaction screen only
        </span>
      </header>

      <main
        id="app-workspace"
        className="flex-1 min-h-0 w-full max-w-6xl mx-auto flex items-center justify-center relative z-10 px-4 md:px-6 py-6"
      >
        <div className="relative flex items-center justify-center">
        <div className="rounded-[54px] shadow-[0_0_90px_rgba(236,72,153,0.45)]">
          <PhoneMockup>
            {entryStep === 'login' && <SplashView onLogin={() => setEntryStep('profile')} />}
            {entryStep === 'profile' && (
              <ProfileSetupView initialProfile={initialUserProfile} onComplete={handleProfileComplete} />
            )}
            {entryStep === 'home' && (
              <HomeView
                initialProfile={basicProfile ? { ...initialUserProfile, ...basicProfile } : initialUserProfile}
                rushDemoCommand={rushDemoCommand}
                rushDemoPaused={rushDemoPaused}
                onRushPhaseChange={setRushRoomPhase}
              />
            )}
          </PhoneMockup>
        </div>
        <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2">
          <RushDemoConsole
            disabled={entryStep !== 'home'}
            roomPhase={rushRoomPhase}
            activeShortcut={activeDemoShortcut}
            paused={rushDemoPaused}
            onTogglePause={() => setRushDemoPaused((prev) => !prev)}
            onJump={handleRushDemoJump}
          />
        </div>
        </div>
      </main>

      <footer
        id="app-showcase-footer"
        className="relative w-full py-4 px-6 border-t border-white/5 bg-black/30 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40 z-10"
      >
        <p className="font-mono text-[10px]">
          STARMAKER RUSH MOBILE UI PROTOTYPE
        </p>
        <p className="font-sans">
          External demo console is for product review only.
        </p>
      </footer>
    </div>
  );
}
