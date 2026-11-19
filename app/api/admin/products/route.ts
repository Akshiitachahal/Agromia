import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../_auth';
import { productSchema } from '@/lib/validations';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const products = await prisma.product.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    include: { category: { include: { translations: true } }, translations: true, images: true, brochures: true },
  });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const body = parsed.data;
  const translations = body.translations;
  const translationRows = (['en', 'hi', 'har'] as const)
    .map((locale) => ({ locale, value: translations[locale] }))
    .filter((entry) => Boolean(entry.value.name))
    .map(({ locale, value }) => ({ locale: locale.toUpperCase() as 'EN' | 'HI' | 'HAR', name: value.name || translations.en.name, ...value }));
  const product = await prisma.product.create({
    data: {
      slug: body.slug,
      categoryId: body.categoryId,
      primaryImageUrl: body.primaryImageUrl || null,
      isPublished: body.isPublished === true,
      isFeatured: body.isFeatured === true,
      displayOrder: Number(body.displayOrder || 0),
      translations: { create: translationRows },
    },
    include: { translations: true },
  });
  return NextResponse.json(product, { status: 201 });
}
