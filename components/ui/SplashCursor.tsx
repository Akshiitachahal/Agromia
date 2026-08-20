'use client';

import { useEffect, useRef } from 'react';

export default function SplashCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) return;

    let animationFrame = 0;
    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;

    const animate = () => {
      ringX += (targetX - ringX) * 0.14;
      ringY += (targetY - ringY) * 0.14;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      const interactive = (event.target as HTMLElement).closest('a, button, [role="button"]');
      ringRef.current?.classList.toggle('is-hovering', Boolean(interactive));
    };

    const handleDown = () => ringRef.current?.classList.add('is-pressed');
    const handleUp = () => ringRef.current?.classList.remove('is-pressed');

    animationFrame = window.requestAnimationFrame(animate);
    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
    </>
  );
}
