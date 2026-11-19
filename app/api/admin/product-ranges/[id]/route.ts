import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../../_auth';
import { productRangePatchSchema } from '@/lib/validations';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = productRangePatchSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const body = parsed.data;
  const range = await prisma.productCategory.update({
    where: { id: params.id },
    data: {
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl || null } : {}),
      ...(body.displayOrder !== undefined ? { displayOrder: body.displayOrder } : {}),
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
    },
    include: { translations: true },
  });
  if (body.translations) {
    for (const [key, translation] of Object.entries(body.translations)) {
      if (!translation) continue;
      const locale = key.toUpperCase() as 'EN' | 'HI' | 'HAR';
      await prisma.categoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: params.id, locale } },
        create: { categoryId: params.id, locale, name: translation.name || '', description: translation.description || null },
        update: { ...(translation.name !== undefined ? { name: translation.name } : {}), ...(translation.description !== undefined ? { description: translation.description || null } : {}) },
      });
    }
  }
  return NextResponse.json(range);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await prisma.productCategory.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
