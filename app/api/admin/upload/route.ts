import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../_auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const formData = await request.formData();
  const file = formData.get('file');
  const folder = String(formData.get('folder') || 'products');
  if (!(file instanceof File)) return NextResponse.json({ error: 'File is required' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const resourceType = file.type === 'application/pdf' ? 'raw' : 'image';
  const upload = await uploadToCloudinary(buffer, { folder, resource_type: resourceType });
  return NextResponse.json(upload);
}
