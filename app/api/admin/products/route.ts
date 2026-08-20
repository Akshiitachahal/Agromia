import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../_auth';

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
  const body = await request.json();
  const product = await prisma.product.create({
    data: {
      slug: body.slug,
      categoryId: body.categoryId,
      primaryImageUrl: body.primaryImageUrl || null,
      isPublished: body.isPublished === true,
      isFeatured: body.isFeatured === true,
      displayOrder: Number(body.displayOrder || 0),
      translations: { create: { locale: 'EN', name: body.name, shortDescription: body.shortDescription || null, composition: body.composition || null, formulation: body.formulation || null, benefits: body.benefits || null, targetCrops: body.targetCrops || null, targetPests: body.targetPests || null, dosage: body.dosage || null, applicationMethod: body.applicationMethod || null, packaging: body.packaging || null, technicalInfo: body.technicalInfo || null, recommendation: body.recommendation || null } },
    },
    include: { translations: true },
  });
  return NextResponse.json(product, { status: 201 });
}
