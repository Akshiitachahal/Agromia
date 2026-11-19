import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../../../_auth';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const mappings = await prisma.cropProductMapping.findMany({ where: { productId: params.id }, include: { crop: { include: { translations: true } }, problem: { include: { translations: true } } } });
  return NextResponse.json(mappings);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  if (!body.cropId) return NextResponse.json({ error: 'cropId is required' }, { status: 400 });
  const mapping = await prisma.cropProductMapping.upsert({ where: { cropId_problemId_productId: { cropId: body.cropId, problemId: body.problemId || null, productId: params.id } }, create: { cropId: body.cropId, problemId: body.problemId || null, productId: params.id }, update: {} });
  return NextResponse.json(mapping, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  await prisma.cropProductMapping.delete({ where: { cropId_problemId_productId: { cropId: body.cropId, problemId: body.problemId || null, productId: params.id } } });
  return NextResponse.json({ ok: true });
}
