'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

const DEFAULT_WHY = [
  { id: '1', title: 'Quality', desc: 'Care in every considered detail.' },
  { id: '2', title: 'Innovation', desc: 'Progress shaped for the field.' },
  { id: '3', title: 'Farmer Focus', desc: 'Solutions that begin with real work.' },
  { id: '4', title: 'Reliability', desc: 'Consistency when the season asks more.' },
];

export default function WhyAgromia() {
  const { t, locale } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const isDevanagari = locale !== 'en';

  return (
    <section id="why" ref={sectionRef} className="editorial-section why-editorial">
      <div className="container-brand">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="mb-16">
          <span className="section-label text-earth-light">{t('why.label')}</span>
          <h2 className={cn('editorial-headline editorial-headline-dark max-w-3xl', isDevanagari && 'font-devanagari')}>
            {t('why.heading')}
          </h2>
        </motion.div>

        <div className="principles-list">
          {DEFAULT_WHY.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 18 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.08 }} className="principle-row">
              <span className="principle-number">0{i + 1}</span>
              <h3 className="principle-title">{item.title}</h3>
              <p className="principle-description">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
