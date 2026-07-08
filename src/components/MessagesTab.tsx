import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, ArrowLeft, MoreVertical, CheckCheck, Smile } from 'lucide-react';
import { Message } from '../types';
import { sampleMessages } from '../data';

export default function MessagesTab() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [activeChat, setActiveChat] = useState<Message | null>(null);
  const [chatHistory, setChatHistory] = useState<Record<string, Array<{ sender: 'them' | 'me'; text: string; time: string }>>>({
    "m1": [
      { sender: 'them', text: "Hey! Did you see the new TikTok songs added?", time: "10:15 AM" },
      { sender: 'me', text: "Yeah! 'Golden Hour' is so fun to sing.", time: "10:17 AM" },
      { sender: 'them', text: "Hey StarMaker! We're queuing up 'Golden Hour' in TikTok Hits! Come grab the mic!", time: "10:20 AM" }
    ],
    "m2": [
      { sender: 'them', text: "Yesterday's session was so crazy!", time: "Yesterday" },
      { sender: 'me', text: "Yes, we won three mic grabs in a row!", time: "Yesterday" },
      { sender: 'them', text: "Dude, that Yesterday cover you sang yesterday was SSS tier! Mind-blowing!", time: "Yesterday" }
    ]
  });
  const [inputVal, setInputVal] = useState('');

  const handleOpenChat = (msg: Message) => {
    setActiveChat(msg);
    // Initialize blank chat history if none exists
    if (!chatHistory[msg.id]) {
      setChatHistory(prev => ({
        ...prev,
        [msg.id]: [{ sender: 'them', text: msg.content, time: '12:00 PM' }]
      }));
    }
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!activeChat || !inputVal.trim()) return;

    const userMessageText = inputVal.trim();
    const chatID = activeChat.id;

    // Append user message
    const newMsg = { sender: 'me' as const, text: userMessageText, time: 'Just now' };
    setChatHistory(prev => ({
      ...prev,
      [chatID]: [...(prev[chatID] || []), newMsg]
    }));
    setInputVal('');

    // Update message snippet in the main list
    setMessages(prev => prev.map(m => m.id === chatID ? { ...m, content: userMessageText, time: '1s ago' } : m));

    // Simulate reply from team member
    setTimeout(() => {
      const mockReplies = [
        "Let's go! I'll enter the room right now 🚀",
        "Haha totally! Meet me on stage in 5 minutes! 🎤",
        "Absolutely! Let's get that SSS rating together! 🏆",
        "Nice, I'm ready!"
      ];
      const randomReplyText = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      const replyMsg = { sender: 'them' as const, text: randomReplyText, time: 'Just now' };
      
      setChatHistory(prev => ({
        ...prev,
        [chatID]: [...(prev[chatID] || []), replyMsg]
      }));

      setMessages(prev => prev.map(m => m.id === chatID ? { ...m, content: randomReplyText, time: 'Just now' } : m));
    }, 1500);
  };

  return (
    <div id="messages-tab-container" className="relative flex h-full flex-1 flex-col bg-[#050514] text-white">
      <AnimatePresence mode="wait">
        {!activeChat ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-[#08081f]">
              <h1 className="text-xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">
                Inbox
              </h1>
              {/* Search bar */}
              <div className="flex items-center gap-2 bg-[#12122d] border border-white/5 rounded-xl px-3 py-2 mt-3 text-xs text-gray-400">
                <Search className="w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search vocalists, clubs, or messages..." 
                  className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto scrollbar-none p-2 flex flex-col gap-1.5">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenChat(msg)}
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#121232]/40 bg-[#12122d]/20 border border-white/0 hover:border-white/5 transition-all cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow">
                      <img src={msg.avatarUrl} alt={msg.sender} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    {msg.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#050514]" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-display font-bold text-sm text-gray-200">{msg.sender}</span>
                      <span className="text-[10px] text-gray-500 font-mono font-bold">{msg.time}</span>
                    </div>
                    <p className="text-gray-400 text-xs truncate max-w-[200px] leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute inset-0 bg-[#050512] z-40 flex flex-col justify-between"
          >
            {/* Chat Box Header */}
            <div className="flex items-center justify-between p-4 bg-[#08081f] border-b border-white/5">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="relative">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/5">
                    <img src={activeChat.avatarUrl} alt={activeChat.sender} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  {activeChat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-[#050512]" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-display font-bold text-gray-200">{activeChat.sender}</span>
                  <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                    {activeChat.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer hover:text-white transition-colors" />
            </div>

            {/* Chat Log Message Area */}
            <div className="flex-1 overflow-y-auto scrollbar-none p-4 flex flex-col gap-3">
              {(chatHistory[activeChat.id] || []).map((chat, idx) => {
                const isMe = chat.sender === 'me';
                return (
                  <div 
                    key={idx}
                    className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-[0_4px_12px_rgba(168,85,247,0.15)]' 
                        : 'bg-[#12122d] text-gray-100 rounded-tl-none border border-white/5'
                    }`}>
                      {chat.text}
                    </div>
                    <span className="text-[9px] text-gray-600 mt-1 font-mono">{chat.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input controls */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#08081f] border-t border-white/5 flex items-center gap-2">
              <button type="button" className="text-gray-500 hover:text-purple-400 p-1.5 transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="bg-[#12122e] text-xs text-white placeholder-gray-500 flex-1 outline-none py-2.5 px-4 rounded-full border border-white/5 focus:border-purple-500/50 transition-colors"
              />
              <motion.button 
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white shadow-md transition-colors"
              >
                <Send className="w-4 h-4 fill-white" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
