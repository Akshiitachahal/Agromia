import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../_auth';
import { productRangeSchema } from '@/lib/validations';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const ranges = await prisma.productCategory.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    include: { translations: true, _count: { select: { products: true } } },
  });
  return NextResponse.json(ranges);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = productRangeSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const body = parsed.data;
  const range = await prisma.productCategory.create({
    data: {
      slug: body.slug,
      imageUrl: body.imageUrl || null,
      displayOrder: Number(body.displayOrder || 0),
      isActive: body.isActive !== false,
      translations: {
        create: [
          { locale: 'EN', name: body.translations.en.name, description: body.translations.en.description || null },
          ...(body.translations.hi.name ? [{ locale: 'HI' as const, name: body.translations.hi.name, description: body.translations.hi.description || null }] : []),
          ...(body.translations.har.name ? [{ locale: 'HAR' as const, name: body.translations.har.name, description: body.translations.har.description || null }] : []),
        ],
      },
    },
    include: { translations: true },
  });
  return NextResponse.json(range, { status: 201 });
}
