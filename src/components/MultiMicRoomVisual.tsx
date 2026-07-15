import { useState, type CSSProperties } from 'react';
import {
  BatteryMedium,
  Gift,
  Heart,
  LockKeyhole,
  LogOut,
  Megaphone,
  MessageCircle,
  Mic2,
  MicOff,
  Music2,
  Plus,
  Radio,
  Search,
  Send,
  Signal,
  Sparkles,
  UserRound,
  Users,
  Wifi,
  X
} from 'lucide-react';
import homeBackgroundImage from '../assets/images/home_background.png';
import type { Room, UserProfile } from '../types';
import './MultiMicRoomVisual.css';

type SheetName = 'song' | 'gift' | 'user' | 'self' | null;
type SeatState = 'idle' | 'talking' | 'muted' | 'empty' | 'locked';

interface Seat {
  id: number;
  name: string;
  avatar?: string;
  state: SeatState;
  isSelf?: boolean;
}

interface MultiMicRoomVisualProps {
  key?: string;
  room?: Room;
  user?: UserProfile;
  onClose?: () => void;
  embedded?: boolean;
}

const initialSeats: Seat[] = [
  {
    id: 2,
    name: 'Nana',
    avatar: avatar23,
    state: 'idle'
  },
  {
    id: 3,
    name: 'Leo',
    avatar: avatar11,
    state: 'muted'
  },
  { id: 4, name: '', state: 'empty' },
  {
    id: 5,
    name: 'Echo',
    avatar: avatar09,
    state: 'talking'
  },
  { id: 6, name: '', state: 'empty' },
  {
    id: 7,
    name: 'Mika',
    avatar: avatar27,
    state: 'idle'
  },
  {
    id: 8,
    name: 'Ava',
    avatar: avatar17,
    state: 'idle'
  },
  { id: 9, name: '', state: 'empty' }
];

const selfAvatar = avatar29;

const fallbackSinger = {
  name: 'Yuki',
  avatarUrl: avatar35
};

const fallbackSong = {
  title: 'Golden Hour',
  artist: 'JVKE',
  lyrics: ['你让时间都慢了下来', '这一刻像金色的海', '下一句，房间一起唱']
};

const createInitialSeats = (room?: Room): Seat[] => {
  const guests = room?.players.slice(1) ?? [];
  let guestIndex = 0;

  return initialSeats.map((seat) => {
    if (!seat.avatar || guestIndex >= guests.length) return { ...seat };

    const guest = guests[guestIndex];
    guestIndex += 1;
    return { ...seat, name: guest.name, avatar: guest.avatarUrl };
  });
};

const gifts = [
  { icon: '✦', name: '星光', price: 19, tone: 'cyan' },
  { icon: '♥', name: '心动', price: 66, tone: 'pink' },
  { icon: '♛', name: '皇冠', price: 188, tone: 'gold' },
  { icon: '♫', name: '专属曲', price: 520, tone: 'lime' }
];

