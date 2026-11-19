import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role || '')) redirect('/admin/login');
  return <AdminDashboard />;
}
