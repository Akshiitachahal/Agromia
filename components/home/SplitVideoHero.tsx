'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

type Panel = 'left' | 'right';

const posterSources = {
  left: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=88',
  right: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=88',
};

export default function SplitVideoHero() {
  const { t, locale } = useI18n();
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const [activePanel, setActivePanel] = useState<Panel | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isDevanagari = locale !== 'en';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    const videos = [leftVideoRef.current, rightVideoRef.current].filter(Boolean) as HTMLVideoElement[];
    videos.forEach((video) => {
      video.playbackRate = 0.65;
      if (isMobile) video.play().catch(() => {});
      else video.pause();
    });
  }, [isMobile]);

  const setPanelPlayback = (panel: Panel | null) => {
    setActivePanel(panel);
    if (isMobile) return;

    const leftVideo = leftVideoRef.current;
    const rightVideo = rightVideoRef.current;
    const activeVideo = panel === 'left' ? leftVideo : panel === 'right' ? rightVideo : null;
    const inactiveVideo = panel === 'left' ? rightVideo : leftVideo;

    inactiveVideo?.pause();
    if (activeVideo) {
      activeVideo.playbackRate = 0.65;
      activeVideo.play().catch(() => {});
    }
  };

  return (
    <section className="split-video-hero" aria-label="AGROMIA crop protection introduction">
      <div
        className={cn('split-video-panels', activePanel && `is-${activePanel}`)}
        onMouseLeave={() => setPanelPlayback(null)}
      >
        <div
          className={cn('split-video-panel split-video-panel-left', activePanel === 'left' && 'is-active')}
          onMouseEnter={() => setPanelPlayback('left')}
          onMouseLeave={() => setPanelPlayback(null)}
          onClick={() => setPanelPlayback('left')}
          onFocus={() => setPanelPlayback('left')}
          onBlur={() => setPanelPlayback(null)}
          tabIndex={0}
          aria-label="Explore the origin of AGROMIA"
        >
          <video
            ref={leftVideoRef}
            className="split-video-media"
            muted
            playsInline
            loop
            preload="metadata"
            poster={posterSources.left}
            aria-hidden="true"
          >
            <source src="/hero-left.mp4" type="video/mp4" />
          </video>
          <span className="split-video-cue" aria-hidden="true">DISCOVER <span>→</span></span>
        </div>

        <div
          className={cn('split-video-panel split-video-panel-right', activePanel === 'right' && 'is-active')}
          onMouseEnter={() => setPanelPlayback('right')}
          onMouseLeave={() => setPanelPlayback(null)}
          onClick={() => setPanelPlayback('right')}
          onFocus={() => setPanelPlayback('right')}
          onBlur={() => setPanelPlayback(null)}
          tabIndex={0}
          aria-label="Explore the growth behind AGROMIA"
        >
          <video
            ref={rightVideoRef}
            className="split-video-media"
            muted
            playsInline
            loop
            preload="metadata"
            poster={posterSources.right}
            aria-hidden="true"
          >
            <source src="/hero-right.mp4" type="video/mp4" />
          </video>
          <span className="split-video-cue" aria-hidden="true">DISCOVER <span>→</span></span>
        </div>
      </div>

      <div className="split-video-overlay" aria-hidden="true" />

      <div className="split-video-brand">
        <span className="split-video-kicker">Crop protection, considered</span>
        <h1 className={cn('split-video-title', isDevanagari && 'font-devanagari')}>
          {t('hero.tagline')}
        </h1>
        <Link href="/products" className="split-video-action">EXPLORE PRODUCTS <span>→</span></Link>
      </div>
    </section>
  );
}
