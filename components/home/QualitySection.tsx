'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

const STEPS = [
  { num: '01', title: 'PRODUCT SELECTION', desc: 'A considered portfolio for crop-focused decisions.' },
  { num: '02', title: 'PRODUCT INFORMATION', desc: 'Clear details to support farmers and agricultural partners.' },
  { num: '03', title: 'FIELD RELEVANCE', desc: 'Solutions presented around real crop needs.' },
  { num: '04', title: 'PARTNER SUPPORT', desc: 'Reliable information for dealers and distributors.' },
  { num: '05', title: 'READY FOR THE FIELD', desc: 'Crop-care products represented with clarity and care.' },
];

export default function QualitySection() {
  const { t, locale } = useI18n();
  const [active, setActive] = useState(0);
  const isDevanagari = locale !== 'en';

  return (
    <section id="quality" className="editorial-section quality-editorial">
      <div className="container-brand">
        <div className="quality-header">
          <span className="section-label">{t('quality.label')}</span>
          <h2 className={cn('editorial-headline', isDevanagari && 'font-devanagari')}>
            {t('quality.heading')}
          </h2>
          <p className="editorial-body quality-description">{t('quality.description')}</p>
        </div>

        <div className="quality-stage">
          <div className="quality-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=1800&q=88')" }}>
            <span className="quality-image-label">AGROMIA / FIELD NOTES</span>
          </div>
          <div className="quality-steps">
            {STEPS.map((s, idx) => (
              <button
                key={s.num}
                onClick={() => setActive(idx)}
                className={cn(
                  'quality-step',
                  active === idx && 'is-active'
                )}
              >
                <span className="quality-step-number">{s.num}</span>
                <span>
                  <strong>{s.title}</strong>
                  <small>{s.desc}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
