// src/lib/smoothScroll.ts
// Lenis smooth scrolling setup integrated with GSAP ScrollTrigger

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export const initSmoothScroll = (): Lenis => {
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease out expo
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Connect Lenis scroll position to GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
};

export const destroySmoothScroll = () => {
  lenisInstance?.destroy();
  lenisInstance = null;
};

export const getLenis = () => lenisInstance;

// Scroll to a specific element or position
export const scrollTo = (target: string | number, options?: object) => {
  lenisInstance?.scrollTo(target, { duration: 1.5, ...options });
};
