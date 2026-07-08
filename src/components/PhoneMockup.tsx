import type React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneMockupProps {
  children: React.ReactNode;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ children }) => {
  return (
    <div 
      id="phone-frame-outer-wrapper" 
      className="relative flex items-center justify-center py-2 px-4 md:px-8 w-full"
    >
      <div id="device-scale-stage" className="device-scale-stage">
        <div className="device-scale-shell">
          {/* 3D Smartphone Device Outer Case Container */}
          <div 
            id="device-chassis"
            className="relative w-[368px] h-[790px] rounded-[52px] bg-[#0d091a] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-4 border-[#2c2340] ring-1 ring-white/10 flex flex-col"
          >
        {/* Dynamic gloss reflection highlight overlay across screen */}
        <div id="device-screen-reflection" className="absolute inset-0 rounded-[44px] bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 pointer-events-none z-40" />

        {/* Physical Side Buttons: Left Side Volume Keys */}
        <div id="btn-vol-up" className="absolute top-[130px] -left-[6px] w-[3px] h-[45px] bg-[#1a1526] rounded-l border-y border-l border-white/10 z-0" />
        <div id="btn-vol-down" className="absolute top-[185px] -left-[6px] w-[3px] h-[45px] bg-[#1a1526] rounded-l border-y border-l border-white/10 z-0" />
        {/* Physical Side Buttons: Right Side Power Key */}
        <div id="btn-power" className="absolute top-[160px] -right-[6px] w-[3px] h-[65px] bg-[#1a1526] rounded-r border-y border-r border-white/10 z-0" />

        {/* Phone Internal Screen Stage */}
        <div 
          id="device-screen-display"
          className="relative w-full h-full rounded-[42px] bg-black overflow-hidden flex flex-col border border-white/5"
        >
          {/* HARDWARE OVERLAYS FOR THE SCREEN */}
          
          {/* 1. Dynamic Island / Camera Notch */}
          <div 
            id="camera-dynamic-island"
            className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[105px] h-[25px] rounded-full bg-black border border-white/[0.05] flex items-center justify-between px-3.5 z-40 shadow-inner"
          >
            {/* Camera Lens Spec reflection */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-blue-950/40 relative flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-indigo-900/65" />
            </div>
            {/* FaceID Indicator dot or Microphone activity LED */}
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500/20 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
            </div>
          </div>

          {/* 2. Top Status Bar Overlay (Fits overlay above notch bounds) */}
          <div 
            id="device-status-bar"
            className="absolute top-0 inset-x-0 h-10 px-6 flex items-center justify-between text-white/90 text-[11px] font-mono font-medium pointer-events-none z-30 select-none"
          >
            {/* Clock */}
            <span id="status-clock" className="font-semibold tracking-wide mt-1.5">09:41</span>

            {/* Status Icons */}
            <div id="status-icons-group" className="flex items-center gap-1.5 mt-1.5">
              {/* Cellular Signal Strength bars */}
              <div className="flex items-end gap-[1.5px] h-[8px] mt-0.5">
                <div className="w-[2.5px] h-[2px] bg-white rounded-sm" />
                <div className="w-[2.5px] h-[3.5px] bg-white rounded-sm" />
                <div className="w-[2.5px] h-[5px] bg-white rounded-sm" />
                <div className="w-[2.5px] h-[6.5px] bg-white rounded-sm" />
                <div className="w-[2.5px] h-[8px] bg-white/40 rounded-sm" />
              </div>
              
              <span className="text-[8px] font-bold tracking-tight font-sans">5G</span>
              <Wifi size={11} className="stroke-[2.5px]" />
              
              {/* Battery Graphic with Percent indicator */}
              <div className="flex items-center gap-0.5 bg-white/10 rounded px-1 py-0.5 text-[8px] border border-white/10 leading-none">
                <span className="font-sans font-extrabold text-[8px]">88%</span>
                <Battery size={10} className="text-emerald-400 fill-emerald-400" />
              </div>
            </div>
          </div>

          {/* INNER VIEW CONTENT */}
          <div id="inner-display-content" className="flex-1 w-full h-full relative z-10">
            {children}
          </div>

          {/* 3. Bottom OS Home Swipe Bar */}
          <div 
            id="home-indicator-area"
            className="absolute bottom-1.5 inset-x-0 h-4 flex items-center justify-center pointer-events-none z-30 select-none"
          >
            <div className="w-28 h-[4px] bg-white/35 rounded-full" />
          </div>

          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
