import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { requireAdmin } from '../_auth';

export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const email = (session as { user?: { email?: string } } | null)?.user?.email;
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });
  return NextResponse.json({ ok: true });
}
