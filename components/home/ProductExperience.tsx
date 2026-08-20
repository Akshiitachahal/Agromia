'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

type ProductRange = { slug: string; name: string; description: string };

export default function ProductExperience({ ranges }: { ranges: ProductRange[] }) {
  const { t, locale } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const isDevanagari = locale !== 'en';

  return (
    <section id="products-overview" ref={sectionRef} className="section section-bg-cream">
      <div className="container-brand">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <span className="section-label">{t('categories.label')}</span>
          <div>
          <h2 className={cn('editorial-headline max-w-2xl', isDevanagari && 'font-devanagari')}>
            {t('categories.heading')}
          </h2>
          </div>
        </motion.div>

        <div className="border-t border-charcoal/15">
          {ranges.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                href={`/products/${cat.slug}`}
                className="group relative block border-b border-charcoal/15 py-7 text-charcoal transition-colors hover:bg-white/70"
              >
                <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-5">
                  <span className="text-editorial-label text-forest">0{i + 1}</span>
                  <div>
                  <h3 className={cn('font-editorial-serif text-3xl', isDevanagari && 'font-devanagari')}>
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 max-w-xl">{cat.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
