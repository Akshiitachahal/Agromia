import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../../_auth';
import { productPatchSchema } from '@/lib/validations';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = productPatchSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const body = parsed.data;
  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.categoryId !== undefined ? { categoryId: body.categoryId } : {}),
      ...(body.primaryImageUrl !== undefined ? { primaryImageUrl: body.primaryImageUrl || null } : {}),
      ...(body.isPublished !== undefined ? { isPublished: body.isPublished } : {}),
      ...(body.isFeatured !== undefined ? { isFeatured: body.isFeatured } : {}),
      ...(body.displayOrder !== undefined ? { displayOrder: body.displayOrder } : {}),
    },
    include: { translations: true },
  });
  if (body.translations) {
    for (const [key, translation] of Object.entries(body.translations)) {
      if (!translation) continue;
      const locale = key.toUpperCase() as 'EN' | 'HI' | 'HAR';
      await prisma.productTranslation.upsert({
        where: { productId_locale: { productId: params.id, locale } },
        create: { productId: params.id, locale, name: translation.name || '', ...translation },
        update: { ...translation },
      });
    }
  }
  return NextResponse.json(product);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await prisma.product.update({ where: { id: params.id }, data: { isPublished: false, isFeatured: false } });
  return NextResponse.json({ ok: true });
}
