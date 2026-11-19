import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../_auth';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const directors = await prisma.director.findMany({
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    include: { translations: true },
  });
  return NextResponse.json(directors);
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const name = String(body.name || '').trim();
  const designation = String(body.designation || '').trim();
  if (!name || !designation) {
    return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 });
  }
  const director = await prisma.director.create({
    data: {
      imageUrl: body.imageUrl || null,
      displayOrder: Number(body.displayOrder || 0),
      isActive: body.isActive !== false,
      translations: { create: [{ locale: 'EN', name, designation, bio: body.bio || null }] },
    },
    include: { translations: true },
  });
  return NextResponse.json(director, { status: 201 });
}