export default function MultiMicRoomVisual({ room, user, onClose, embedded = false }: MultiMicRoomVisualProps) {
  const [sheet, setSheet] = useState<SheetName>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [toast, setToast] = useState('');
  const [followed, setFollowed] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [roomSeats, setRoomSeats] = useState<Seat[]>(() => createInitialSeats(room));
  const selfSeat = roomSeats.find((seat) => seat.isSelf);
  const isOnMic = Boolean(selfSeat);
  const singer = room?.players[0] ?? fallbackSinger;
  const currentSong = room?.songs[0] ?? fallbackSong;
  const roomTitle = room?.title ?? '银河派对厅';
  const roomType = room?.type ?? '派对房';
  const roomAnnouncement = room?.announcement ?? '合唱接力进行中，完成可解锁限定称号';
  const onlineCount = Math.min(12, Math.max(8, room?.onlineCount ?? 10));
  const currentSelfAvatar = user?.avatarUrl ?? selfAvatar;
  const lyricLines = currentSong.lyrics.length >= 3 ? currentSong.lyrics.slice(0, 3) : fallbackSong.lyrics;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 1500);
  };

  const joinSeat = (seatId: number) => {
    setRoomSeats((items) => items.map((seat) => {
      if (seat.isSelf) {
        return { ...seat, name: '', avatar: undefined, state: 'empty', isSelf: undefined };
      }
      if (seat.id === seatId) {
        return { ...seat, name: '我', avatar: currentSelfAvatar, state: 'idle', isSelf: true };
      }
      return seat;
    }));
    setSelectedSeat(null);
    setSheet(null);
    showToast(`已上 ${seatId} 号麦`);
  };

  const leaveSeat = () => {
    if (!selfSeat) return;

    setRoomSeats((items) => items.map((seat) => (
      seat.isSelf
        ? { ...seat, name: '', avatar: undefined, state: 'empty', isSelf: undefined }
        : seat
    )));
    setSelectedSeat(null);
    setSheet(null);
    showToast('已离开麦位');
  };

  const openSeat = (seat: Seat) => {
    if (seat.state === 'empty') {
      joinSeat(seat.id);
      return;
    }
    if (seat.state === 'locked') {
      showToast('该麦位已锁定');
      return;
    }

    setSelectedSeat(seat);
    setSheet(seat.isSelf ? 'self' : 'user');
  };

  const handleMicAction = () => {
    if (selfSeat) {
      setSelectedSeat(selfSeat);
      setSheet('self');
      return;
    }

    const firstOpenSeat = roomSeats.find((seat) => seat.state === 'empty');
    if (firstOpenSeat) joinSeat(firstOpenSeat.id);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    showToast('已退出房间');
  };

  return (
    <div className={`mmv-page ${embedded ? 'mmv-page-embedded' : ''}`}>
      <div className={`mmv-device ${embedded ? 'mmv-device-embedded' : ''}`} aria-label="多麦唱歌房手机界面概念稿">
        {!embedded && <div className="mmv-device-speaker" />}
        <div
          className={`mmv-screen ${embedded ? 'mmv-screen-embedded' : ''}`}
          style={{ '--room-background': `url(${homeBackgroundImage})` } as CSSProperties}
        >
          <div className="mmv-background" />
          <div className="mmv-stage-light mmv-stage-light-left" />
          <div className="mmv-stage-light mmv-stage-light-right" />

          <div className="mmv-statusbar">
            <span>09:41</span>
            <div className="mmv-status-icons">
              <Signal size={12} fill="currentColor" />
              <Wifi size={13} />
              <BatteryMedium size={15} fill="currentColor" />
            </div>
          </div>

          <header className="mmv-header">
            <button className="mmv-room-identity" type="button" onClick={() => showToast('已展开房间信息')}>
              <span className="mmv-room-logo">
                <img src={singer.avatarUrl} alt={singer.name} referrerPolicy="no-referrer" />
                <Radio size={17} />
              </span>
              <span className="mmv-room-copy">
                <strong>
                  <span>{roomTitle}</span>
                  <button
                    className={`mmv-title-announcement ${announcementOpen ? 'is-active' : ''}`}
                    type="button"
                    aria-label="房间公告"
                    aria-expanded={announcementOpen}
                    onClick={(event) => {
                      event.stopPropagation();
                      setAnnouncementOpen((value) => !value);
                    }}
                  >
                    <Megaphone size={14} />
                  </button>
                </strong>
              </span>
            </button>

            <button className="mmv-online" type="button" onClick={() => showToast(`在线 ${onlineCount} 人`)}>
              <Users size={14} />
              <span>{onlineCount}</span>
            </button>

            <button className="mmv-icon-button" type="button" aria-label="关闭房间" onClick={handleClose}>
              <X size={18} />
            </button>
          </header>

          {announcementOpen && (
            <section className="mmv-announcement-card" aria-label="房间公告">
              <span>房间公告</span>
              <strong>{roomAnnouncement}</strong>
              <small>{roomType} · 欢迎上麦一起唱</small>
            </section>
          )}

          <main className="mmv-stage">
            <div className="mmv-seat-row mmv-seat-row-top">
              <SeatButton seat={roomSeats[0]} onClick={openSeat} />
              <button
                type="button"
                className="mmv-singer"
                aria-label={`查看主唱 ${singer.name}`}
                onClick={() => {
                  setSelectedSeat({
                    id: 1,
                    name: singer.name,
                    avatar: singer.avatarUrl,
                    state: 'talking'
                  });
                  setSheet('user');
                }}
              >
                <span className="mmv-singer-orbit mmv-orbit-one" />
                <span className="mmv-singer-avatar-wrap">
                  <img
                    src={singer.avatarUrl}
                    alt={singer.name}
                    referrerPolicy="no-referrer"
                  />
                </span>
                <strong className="mmv-singer-name">{singer.name}</strong>
              </button>
              <SeatButton seat={roomSeats[1]} onClick={openSeat} />
              <SeatButton seat={roomSeats[2]} onClick={openSeat} />
            </div>

            <div className="mmv-song-title">
              <strong>{currentSong.title}</strong>
              <small>{currentSong.artist} · 01:24 / 03:30</small>
            </div>

            <div className="mmv-lyrics" aria-label="实时歌词">
              <p>{lyricLines[0]}</p>
              <strong>{lyricLines[1]}</strong>
              <p>{lyricLines[2]}</p>
            </div>

            <div className="mmv-wave" aria-hidden="true">
              {[8, 15, 24, 13, 30, 20, 10, 26, 18, 9, 22, 14, 28, 12, 19, 8].map((height, index) => (
                <span key={`${height}-${index}`} style={{ height }} />
              ))}
            </div>

            <div className="mmv-seat-row mmv-seat-row-bottom">
              {roomSeats.slice(3).map((seat) => (
                <SeatButton key={seat.id} seat={seat} onClick={openSeat} />
              ))}
            </div>
          </main>

          <section className="mmv-chat" aria-label="公屏聊天">
            <div className="mmv-system-message"><Sparkles size={11} /> 小橘子进入了房间</div>
            <p><b className="mmv-name-cyan">Mika</b><span>副歌一起冲！</span></p>
            <p><b className="mmv-name-yellow">Leo</b><span>送给 {singer.name}</span><em>心动 ×3</em></p>
            <p><b className="mmv-name-pink">Nana</b><span>下一首欢迎上麦～</span></p>
          </section>

          <footer className={`mmv-dock ${isOnMic ? 'is-on-mic' : ''}`}>
            <button className="mmv-chat-input" type="button" onClick={() => showToast('公屏输入已打开')}>
              <MessageCircle size={17} />
              <span>说点好玩的...</span>
            </button>
            <button className="mmv-dock-action mmv-mic-action" type="button" onClick={handleMicAction} aria-label={isOnMic ? '麦位操作' : '直接上麦'}>
              <Mic2 size={21} />
            </button>
            <button className="mmv-dock-action" type="button" onClick={() => setSheet('song')} aria-label="点歌">
              <Music2 size={20} />
            </button>
            <button className="mmv-dock-action mmv-gift-action" type="button" onClick={() => { setSelectedSeat(null); setSheet('gift'); }} aria-label="送礼">
              <Gift size={20} />
            </button>
            <div className="mmv-home-indicator" />
          </footer>

          {toast && <div className="mmv-toast">{toast}</div>}

          {sheet && (
            <div className="mmv-sheet-backdrop" onClick={() => setSheet(null)}>
              <section className="mmv-sheet" onClick={(event) => event.stopPropagation()}>
                <div className="mmv-sheet-handle" />
                <button className="mmv-sheet-close" type="button" onClick={() => setSheet(null)} aria-label="关闭">
                  <X size={17} />
                </button>
                {sheet === 'song' && <SongSheet onDone={(message) => showToast(message)} />}
                {sheet === 'gift' && <GiftSheet targetName={selectedSeat?.name || singer.name} onDone={(message) => showToast(message)} />}
                {sheet === 'self' && selectedSeat && (
                  <SelfSeatSheet
                    seat={selectedSeat}
                    onProfile={() => setSheet('user')}
                    onGift={() => { setSelectedSeat(null); setSheet('gift'); }}
                    onLeave={leaveSeat}
                  />
                )}
                {sheet === 'user' && selectedSeat && (
                  <UserSheet
                    seat={selectedSeat}
                    followed={followed}
                    onFollow={() => setFollowed((value) => !value)}
                    onGift={() => {
                      if (selectedSeat.isSelf) setSelectedSeat(null);
                      setSheet('gift');
                    }}
                  />
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SeatButton({ seat, onClick }: { key?: string | number; seat: Seat; onClick: (seat: Seat) => void }) {
  const seatLabel = seat.state === 'empty' ? '空麦位' : seat.state === 'locked' ? '锁定麦位' : seat.name;
  return (
    <button type="button" className={`mmv-seat-button is-${seat.state}`} onClick={() => onClick(seat)} aria-label={`${seat.id}号麦 ${seatLabel}`}>
      <span className="mmv-seat-number">{seat.id}</span>
      <span className="mmv-seat-avatar">
        {seat.avatar ? <img src={seat.avatar} alt={seat.name} referrerPolicy="no-referrer" /> : seat.state === 'locked' ? <LockKeyhole size={18} /> : <Plus size={20} />}
        {seat.state === 'talking' && <span className="mmv-speaking-bars"><i /><i /><i /></span>}
        {seat.state === 'muted' && <span className="mmv-muted"><MicOff size={10} /></span>}
      </span>
      {seat.state !== 'empty' && seat.state !== 'locked' && <strong>{seat.name}</strong>}
    </button>
  );
}

function SelfSeatSheet({ seat, onProfile, onGift, onLeave }: { seat: Seat; onProfile: () => void; onGift: () => void; onLeave: () => void }) {
  return (
    <div className="mmv-sheet-content">
      <div className="mmv-self-seat-card">
        <img src={seat.avatar} alt="我的头像" referrerPolicy="no-referrer" />
        <div>
          <h2>{seat.id}号麦位 · 我</h2>
          <p>已在麦上，可点歌或参与聊天</p>
        </div>
      </div>
      <div className="mmv-self-actions">
        <button type="button" onClick={onProfile}>
          <UserRound size={19} />
          <span>查看资料</span>
        </button>
        <button type="button" onClick={onGift}>
          <Gift size={19} />
          <span>送礼</span>
        </button>
        <button type="button" onClick={onLeave}>
          <LogOut size={19} />
          <span>离开</span>
        </button>
      </div>
    </div>
  );
}

function SongSheet({ onDone }: { onDone: (message: string) => void }) {
  return (
    <div className="mmv-sheet-content">
      <div className="mmv-sheet-title-row"><h2>点歌台</h2><span>已排 3 首</span></div>
      <div className="mmv-song-tabs"><b>推荐</b><span>热歌</span><span>已点</span><span>我的</span></div>
      <label className="mmv-search"><Search size={15} /><input readOnly placeholder="搜索歌曲或歌手" /></label>
      <div className="mmv-song-list">
        {[
          ['夜空中最亮的星', '逃跑计划'],
          ['小幸运', '田馥甄'],
          ['如果可以', '韦礼安']
        ].map(([title, artist], index) => (
          <div key={title}>
            <span>{index + 1}</span><p><strong>{title}</strong><small>{artist} · 伴奏</small></p>
            <button type="button" onClick={() => onDone(`《${title}》已加入歌单`)}>点歌</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GiftSheet({ targetName, onDone }: { targetName: string; onDone: (message: string) => void }) {
  return (
    <div className="mmv-sheet-content">
      <div className="mmv-sheet-title-row"><h2>送给 {targetName}</h2><button type="button">切换对象</button></div>
      <div className="mmv-gift-grid">
        {gifts.map((gift) => (
          <button type="button" key={gift.name} onClick={() => onDone(`已送出${gift.name}`)}>
            <span className={`mmv-gift-icon is-${gift.tone}`}>{gift.icon}</span>
            <strong>{gift.name}</strong>
            <small>◆ {gift.price}</small>
          </button>
        ))}
      </div>
      <div className="mmv-gift-footer"><span>余额 ◆ 2,860</span><button type="button"><Send size={15} /> 连送</button></div>
    </div>
  );
}

function UserSheet({ seat, followed, onFollow, onGift }: { seat: Seat; followed: boolean; onFollow: () => void; onGift: () => void }) {
  return (
    <div className="mmv-sheet-content">
      <div className="mmv-user-card">
        <img src={seat.avatar} alt={seat.name} referrerPolicy="no-referrer" />
        <div><h2>{seat.name}</h2><p>Lv.28 · 12.8k 关注者</p><span>今晚心动值 TOP 1</span></div>
      </div>
      <div className="mmv-user-stats"><span><b>86</b>作品</span><span><b>2.4k</b>获赞</span><span><b>92</b>平均分</span></div>
      <div className={`mmv-user-actions ${seat.isSelf ? 'is-self' : ''}`}>
        {!seat.isSelf && (
          <button type="button" onClick={onFollow}><Heart size={17} fill={followed ? 'currentColor' : 'none'} />{followed ? '已关注' : '关注'}</button>
        )}
        <button type="button" onClick={onGift}><Gift size={17} />送礼</button>
      </div>
    </div>
  );
}

import avatar09 from '../assets/avatars/avatar_09.jpg';
import avatar11 from '../assets/avatars/avatar_11.jpg';
import avatar17 from '../assets/avatars/avatar_17.jpg';
import avatar23 from '../assets/avatars/avatar_23.jpg';
import avatar27 from '../assets/avatars/avatar_27.jpg';
import avatar29 from '../assets/avatars/avatar_29.jpg';
import avatar35 from '../assets/avatars/avatar_35.jpg';