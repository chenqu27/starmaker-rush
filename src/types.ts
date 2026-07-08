export type AppState = 'SPLASH' | 'MATCHING';

export type MatchState = 'SEARCHING' | 'FOUND' | 'INTRO_VS' | 'READY';

export type NetworkState = 'OPTIMAL' | 'LAGGY' | 'INTERMITTENT';

export type SoundtrackType = 'POP_RUSH' | 'GLOW_SYNTH' | 'HIP_HOP_VIBE' | 'OFF';

export interface Soundtrack {
  id: SoundtrackType;
  title: string;
  bpm: number;
  genre: string;
  colors: string[];
  accent: string;
  secondary: string;
  moodLine: string;
}

export interface MatchedPlayer {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  country: string;
  micStatus: 'ready' | 'connecting' | 'muted';
  isMe?: boolean;
}

export interface LiveRoomJoiner {
  id: string;
  name: string;
  avatar: string;
  action: string;
  emoji: string;
}

export interface Player {
  name: string;
  avatarUrl: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  lyrics: string[];
}

export type RoomIconType = 'microphone' | 'tiktok' | 'headphones';

export interface Room {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  description: string;
  onlineCount: number;
  players: Player[];
  iconType: RoomIconType;
  gradientClass: string;
  glowColor: string;
  imageSrc: string;
  cardImageSrc?: string;
  songs: Song[];
}

export interface UserProfile {
  name: string;
  level: number;
  levelProgress: number;
  coins: number;
  diamonds: number;
  vip: boolean;
  avatarUrl: string;
}

export interface Message {
  id: string;
  sender: string;
  avatarUrl: string;
  content: string;
  time: string;
  isOnline: boolean;
}

export interface Recording {
  id: string;
  songTitle: string;
  artist: string;
  score: string;
  date: string;
  likes: number;
  duration: string;
}
