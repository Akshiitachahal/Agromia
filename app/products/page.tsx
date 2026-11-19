import Link from 'next/link';
import ProductCard, { type ProductCardData } from '@/components/products/ProductCard';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type ProductCategory = Prisma.ProductCategoryGetPayload<{
  include: { translations: { where: { locale: 'EN' } } };
}>;

type Product = Prisma.ProductGetPayload<{
  include: {
    category: { include: { translations: { where: { locale: 'EN' } } } };
    translations: { where: { locale: 'EN' } };
    images: { orderBy: { displayOrder: 'asc' }, take: 1 };
  };
}>;

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const selectedCategory = searchParams.category;
  let categories: ProductCategory[] = [];
  let products: Product[] = [];

  try {
    [categories, products] = await Promise.all([
      prisma.productCategory.findMany({ where: { isActive: true }, orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }], include: { translations: { where: { locale: 'EN' } } } }),
      prisma.product.findMany({
        where: { isPublished: true, category: { isActive: true, slug: selectedCategory } },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        include: { category: { include: { translations: { where: { locale: 'EN' } } } }, translations: { where: { locale: 'EN' } }, images: { orderBy: { displayOrder: 'asc' }, take: 1 } },
      }),
    ]);
  } catch (error) {
    console.error('Unable to load products from the database.', error);
  }

  const productCards: ProductCardData[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    categorySlug: product.category.slug,
    categoryName: product.category.translations[0]?.name || product.category.slug,
    name: product.translations[0]?.name || product.slug,
    shortDescription: product.translations[0]?.shortDescription || undefined,
    primaryImageUrl: product.primaryImageUrl || product.images[0]?.url,
  }));

  return (
    <main className="editorial-section">
      <div className="container-brand">
        <span className="section-label">AGROMIA / PRODUCTS</span>
        <h1 className="editorial-headline">Our products</h1>
        <nav className="flex flex-wrap gap-5 mt-10 border-b border-charcoal/15 pb-5" aria-label="Product ranges">
          <Link href="/products" className="editorial-link">All products</Link>
          {categories.map((category) => <Link key={category.id} href={`/products?category=${category.slug}`} className="editorial-link">{category.translations[0]?.name || category.slug}</Link>)}
        </nav>
        {productCards.length ? <div className="featured-products-stage mt-16">{productCards.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="editorial-body mt-16">No published products are available in this range yet.</p>}
      </div>
    </main>
  );
}
