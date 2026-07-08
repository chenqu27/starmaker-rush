import { Room, UserProfile, Message, Recording } from './types';
import roomHeroImage from './assets/images/starmaker_rush_hero_1783497446803.jpg';
import popClassicsCardImage from './assets/images/pop_classics_card_transparent.png';

export const initialUserProfile: UserProfile = {
  name: "StarMaker",
  level: 28,
  levelProgress: 72,
  coins: 12450,
  diamonds: 2860,
  vip: true,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
};

export const sampleRooms: Room[] = [
  {
    id: "tiktok-hits",
    type: "ROOM TYPE",
    title: "TIKTOK HITS",
    subtitle: "Hot songs",
    description: "Updated daily",
    onlineCount: 18932,
    gradientClass: "from-rose-500/10 to-pink-600/30",
    glowColor: "rgba(244, 63, 94, 0.5)",
    iconType: "tiktok",
    imageSrc: roomHeroImage,
    players: [
      { name: "Yuki", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" },
      { name: "Leo", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" },
      { name: "Elena", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" }
    ],
    songs: [
      {
        id: "tiktok-1",
        title: "Golden Hour",
        artist: "JVKE",
        duration: 210,
        lyrics: [
          "It's your golden hour",
          "You slow down time",
          "In your golden hour",
          "We were just two kids, just trying to make it",
          "Now we're on the run, no one can break it",
          "I don't need no gold, you are my treasure",
          "We'll be shining on, now and forever",
          "Golden hour in your eyes"
        ]
      },
      {
        id: "tiktok-2",
        title: "Cupid",
        artist: "FIFTY FIFTY",
        duration: 170,
        lyrics: [
          "A hopeless romantic all my life",
          "Surrounded by couples all the time",
          "I guess I should take it as a sign",
          "I'm feeling lonely",
          "Oh, I wish I'd find a lover that could hold me",
          "Now I'm crying in my room",
          "Still I want more, more, more",
          "I gave a second chance to Cupid"
        ]
      },
      {
        id: "tiktok-3",
        title: "Cruel Summer",
        artist: "Taylor Swift",
        duration: 198,
        lyrics: [
          "Fever dream high in the quiet of the night",
          "You know that I caught it",
          "Bad, bad boy, shiny toy with a price",
          "You know that I bought it",
          "And it's new, the shape of your body",
          "It's blue, the feeling I've got",
          "And it's ooh, whoa oh",
          "It's a cruel summer with you"
        ]
      }
    ]
  },
  {
    id: "pop-classics",
    type: "ROOM TYPE",
    title: "POP CLASSICS",
    subtitle: "All-time hits",
    description: "Grab the mic!",
    onlineCount: 24567,
    gradientClass: "from-purple-600/10 to-indigo-700/30",
    glowColor: "rgba(168, 85, 247, 0.5)",
    iconType: "microphone",
    imageSrc: roomHeroImage,
    cardImageSrc: popClassicsCardImage,
    players: [
      { name: "Sarah", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" },
      { name: "John", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
      { name: "Mia", avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100" }
    ],
    songs: [
      {
        id: "pop-1",
        title: "Perfect",
        artist: "Ed Sheeran",
        duration: 263,
        lyrics: [
          "I found a love for me",
          "Darling, just dive right in and follow my lead",
          "I found a girl, beautiful and sweet",
          "I never knew you were the someone waiting for me",
          "We were just kids when we fell in love",
          "Not knowing what it was",
          "I will not give you up this time",
          "Darling, just kiss me slow"
        ]
      },
      {
        id: "pop-2",
        title: "Yesterday",
        artist: "The Beatles",
        duration: 125,
        lyrics: [
          "Yesterday, all my troubles seemed so far away",
          "Now it looks as though they're here to stay",
          "Oh, I believe in yesterday",
          "Suddenly, I'm not half the man I used to be",
          "There's a shadow hanging over me",
          "Oh, yesterday came suddenly",
          "Why she had to go I don't know"
        ]
      },
      {
        id: "pop-3",
        title: "Stay",
        artist: "The Kid LAROI & Justin Bieber",
        duration: 141,
        lyrics: [
          "I do the same thing I told you that I never would",
          "I told you I'd change, even when I knew I never could",
          "I know that I can't find nobody else as good as you",
          "I need you to stay, need you to stay, yeah",
          "I get drunk, wake up, I'm wasted still",
          "I realize the time that I wasted here",
          "I feel like you can't feel the way I feel",
          "Oh, I'll be fucked up if you can't be right here"
        ]
      }
    ]
  },
  {
    id: "new-releases",
    type: "ROOM TYPE",
    title: "NEW RELEASES",
    subtitle: "Brand new songs",
    description: "Sing it first!",
    onlineCount: 15342,
    gradientClass: "from-blue-600/10 to-violet-700/30",
    glowColor: "rgba(59, 130, 246, 0.5)",
    iconType: "headphones",
    imageSrc: roomHeroImage,
    players: [
      { name: "Chloe", avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=100" },
      { name: "Lucas", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
      { name: "Aria", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" }
    ],
    songs: [
      {
        id: "new-1",
        title: "Espresso",
        artist: "Sabrina Carpenter",
        duration: 175,
        lyrics: [
          "Now he's thinkin' 'bout me every night, oh",
          "Is it that sweet? I guess so",
          "Say you can't sleep, baby, I know",
          "That's that me, espresso",
          "I can't relate to desperation",
          "My honeybee, come get this pollen",
          "Too bad your ex don't know what she's missing",
          "Walked in and dream-came-trued it for ya"
        ]
      },
      {
        id: "new-2",
        title: "Birds of a Feather",
        artist: "Billie Eilish",
        duration: 210,
        lyrics: [
          "I want you to stay",
          "'Til I'm in the grave",
          "'Til I rot, more and decay",
          "Like a secondary play",
          "Birds of a feather, we should stick together",
          "I know I said I'd never think I'd love again",
          "But you have got me looking so crazy",
          "Don't know what you did, but I am falling"
        ]
      }
    ]
  }
];

export const sampleMessages: Message[] = [
  {
    id: "m1",
    sender: "Elena 🌸",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    content: "Hey StarMaker! We're queuing up 'Golden Hour' in TikTok Hits! Come grab the mic!",
    time: "2m ago",
    isOnline: true
  },
  {
    id: "m2",
    sender: "Leo 🔥",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
    content: "Dude, that Yesterday cover you sang yesterday was SSS tier! Mind-blowing!",
    time: "23m ago",
    isOnline: true
  },
  {
    id: "m3",
    sender: "Mia 🎵",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100",
    content: "Are we joining the competition tonight? We need a top vocalist for our team.",
    time: "1h ago",
    isOnline: false
  },
  {
    id: "m4",
    sender: "StarMaker Official",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100",
    content: "Congratulations! You have received a Level 28 Diamond Bonus Pack! Check your balance.",
    time: "4h ago",
    isOnline: true
  }
];

export const sampleRecordings: Recording[] = [
  {
    id: "rec1",
    songTitle: "Yesterday",
    artist: "The Beatles",
    score: "SSS",
    date: "2026-07-07",
    likes: 142,
    duration: "2:05"
  },
  {
    id: "rec2",
    songTitle: "Golden Hour",
    artist: "JVKE",
    score: "SS",
    date: "2026-07-05",
    likes: 98,
    duration: "3:30"
  },
  {
    id: "rec3",
    songTitle: "Perfect",
    artist: "Ed Sheeran",
    score: "S",
    date: "2026-06-29",
    likes: 84,
    duration: "4:23"
  }
];
