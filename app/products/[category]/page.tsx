import Link from 'next/link';
import ProductCard, { type ProductCardData } from '@/components/products/ProductCard';
import { prisma } from '@/lib/prisma';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  let category = null;
  try {
    category = await prisma.productCategory.findFirst({
      where: { slug: params.category, isActive: true },
      include: {
        translations: { where: { locale: 'EN' } },
        products: { where: { isPublished: true }, orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }], include: { translations: { where: { locale: 'EN' } }, images: { orderBy: { displayOrder: 'asc' }, take: 1 } } },
      },
    });
  } catch (error) {
    console.error('Unable to load product category.', error);
  }

  if (!category) return <main className="editorial-section"><div className="container-brand"><h1 className="editorial-headline">Range not found</h1></div></main>;
  const name = category.translations[0]?.name || category.slug;
  const products: ProductCardData[] = category.products.map((product) => ({ id: product.id, slug: product.slug, categorySlug: category.slug, categoryName: name, name: product.translations[0]?.name || product.slug, shortDescription: product.translations[0]?.shortDescription || undefined, primaryImageUrl: product.primaryImageUrl || product.images[0]?.url }));

  return (
    <main className="editorial-section">
      <div className="container-brand">
        <Link href="/products" className="editorial-link">← All products</Link>
        <span className="section-label mt-10">{name}</span>
        <h1 className="editorial-headline">{name}</h1>
        {products.length ? <div className="featured-products-stage mt-16">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="editorial-body mt-16">No published products are available in this range yet.</p>}
      </div>
    </main>
  );
}
