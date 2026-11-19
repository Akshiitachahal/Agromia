'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

export type LeadershipDirector = {
  id: string;
  name: string;
  designation: string;
  imageUrl?: string | null;
};

export default function Leadership({ directors = [] }: { directors?: LeadershipDirector[] }) {
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
          {directors.length ? directors.map((d, index) => (
            <motion.figure key={d.id} initial={{ opacity: 0, y: 28 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.12 }} className="leadership-portrait">
              <div className="leadership-portrait-image" style={d.imageUrl ? { backgroundImage: `url('${d.imageUrl}')` } : undefined} />
              <figcaption><span>{d.designation || 'Leadership'}</span><strong>{d.name}</strong></figcaption>
            </motion.figure>
          )) : (
            <p className="editorial-body">Leadership profiles will appear here.</p>
          )}
        </div>
      </div>
    </section>
  );
}
