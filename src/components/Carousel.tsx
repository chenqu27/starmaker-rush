import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import { Room } from '../types';

interface CarouselProps {
  rooms: Room[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

type MoveDirection = 'next' | 'prev';

const SWIPE_DISTANCE = 174;
const SWIPE_THRESHOLD = 50;
const TRANSITION_MS = 360;
const ARC_RADIUS_X = 206;
const ARC_DEPTH_Y = 20;

export default function Carousel({ rooms, activeIndex, setActiveIndex }: CarouselProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [settleOffset, setSettleOffset] = useState(0);
  const startXRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const settleTimerRef = useRef<number | null>(null);

  const dragProgress = Math.max(-1, Math.min(1, dragOffset / SWIPE_DISTANCE));
  const visualOffset = isSettling ? settleOffset : dragProgress;
  const carouselTransition = { type: 'tween' as const, duration: TRANSITION_MS / 1000, ease: 'easeOut' as const };

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, []);

  const getMoveDirection = (nextIndex: number): MoveDirection => {
    const forwardDistance = (nextIndex - activeIndex + rooms.length) % rooms.length;
    return forwardDistance <= rooms.length / 2 ? 'next' : 'prev';
  };

  const moveToIndex = (nextIndex: number, direction: MoveDirection = getMoveDirection(nextIndex)) => {
    if (nextIndex === activeIndex) return;

    if (settleTimerRef.current) {
      window.clearTimeout(settleTimerRef.current);
    }

    setIsDragging(false);
    setDragOffset(0);
    setIsSettling(true);
    setSettleOffset(direction === 'next' ? -1 : 1);

    settleTimerRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setSettleOffset(0);
      setIsSettling(false);
      settleTimerRef.current = null;
    }, TRANSITION_MS);
  };

  const getCircularPose = (slot: number) => {
    const angle = (slot * 2 * Math.PI) / Math.max(rooms.length, 1);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const frontness = (cos + 1) / 2;

    return {
      x: sin * ARC_RADIUS_X,
      y: (1 - cos) * ARC_DEPTH_Y,
      scale: 0.78 + frontness * 0.22,
      rotate: sin * 7,
      opacity: 0.58 + frontness * 0.42,
      zIndex: Math.round(8 + frontness * 34),
      frontness
    };
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isSettling) return;

    startXRef.current = event.clientX;
    hasDraggedRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const nextOffset = event.clientX - startXRef.current;
    if (Math.abs(nextOffset) > 5) {
      hasDraggedRef.current = true;
    }

    setDragOffset(Math.max(-SWIPE_DISTANCE, Math.min(SWIPE_DISTANCE, nextOffset)));
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragOffset < -SWIPE_THRESHOLD) {
      const nextIndex = (activeIndex + 1) % rooms.length;
      moveToIndex(nextIndex, 'next');
    } else if (dragOffset > SWIPE_THRESHOLD) {
      const prevIndex = (activeIndex - 1 + rooms.length) % rooms.length;
      moveToIndex(prevIndex, 'prev');
    } else if (Math.abs(dragOffset) > 4) {
      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current);
      }

      setIsSettling(true);
      setSettleOffset(0);

      settleTimerRef.current = window.setTimeout(() => {
        setIsSettling(false);
        settleTimerRef.current = null;
      }, TRANSITION_MS);
    }

    setDragOffset(0);
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div id="swipeable-carousel-container" className="relative flex translate-y-8 flex-col items-center justify-center py-1 w-full max-w-md mx-auto select-none overflow-hidden">
      {/* Circular Track Stage */}
      <motion.div
        className="relative flex items-center justify-center w-full h-[404px]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {rooms.map((room, i) => {
          // Calculate relative position with wrapping
          let diff = i - activeIndex;
          if (diff < -rooms.length / 2) diff += rooms.length;
          if (diff > rooms.length / 2) diff -= rooms.length;

          const isActive = diff === 0;

          const slot = diff + visualOffset;
          const pose = getCircularPose(slot);
          const isFocused = pose.frontness > 0.98;
          const hasCustomCardImage = Boolean(room.cardImageSrc);

          return (
            <motion.div
              key={room.id}
              id={`room-card-${room.id}`}
              onClick={() => {
                if (!hasDraggedRef.current && !isActive) {
                  moveToIndex(i);
                }
              }}
              style={{
                zIndex: pose.zIndex
              }}
              animate={{
                x: pose.x,
                y: pose.y,
                rotate: pose.rotate,
                scale: pose.scale,
                opacity: pose.opacity,
                transition: isDragging
                  ? { duration: 0 }
                  : !isSettling && Math.abs(visualOffset) === 0
                    ? { duration: 0 }
                    : carouselTransition
              }}
              className={`absolute w-[220px] h-[360px] rounded-[1.55rem] bg-[#0c0c22] border cursor-pointer overflow-hidden shadow-[0_16px_32px_rgba(0,0,0,0.38)] flex flex-col justify-between p-4 select-none ${
                isFocused 
                  ? 'border-white/20'
                  : 'border-white/8'
              }`}
            >
              {hasCustomCardImage ? (
                <img
                  src={room.cardImageSrc}
                  alt={room.title}
                  className="absolute inset-0 h-full w-full object-fill pointer-events-none"
                  draggable={false}
                />
              ) : (
                <>
              {/* Card Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-b ${room.gradientClass} mix-blend-screen opacity-45 pointer-events-none`} />

              {/* Decorative Mesh Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center mt-2 pointer-events-none">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-[0.25em] text-gray-400">
                  <span className="w-1.5 h-0.5 bg-gray-500"></span>
                  {room.type}
                  <span className="w-1.5 h-0.5 bg-gray-500"></span>
                </div>
                
                {/* Title */}
                <h2 className={`font-display font-extrabold text-xl tracking-wider mt-1 flex items-center justify-center gap-1 ${
                  isFocused ? 'text-white' : 'text-gray-300'
                }`}>
                  {room.title}
                  {room.id === 'tiktok-hits' && (
                    <Flame className="w-4 h-4 text-rose-500 fill-rose-500 ml-0.5" />
                  )}
                </h2>

                {/* Subtitle */}
                <p className="text-gray-400 text-xs font-semibold mt-1 flex items-center gap-1.5">
                  {room.subtitle}
                  <span className="text-gray-500 font-normal">|</span>
                  <span className="text-purple-300">{room.description}</span>
                </p>
              </div>

              {/* Center Main Graphic */}
              <div className="relative w-full h-32 flex items-center justify-center my-2 pointer-events-none">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-[#030310]/50 border border-white/5 flex items-center justify-center">
                  <img 
                    src={room.imageSrc} 
                    alt={room.title}
                    className="w-full h-full object-cover opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  {/* Visual overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c22] via-transparent to-transparent opacity-80" />
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="relative z-10 flex items-center justify-between mt-auto pointer-events-none">
                {/* Active Stacked Players */}
                <div className="flex items-center">
                  <div className="flex -space-x-2.5">
                    {room.players.map((player, pIdx) => (
                      <div 
                        key={pIdx} 
                        className="w-7 h-7 rounded-full border border-[#0c0c22] overflow-hidden shadow-md"
                        style={{ zIndex: 10 - pIdx }}
                      >
                        <img 
                          src={player.avatarUrl} 
                          alt={player.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Decorative join bubble on inactive */}
                  {!isFocused && (
                    <span className="text-[10px] text-gray-500 font-semibold ml-1">+</span>
                  )}
                </div>

                {/* Player Counts */}
                <div className="flex flex-col items-end">
                  <span className={`font-mono font-extrabold ${isFocused ? 'text-white text-sm' : 'text-gray-400 text-xs'}`}>
                    {room.onlineCount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-[10px] text-gray-400 font-semibold font-sans">players online</span>
                  </div>
                </div>
              </div>
                </>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination Page Dots Indicator */}
      <div id="carousel-dots-indicator" className="flex items-center gap-2.5 mt-0">
        {rooms.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              onClick={() => moveToIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'w-6 bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'w-2.5 bg-gray-700 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
