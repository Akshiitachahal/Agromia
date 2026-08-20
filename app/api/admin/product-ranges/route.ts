import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../_auth';

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
  const body = await request.json();
  const range = await prisma.productCategory.create({
    data: {
      slug: body.slug,
      imageUrl: body.imageUrl || null,
      displayOrder: Number(body.displayOrder || 0),
      isActive: body.isActive !== false,
      translations: { create: { locale: 'EN', name: body.name, description: body.description || null } },
    },
    include: { translations: true },
  });
  return NextResponse.json(range, { status: 201 });
}
