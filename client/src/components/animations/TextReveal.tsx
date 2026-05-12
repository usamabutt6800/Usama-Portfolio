// src/components/animations/TextReveal.tsx
// GSAP split-text reveal animation on scroll

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: string;
  className?: string;
  delay?: number;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
}

const TextReveal = ({ children, className = '', delay = 0, as: Tag = 'p' }: Props) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = children.split(' ');
    el.innerHTML = words
      .map(word => `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full">${word}</span></span>`)
      .join(' ');

    const spans = el.querySelectorAll('span > span');

    gsap.to(spans, {
      y: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [children, delay]);

  // Use createElement to avoid TypeScript JSX tag issues
  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLParagraphElement>}
      className={className}
    />
  );
};

export default TextReveal;
