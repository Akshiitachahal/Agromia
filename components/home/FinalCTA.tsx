'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

export default function FinalCTA() {
  const { t, locale } = useI18n();
  const isDevanagari = locale !== 'en';

  return (
    <section className="final-cta-editorial">
      <div className="final-cta-image" aria-hidden="true" />
      <div className="final-cta-overlay" aria-hidden="true" />
      <div className="container-brand final-cta-content">
        <span className="section-label final-cta-label">AGROMIA</span>
        <h2 className={cn('editorial-headline editorial-headline-dark max-w-3xl', isDevanagari && 'font-devanagari')}>
          {t('cta_section.heading')}
        </h2>
        <div className="final-cta-links">
          <Link href="/products" className="editorial-link final-cta-link">
            {t('cta_section.cta_primary')}
            <span>→</span>
          </Link>
          <Link href="/enquire" className="editorial-link final-cta-link">
            {t('cta_section.cta_secondary')}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
