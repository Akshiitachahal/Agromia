'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

const DIRECTORS = [
  { id: '1', image: '1500648767791-00dcc994a43e' },
  { id: '2', image: '1507003211169-0a1dd7228f2d' },
];

export default function Leadership() {
  const { t, locale } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const isDevanagari = locale !== 'en';

  return (
    <section id="leadership" ref={sectionRef} className="editorial-section leadership-editorial">
      <div className="container-brand">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="leadership-header">
          <span className="section-label">{t('leadership.label')}</span>
          <h2 className={cn('editorial-headline', isDevanagari && 'font-devanagari')}>
            {t('leadership.heading')}
          </h2>
        </motion.div>

        <div className="leadership-portraits">
          {DIRECTORS.map((d) => (
            <motion.figure key={d.id} initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: Number(d.id) * 0.12 }} className="leadership-portrait">
              <div className="leadership-portrait-image" style={{ backgroundImage: `url('https://images.unsplash.com/photo-${d.image}?auto=format&fit=crop&w=1000&q=88')` }} />
              <figcaption><span>0{d.id} / Leadership</span><strong>AGROMIA</strong></figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
