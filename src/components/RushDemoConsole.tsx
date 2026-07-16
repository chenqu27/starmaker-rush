import { RushDemoShortcut, RushRoomPhase } from '../types';

interface RushDemoConsoleProps {
  disabled: boolean;
  roomPhase: RushRoomPhase | null;
  activeShortcut: RushDemoShortcut | null;
  paused: boolean;
  onTogglePause: () => void;
  onJump: (shortcut: RushDemoShortcut) => void;
}

const shortcuts: Array<{ shortcut: RushDemoShortcut; label: string; hint: string }> = [
  { shortcut: 'other-grabbed', label: '他人抢到', hint: '抢唱判定' },
  { shortcut: 'round-ended', label: '轮次结束', hint: '结果页' },
  { shortcut: 'user-left', label: '用户离场', hint: '空出座位' },
  { shortcut: 'users-ready', label: '用户准备', hint: '全员就绪' }
];

const phaseLabel: Record<RushRoomPhase, string> = {
  intro: '开场动效',
  ready: '准备中',
  live: '抢唱中',
  missed: '已错过',
  singing: '演唱中',
  result: '判定中',
  ended: '已结束'
};

const canUseShortcut = (shortcut: RushDemoShortcut, roomPhase: RushRoomPhase | null) => {
  if (!roomPhase) return false;
  if (shortcut === 'other-grabbed') return roomPhase === 'live' || roomPhase === 'singing';
  if (shortcut === 'round-ended') return roomPhase === 'live' || roomPhase === 'singing' || roomPhase === 'result';
  if (shortcut === 'user-left') return roomPhase === 'ready';
  if (shortcut === 'users-ready') return roomPhase === 'ready';
  return false;
};

export default function RushDemoConsole({ disabled, roomPhase, activeShortcut, paused, onTogglePause, onJump }: RushDemoConsoleProps) {
  return (
    <aside
      id="rush-demo-console"
      className="w-[116px] shrink-0 rounded-2xl border border-fuchsia-300/18 bg-[#12071b]/58 p-2 shadow-[0_0_24px_rgba(236,72,153,0.16),inset_0_0_18px_rgba(168,85,247,0.08)] backdrop-blur-xl"
    >
      <div className="mb-2 rounded-xl bg-white/[0.045] px-2 py-1.5">
        <p className="text-[7px] font-black uppercase tracking-wider text-white/34">Demo State</p>
        <p className="mt-0.5 text-[10px] font-black text-fuchsia-100">
          {disabled ? '未进入主页' : roomPhase ? phaseLabel[roomPhase] : '未进房间'}
        </p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onTogglePause}
        className={`mb-2 w-full rounded-xl border px-2 py-1.5 text-left transition ${
          paused
            ? 'border-cyan-300/50 bg-cyan-300/14 text-white shadow-[0_0_18px_rgba(34,211,238,0.16)]'
            : 'border-amber-300/24 bg-amber-300/10 text-amber-50 hover:border-amber-300/40 hover:bg-amber-300/16'
        } ${disabled ? 'cursor-not-allowed opacity-35' : ''}`}
      >
        <span className="block text-[10px] font-black leading-3">{paused ? '继续' : '暂停'}</span>
        <span className="mt-0.5 block text-[7px] font-bold leading-3 text-white/40">{paused ? '恢复流程' : '冻结流程'}</span>
      </button>

      <div className="grid gap-1.5">
        {shortcuts.map((item) => {
          const active = activeShortcut === item.shortcut;
          const unavailable = disabled || !canUseShortcut(item.shortcut, roomPhase);

          return (
            <button
              key={item.shortcut}
              type="button"
              disabled={unavailable}
              onClick={() => onJump(item.shortcut)}
              className={`rounded-xl border px-2 py-1.5 text-left transition ${
                active
                  ? 'border-cyan-300/50 bg-cyan-300/14 text-white shadow-[0_0_18px_rgba(34,211,238,0.16)]'
                  : 'border-fuchsia-300/16 bg-white/[0.045] text-white/86 hover:border-fuchsia-300/32 hover:bg-fuchsia-300/8'
              } ${unavailable ? 'cursor-not-allowed opacity-35' : ''}`}
            >
              <span className="block text-[10px] font-black leading-3">{item.label}</span>
              <span className="mt-0.5 block text-[7px] font-bold leading-3 text-white/40">{item.hint}</span>
            </button>
          );
        })}
      </div>

      {disabled && (
        <p
          className="mt-2 rounded-md border border-amber-300/12 bg-amber-300/8 px-1 py-0.5 font-bold text-amber-100/68"
          style={{ fontSize: '6px', lineHeight: '8px' }}
        >
          登录后可用
        </p>
      )}
    </aside>
  );
}
