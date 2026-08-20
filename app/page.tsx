import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ProductExperience from '@/components/home/ProductExperience';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyAgromia from '@/components/home/WhyAgromia';
import Leadership from '@/components/home/Leadership';
import QualitySection from '@/components/home/QualitySection';
import FinalCTA from '@/components/home/FinalCTA';
import { ProductCardData } from '@/components/products/ProductCard';

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type FeaturedProduct = Prisma.ProductGetPayload<{
  include: {
    category: { include: { translations: { where: { locale: 'EN' } } } };
    translations: { where: { locale: 'EN' } };
  };
}>;

type ProductRange = Prisma.ProductCategoryGetPayload<{
  include: { translations: { where: { locale: 'EN' } } };
}>;

export default async function HomePage() {
  let featuredProducts: FeaturedProduct[] = [];
  let ranges: ProductRange[] = [];

  try {
    featuredProducts = await prisma.product.findMany({
      where: { isPublished: true, isFeatured: true, category: { isActive: true } },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 4,
      include: {
        category: { include: { translations: { where: { locale: 'EN' } } } },
        translations: { where: { locale: 'EN' } },
      },
    });

    ranges = await prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
      include: { translations: { where: { locale: 'EN' } } },
    });
  } catch {
    // The editorial homepage can render its static sections while the database is unavailable.
  }

  const products: ProductCardData[] = featuredProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    categorySlug: product.category.slug,
    categoryName: product.category.translations[0]?.name || product.category.slug,
    name: product.translations[0]?.name || product.slug,
    shortDescription: product.translations[0]?.shortDescription || undefined,
    primaryImageUrl: product.primaryImageUrl || undefined,
  }));

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProductExperience ranges={ranges.map((range) => ({ slug: range.slug, name: range.translations[0]?.name || range.slug, description: range.translations[0]?.description || '' }))} />
      <FeaturedProducts products={products} />
      <WhyAgromia />
      <Leadership />
      <QualitySection />
      <FinalCTA />
    </>
  );
}
