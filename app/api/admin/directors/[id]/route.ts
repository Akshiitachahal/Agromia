import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../../_auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const director = await prisma.director.update({
    where: { id: params.id },
    data: {
      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl || null } : {}),
      ...(body.displayOrder !== undefined ? { displayOrder: Number(body.displayOrder) } : {}),
      ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
    },
  });
  if (body.name || body.designation || body.bio !== undefined) {
    await prisma.directorTranslation.upsert({
      where: { directorId_locale: { directorId: params.id, locale: 'EN' } },
      create: { directorId: params.id, locale: 'EN', name: String(body.name || 'AGROMIA'), designation: String(body.designation || 'Leadership'), bio: body.bio || null },
      update: {
        ...(body.name !== undefined ? { name: String(body.name) } : {}),
        ...(body.designation !== undefined ? { designation: String(body.designation) } : {}),
        ...(body.bio !== undefined ? { bio: body.bio || null } : {}),
      },
    });
  }
  return NextResponse.json(director);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await prisma.director.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
