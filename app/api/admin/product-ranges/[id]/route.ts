import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../../_auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const range = await prisma.productCategory.update({
    where: { id: params.id },
    data: {
      slug: body.slug,
      imageUrl: body.imageUrl || null,
      displayOrder: Number(body.displayOrder || 0),
      isActive: body.isActive !== false,
      translations: { upsert: { where: { categoryId_locale: { categoryId: params.id, locale: 'EN' } }, create: { locale: 'EN', name: body.name, description: body.description || null }, update: { name: body.name, description: body.description || null } } },
    },
    include: { translations: true },
  });
  return NextResponse.json(range);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await prisma.productCategory.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
