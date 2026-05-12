// src/components/common/ScrollProgress.tsx
// Thin top bar showing scroll progress

import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9990] h-0.5 bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-cyan to-purple-accent transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
