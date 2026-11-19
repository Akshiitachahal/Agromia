import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const cloudinaryConfigured =
    Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
    Boolean(process.env.CLOUDINARY_API_KEY) &&
    Boolean(process.env.CLOUDINARY_API_SECRET) &&
    !process.env.CLOUDINARY_CLOUD_NAME?.includes('placeholder') &&
    !process.env.CLOUDINARY_API_KEY?.includes('placeholder') &&
    !process.env.CLOUDINARY_API_SECRET?.includes('placeholder');
  if (!cloudinaryConfigured) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured. Add the three Cloudinary environment values and restart the app.' },
      { status: 503 }
    );
  }
  const formData = await request.formData();
  const file = formData.get('file');
  const folder = String(formData.get('folder') || 'products');
  const entityType = String(formData.get('entityType') || '');
  const entityId = String(formData.get('entityId') || '');
  if (!(file instanceof File)) return NextResponse.json({ error: 'File is required' }, { status: 400 });
  if (file.size > 15 * 1024 * 1024) return NextResponse.json({ error: 'File must be 15MB or smaller' }, { status: 400 });
  if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) return NextResponse.json({ error: 'Only images and PDF brochures are supported' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const resourceType = file.type === 'application/pdf' ? 'raw' : 'image';
  const upload = await uploadToCloudinary(buffer, { folder, resource_type: resourceType });

  if (entityType === 'category' && entityId) {
    await prisma.productCategory.update({ where: { id: entityId }, data: { imageUrl: upload.secure_url } });
  } else if (entityType === 'director' && entityId && resourceType === 'image') {
    await prisma.director.update({ where: { id: entityId }, data: { imageUrl: upload.secure_url } });
  } else if (entityType === 'product' && entityId && resourceType === 'image') {
    const imageCount = await prisma.productImage.count({ where: { productId: entityId } });
    await prisma.$transaction([
      prisma.product.update({ where: { id: entityId }, data: { ...(imageCount === 0 ? { primaryImageUrl: upload.secure_url } : {}) } }),
      prisma.productImage.create({ data: { productId: entityId, url: upload.secure_url, altText: file.name, displayOrder: imageCount } }),
    ]);
  } else if (entityType === 'brochure' && entityId && resourceType === 'raw') {
    await prisma.productBrochure.create({ data: { productId: entityId, url: upload.secure_url, label: file.name } });
  }

  return NextResponse.json(upload);
}
