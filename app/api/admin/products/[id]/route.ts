import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../../_auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      slug: body.slug,
      categoryId: body.categoryId,
      primaryImageUrl: body.primaryImageUrl || null,
      isPublished: body.isPublished === true,
      isFeatured: body.isFeatured === true,
      displayOrder: Number(body.displayOrder || 0),
      translations: { upsert: { where: { productId_locale: { productId: params.id, locale: 'EN' } }, create: { locale: 'EN', name: body.name, shortDescription: body.shortDescription || null }, update: { name: body.name, shortDescription: body.shortDescription || null, composition: body.composition || null, formulation: body.formulation || null, benefits: body.benefits || null, targetCrops: body.targetCrops || null, targetPests: body.targetPests || null, dosage: body.dosage || null, applicationMethod: body.applicationMethod || null, packaging: body.packaging || null, technicalInfo: body.technicalInfo || null, recommendation: body.recommendation || null } } },
    },
    include: { translations: true },
  });
  return NextResponse.json(product);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  await prisma.product.update({ where: { id: params.id }, data: { isPublished: false, isFeatured: false } });
  return NextResponse.json({ ok: true });
}
