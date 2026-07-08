import { ArrowRight, Mail, Phone, UserRound } from 'lucide-react';
import rushLogo from '../assets/images/starmaker_rush_logo.png';

interface SplashViewProps {
  onLogin: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.05 20.28c-.96 0-2.04-.6-3.23-.6-1.22 0-2.05.58-3.08.58-2.1 0-4.52-2.14-4.52-5.38 0-3.3 2.1-5.14 4.09-5.14.94 0 1.95.6 2.7.6.73 0 1.92-.68 3.07-.68 1.12 0 2.22.56 2.94 1.5-2.48 1.46-2.08 4.6.43 5.6-.6 1.4-1.43 2.8-2.4 3.52zM12.03 7.25c-.2 0-1.27-.08-1.95-.9-.63-.73-.65-1.85-.6-2.3.93.04 2.1.6 2.7 1.4.6.75.52 1.6.5 1.8z" />
  </svg>
);

const FacebookIcon = () => (
  <span className="text-[28px] font-black leading-none text-white" aria-hidden="true">f</span>
);

const loginOptions = [
  {
    id: 'btn-login-phone',
    label: 'Continue with Phone',
    icon: <Phone size={20} className="text-white" />,
    iconClassName: 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
  },
  {
    id: 'btn-login-google',
    label: 'Continue with Google',
    icon: <GoogleIcon />,
    iconClassName: 'bg-white'
  },
  {
    id: 'btn-login-apple',
    label: 'Continue with Apple',
    icon: <AppleIcon />,
    iconClassName: 'bg-white text-black'
  },
  {
    id: 'btn-login-facebook',
    label: 'Continue with Facebook',
    icon: <FacebookIcon />,
    iconClassName: 'bg-blue-500'
  },
  {
    id: 'btn-login-email',
    label: 'Continue with Email',
    icon: <Mail size={21} className="text-blue-500" />,
    iconClassName: 'bg-white'
  },
  {
    id: 'btn-login-guest',
    label: 'Continue as Guest',
    icon: <UserRound size={23} />,
    iconClassName: 'bg-transparent text-white/45',
    muted: true
  }
];

export const SplashView = ({ onLogin }: SplashViewProps) => {
  return (
    <div id="splash-view-container" className="relative flex flex-col h-full w-full overflow-hidden select-none app-container-immersive">
      <div className="glow-sphere-immersive" />
      <div id="ambient-glow-pink" className="absolute top-1/5 -left-1/3 w-[280px] h-[280px] rounded-full bg-pink-500/10 blur-[80px] pointer-events-none animate-pulse-glow" />
      <div id="ambient-glow-purple" className="absolute bottom-1/5 -right-1/3 w-[320px] h-[320px] rounded-full bg-purple-600/12 blur-[90px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div id="splash-scrollable-body" className="flex-1 overflow-hidden flex flex-col no-scrollbar px-5 pt-[62px] pb-3 z-10">
        <div id="logo-slogan-area" className="rush-brand-lockup">
          <img src={rushLogo} alt="StarMaker Rush" className="rush-logo-image" />
        </div>

        <div id="login-actions-panel" className="w-full flex flex-col gap-2">
          <p className="rush-tagline">Sing fast. Vibe together.</p>

          <div id="login-buttons-stack" className="flex flex-col gap-2">
            {loginOptions.map((option) => (
              <button
                id={option.id}
                key={option.id}
                type="button"
                onClick={onLogin}
                className={`login-list-button ${option.muted ? 'login-list-button-muted' : ''}`}
              >
                <span className={`login-list-icon ${option.iconClassName}`}>
                  {option.icon}
                </span>
                <span className="login-list-label">{option.label}</span>
                <ArrowRight size={20} className="login-list-arrow" />
              </button>
            ))}
          </div>

          <div className="agreement-immersive mt-1 text-[10px] text-white/62 leading-none whitespace-nowrap">
            By continuing, you agree to our <span className="text-purple-300 font-medium">Terms</span> and{' '}
            <span className="text-purple-300 font-medium">Privacy Policy.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
