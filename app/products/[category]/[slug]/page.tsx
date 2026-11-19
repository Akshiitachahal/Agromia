import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ProductDetailPage({ params }: { params: { category: string; slug: string } }) {
  let product = null;
  try {
    product = await prisma.product.findFirst({
      where: { slug: params.slug, isPublished: true, category: { slug: params.category, isActive: true } },
      include: { category: { include: { translations: { where: { locale: 'EN' } } } }, translations: { where: { locale: 'EN' } }, images: { orderBy: { displayOrder: 'asc' } }, brochures: { where: { locale: 'EN' } } },
    });
  } catch (error) {
    console.error('Unable to load product details.', error);
  }
  if (!product) notFound();

  const translation = product.translations[0];
  const fields = [
    ['Composition', translation?.composition], ['Formulation', translation?.formulation], ['Key benefits', translation?.benefits], ['Target crops', translation?.targetCrops], ['Target pest / disease', translation?.targetPests], ['Dosage', translation?.dosage], ['Method of application', translation?.applicationMethod], ['Packaging', translation?.packaging], ['Technical information', translation?.technicalInfo], ['Recommendation', translation?.recommendation],
  ].filter(([, value]) => value);

  return (
    <main className="editorial-section">
      <div className="container-brand">
        <Link href={`/products/${product.category.slug}`} className="editorial-link">← {product.category.translations[0]?.name || product.category.slug}</Link>
        <div className="grid gap-12 lg:grid-cols-2 mt-12 items-start">
          <div>
            <div className="product-object-visual" style={product.primaryImageUrl || product.images[0]?.url ? { backgroundImage: `url('${product.primaryImageUrl || product.images[0]?.url}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' } : undefined}><span className="product-object-mark">AG</span></div>
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((image) => (
                  <div key={image.id} role="img" aria-label={image.altText || translation?.name || 'Product picture'} className="aspect-square border border-charcoal/15 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url('${image.url}')` }} />
                ))}
              </div>
            )}
          </div>
          <article>
            <span className="product-object-category">{product.category.translations[0]?.name || product.category.slug}</span>
            <h1 className="editorial-headline mt-3">{translation?.name || product.slug}</h1>
            {translation?.shortDescription && <p className="editorial-body mt-6">{translation.shortDescription}</p>}
            <div className="mt-12 border-t border-charcoal/15">{fields.map(([label, value]) => <section key={label} className="py-5 border-b border-charcoal/15"><h2 className="text-sm font-semibold uppercase tracking-widest text-forest">{label}</h2><p className="editorial-body mt-2 whitespace-pre-line">{value}</p></section>)}</div>
            {product.brochures[0] && <a href={product.brochures[0].url} target="_blank" rel="noreferrer" className="editorial-link mt-8">Download brochure <span>→</span></a>}
          </article>
        </div>
      </div>
    </main>
  );
}
