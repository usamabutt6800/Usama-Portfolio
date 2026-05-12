// src/components/common/CustomCursor.tsx
// Smooth custom cursor with magnetic hover effect

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorDotRef   = useRef<HTMLDivElement>(null);
  const cursorRingRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = cursorDotRef.current!;
    const ring = cursorRingRef.current!;

    // Hide default cursor
    document.body.style.cursor = 'none';

    let mouseX = 0, mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows instantly
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0, ease: 'none' });
      // Ring follows with lag
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.15, ease: 'power2.out' });
    };

    // Scale up on hoverable elements
    const onMouseEnterLink = () => {
      gsap.to(ring, { scale: 2, opacity: 0.5, duration: 0.3 });
      gsap.to(dot,  { scale: 0, duration: 0.3 });
    };

    const onMouseLeaveLink = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(dot,  { scale: 1, duration: 0.3 });
    };

    // Click effect
    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.1 });
    };
    const onMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.1 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Apply to all interactive elements
    const interactables = document.querySelectorAll('a, button, [data-cursor]');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterLink);
      el.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      {/* Small dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-cyan rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />
      {/* Larger ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 border border-cyan/60 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};

export default CustomCursor;
