'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

export default function AboutSection() {
  const { t, locale } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const isDevanagari = locale !== 'en';

  return (
    <section id="about" ref={sectionRef} className="editorial-section about-editorial" >
      <div className="container-brand">
        <div className="about-intro">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="about-label-column"
          >
            <span className="section-label">{t('about.label')}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="about-copy"
          >
            <h2 className={cn('editorial-headline editorial-headline-light', isDevanagari && 'font-devanagari')}>
              {t('about.statement')}
            </h2>
            <p className={cn('editorial-body about-body', isDevanagari && 'font-devanagari-sans')}>
              {t('about.body')}
            </p>
            <Link href="/#about" className="editorial-link">{t('about.heading')} <span>→</span></Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.25 }}
          className="about-visual"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2200&q=88')" }}
        >
          <span className="image-caption">01 / The field, first</span>
        </motion.div>
      </div>
    </section>
  );
}
