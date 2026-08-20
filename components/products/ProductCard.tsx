'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

export interface ProductCardData {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  name: string;
  shortDescription?: string;
  primaryImageUrl?: string;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { t, locale } = useI18n();
  const isDevanagari = locale !== 'en';

  return (
    <motion.article initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="product-object group">
      <Link href={`/products/${product.categorySlug}/${product.slug}`} className="product-object-link">
        <div
          className={cn('product-object-visual', product.primaryImageUrl && 'has-product-image')}
          style={product.primaryImageUrl ? { backgroundImage: `url('${product.primaryImageUrl}')` } : undefined}
        >
          {!product.primaryImageUrl && <span className="product-object-mark">AG</span>}
          <span className="product-object-index">{product.id.replace('prod-', '0')}</span>
        </div>
        <div className="product-object-copy">
          <span className={cn('product-object-category', isDevanagari && 'font-devanagari-sans')}>{product.categoryName}</span>
          <h3 className={cn('product-object-name', isDevanagari && 'font-devanagari')}>{product.name}</h3>
          {product.shortDescription && <p className="product-object-description">{product.shortDescription}</p>}
          <span className="editorial-link product-object-link-label">{t('featured_products.view_details')} <span>→</span></span>
        </div>
      </Link>
    </motion.article>
  );
}
