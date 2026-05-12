// src/components/common/LoadingScreen.tsx
// Cinematic loading screen shown on first page load

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Props {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const percentRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Count up from 0 to 100
    let count = { val: 0 };
    tl.to(count, {
      val: 100,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.textContent = Math.round(count.val) + '%';
        }
        if (lineRef.current) {
          lineRef.current.style.width = count.val + '%';
        }
      },
    });

    // Slide up and out
    tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.4 }, '+=0.2');
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete,
    });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center"
    >
      {/* Logo / Name */}
      <div ref={textRef} className="text-center">
        <div className="font-display text-5xl font-bold text-white mb-2">
          Your<span className="text-cyan">Name</span>
        </div>
        <div className="font-mono text-sm text-white/40 tracking-[0.3em] uppercase mb-12">
          MERN Stack Developer
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div className="flex justify-between mb-2">
          <span className="font-mono text-xs text-white/30">Loading</span>
          <span ref={percentRef} className="font-mono text-xs text-cyan">0%</span>
        </div>
        <div className="h-px bg-white/10 w-full">
          <div ref={lineRef} className="h-px bg-cyan transition-none w-0" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
