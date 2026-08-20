'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import ProductCard, { type ProductCardData } from '@/components/products/ProductCard';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

export default function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  const { t, locale } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const isDevanagari = locale !== 'en';

  if (products.length === 0) return null;

  return (
    <section ref={sectionRef} className="editorial-section featured-editorial">
      <div className="container-brand">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="editorial-section-header">
          <div>
            <span className="section-label">{t('featured_products.label')}</span>
            <h2 className={cn('editorial-headline', isDevanagari && 'font-devanagari')}>
              {t('featured_products.heading')}
            </h2>
          </div>
          <Link href="/products" className="editorial-link">{t('featured_products.cta')} <span>→</span></Link>
        </motion.div>

        <div className="featured-products-stage">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
