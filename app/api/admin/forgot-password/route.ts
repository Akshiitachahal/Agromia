import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || '').trim().toLowerCase();
  const recoveryKey = String(body.recoveryKey || '');
  const newPassword = String(body.newPassword || '');

  if (recoveryKey !== process.env.ADMIN_RECOVERY_KEY) {
    return NextResponse.json({ error: 'Invalid recovery key' }, { status: 401 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });
  return NextResponse.json({ ok: true });
}
