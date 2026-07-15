import { FormEvent, useState } from 'react';
import { ArrowRight, CalendarDays, UserRound } from 'lucide-react';
import { UserProfile } from '../types';

export interface BasicProfileInfo {
  name: string;
  avatarUrl: string;
  gender: 'female' | 'male' | 'other';
  birthday: string;
}

interface ProfileSetupViewProps {
  initialProfile: UserProfile;
  onComplete: (profile: BasicProfileInfo) => void;
}

const avatarOptions = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
];

export default function ProfileSetupView({ onComplete }: ProfileSetupViewProps) {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [gender, setGender] = useState<BasicProfileInfo['gender'] | null>(null);
  const [birthday, setBirthday] = useState('');
  const basicInfoComplete = Boolean(name.trim() && gender && birthday);
  const canSubmit = basicInfoComplete && Boolean(avatarUrl);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!canSubmit || !gender) return;
    onComplete({ name: trimmedName, avatarUrl, gender, birthday });
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#07041a] px-5 pb-6 pt-[4.5rem] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(236,72,153,0.2),transparent_31%),radial-gradient(circle_at_90%_65%,rgba(34,211,238,0.13),transparent_32%)]" />

      <form onSubmit={handleSubmit} className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-fuchsia-300">Create profile</p>
          <h1 className="mt-2 font-display text-2xl font-black">完善基础信息</h1>
          <p className="mt-1 text-xs font-semibold text-white/48">让房间里的朋友认识你</p>
        </div>

        <label className="mt-7 block">
          <span className="mb-2 block text-xs font-black text-white/72">昵称</span>
          <span className="flex h-12 items-center gap-2 rounded-xl border border-white/12 bg-white/7 px-3 focus-within:border-fuchsia-300/55">
            <UserRound className="h-4 w-4 text-white/38" />
            <input
              value={name}
              onChange={(event) => setName(event.target.value.slice(0, 20))}
              placeholder="输入你的昵称"
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none placeholder:text-white/26"
            />
            <span className="text-[0.62rem] font-semibold text-white/26">{name.length}/20</span>
          </span>
        </label>

        <div className="mt-5">
          <p className="mb-2 text-xs font-black text-white/72">性别</p>
          <div className="grid grid-cols-3 rounded-xl bg-white/7 p-1">
            {([['female', '女'], ['male', '男'], ['other', '其他']] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setGender(value)}
                className={`h-9 rounded-lg text-xs font-black transition ${gender === value ? 'bg-fuchsia-500 text-white shadow' : 'text-white/45'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-xs font-black text-white/72">生日</span>
          <span className="flex h-12 items-center gap-2 rounded-xl border border-white/12 bg-white/7 px-3">
            <CalendarDays className="h-4 w-4 text-white/38" />
            <input
              type="date"
              value={birthday}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(event) => setBirthday(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-white/78 outline-none [color-scheme:dark]"
            />
          </span>
        </label>

        {basicInfoComplete && (
          <div className="mt-5">
            <p className="mb-3 text-xs font-black text-white/72">选择头像</p>
            <div className="flex justify-between">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setAvatarUrl(avatar)}
                  className={`h-[3.65rem] w-[3.65rem] overflow-hidden rounded-full border-2 p-0.5 transition ${avatarUrl === avatar ? 'border-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.55)]' : 'border-white/14'}`}
                  aria-label="选择头像"
                >
                  <img src={avatar} alt="" className="h-full w-full rounded-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-auto flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-sm font-black text-white shadow-[0_0_24px_rgba(236,72,153,0.3)] disabled:cursor-not-allowed disabled:opacity-35"
        >
          进入 StarMaker Rush
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
