import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mic2, Plus, Users, X } from 'lucide-react';
import { Room } from '../types';

interface RoomsTabProps {
  rooms: Room[];
  onEnterRoom: (room: Room) => void;
}

type DisplayRoom = Room & {
  look: string;
  currentSong: string;
  coverTheme: string;
};

const roomLooks = [
  'from-fuchsia-500/40 via-purple-700/48 to-indigo-950',
  'from-cyan-400/36 via-blue-700/48 to-violet-950',
  'from-rose-400/36 via-pink-700/48 to-purple-950',
  'from-amber-300/34 via-orange-700/42 to-fuchsia-950',
  'from-emerald-300/30 via-teal-700/42 to-blue-950',
  'from-violet-300/34 via-indigo-700/46 to-slate-950'
];

const roomNames = [
  '月光练习室',
  '橘子海岸',
  '银河派对',
  '回声花园',
  '霓虹小站',
  '风铃舞台',
  '蓝莓电台',
  '夏夜合唱',
  '云端包厢',
  '心动声场'
];

const roomTypes = [
  '热唱房',
  '合唱房',
  '派对房',
  '新声房',
  '好友房'
];

const currentSongs = [
  '雨后星河',
  '粉色晚风',
  '夏夜来电',
  '霓虹告白',
  '心跳轨道',
  '蓝色烟火',
  '橘子汽水',
  '午夜回音',
  '云端漫游',
  '闪光日记'
];

export default function RoomsTab({ rooms, onEnterRoom }: RoomsTabProps) {
  const displayRooms = useMemo<DisplayRoom[]>(() => {
    if (rooms.length === 0) return [];

    return Array.from({ length: 10 }, (_, index) => {
      const source = rooms[index % rooms.length];
      return {
        ...source,
        id: `${source.id}-room-${index}`,
        type: roomTypes[index % roomTypes.length],
        title: roomNames[index % roomNames.length],
        onlineCount: 4 + ((index * 3) % 8),
        look: roomLooks[index % roomLooks.length],
        coverTheme: roomLooks[index % roomLooks.length],
        currentSong: currentSongs[index % currentSongs.length],
        micCount: ([4, 6, 8] as const)[index % 3],
        announcement: '欢迎进房，喜欢就上麦一起唱。'
      };
    });
  }, [rooms]);
  const [createdRooms, setCreatedRooms] = useState<DisplayRoom[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [roomName, setRoomName] = useState('我的歌房');
  const [roomAnnouncement, setRoomAnnouncement] = useState('欢迎来到我的歌房，轮流上麦。');
  const [roomMicCount, setRoomMicCount] = useState<4 | 6 | 8>(6);
  const [roomCoverTheme, setRoomCoverTheme] = useState(roomLooks[0]);
  const visibleRooms = [...createdRooms, ...displayRooms];

  const handleCreateRoom = () => {
    if (rooms.length === 0) return;

    const nextIndex = createdRooms.length + displayRooms.length;
    const source = rooms[createdRooms.length % rooms.length];
    const nextRoom: DisplayRoom = {
      ...source,
      id: `created-room-${Date.now()}`,
      type: '自建房',
      title: roomName.trim() || '我的歌房',
      onlineCount: 1,
      look: roomCoverTheme,
      coverTheme: roomCoverTheme,
      announcement: roomAnnouncement.trim() || '欢迎来到我的歌房，轮流上麦。',
      micCount: roomMicCount,
      currentSong: currentSongs[nextIndex % currentSongs.length],
      players: [source.players[0]]
    };

    setCreatedRooms((prev) => [nextRoom, ...prev]);
    setCreateOpen(false);
    setRoomName('我的歌房');
    setRoomAnnouncement('欢迎来到我的歌房，轮流上麦。');
    setRoomMicCount(6);
    setRoomCoverTheme(roomLooks[0]);
    onEnterRoom(nextRoom);
  };

  return (
    <div id="rooms-tab-container" className="relative flex h-full flex-1 flex-col overflow-hidden bg-[#050514] text-white">
      <div className="px-4 pb-4 pt-12">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-black text-white">房间</h1>
            <p className="mt-1 text-xs font-semibold text-white/42">Live singing rooms now</p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-3 py-2 text-[0.7rem] font-black text-white shadow-[0_0_18px_rgba(34,211,238,0.28)]"
          >
            <Plus className="h-3.5 w-3.5" />
            创建房间
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-24 scrollbar-none">
        <div className="grid grid-cols-2 gap-3">
          {visibleRooms.map((room) => (
            <motion.button
              key={room.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onEnterRoom(room)}
              className={`relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${room.look} p-3 text-left shadow-[0_14px_24px_rgba(0,0,0,0.28)]`}
              aria-label={`进入 ${room.title}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.26),transparent_22%),radial-gradient(circle_at_78%_80%,rgba(255,255,255,0.18),transparent_26%)]" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/64 to-transparent" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-black/26 px-2 py-1 text-[0.58rem] font-black uppercase tracking-wide text-white/76 backdrop-blur-sm">
                    {room.type}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-black/24 px-2 py-1 text-[0.58rem] font-black text-white/78 backdrop-blur-sm">
                    <Users className="h-3 w-3" />
                    {room.onlineCount}
                  </span>
                </div>

                <div>
                  <div className="mb-2 flex -space-x-2">
                    {room.players.map((player, playerIndex) => (
                      <img
                        key={`${player.name}-${playerIndex}`}
                        src={player.avatarUrl}
                        alt={player.name}
                        className="h-6 w-6 rounded-full border border-black/40 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <h2 className="truncate font-display text-sm font-black text-white">{room.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-[0.62rem] font-semibold text-white/58">
                    <Mic2 className="h-3 w-3" />
                    <span className="truncate">在唱 {room.currentSong}</span>
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end bg-black/50"
            onClick={() => setCreateOpen(false)}
          >
            <motion.div
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              exit={{ y: 120 }}
              className="max-h-[82%] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0c0828] p-4 pb-7 shadow-[0_-20px_50px_rgba(0,0,0,0.45)] scrollbar-none"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-black text-white">创建房间</h2>
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <label className="mt-5 block text-[0.68rem] font-black uppercase tracking-wide text-white/42">
                房间名称
              </label>
              <input
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                maxLength={12}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30"
                placeholder="输入房间名称"
              />

              <label className="mt-4 block text-[0.68rem] font-black uppercase tracking-wide text-white/42">
                房间公告
              </label>
              <textarea
                value={roomAnnouncement}
                onChange={(event) => setRoomAnnouncement(event.target.value)}
                maxLength={48}
                className="mt-2 h-20 w-full resize-none rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30"
                placeholder="输入房间公告"
              />

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[4, 6, 8].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setRoomMicCount(count as 4 | 6 | 8)}
                    className={`rounded-xl px-3 py-2 text-xs font-black ${roomMicCount === count ? 'bg-cyan-400 text-[#07111f]' : 'bg-white/10 text-white'}`}
                  >
                    {count} 麦
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-6 gap-2">
                {roomLooks.map((look) => (
                  <button
                    key={look}
                    type="button"
                    onClick={() => setRoomCoverTheme(look)}
                    className={`h-9 rounded-xl border bg-gradient-to-br ${look} ${roomCoverTheme === look ? 'border-white' : 'border-white/10'}`}
                    aria-label="选择封面"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleCreateRoom}
                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-3 text-sm font-black text-white shadow-[0_0_22px_rgba(34,211,238,0.28)]"
              >
                创建并进入
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
