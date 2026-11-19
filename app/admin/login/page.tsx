'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    });
    if (result?.error) {
      setError('Invalid email or password, or the database is unavailable.');
      setLoading(false);
      return;
    }
    window.location.href = '/admin';
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 space-y-6">
        <div>
          <p className="text-label text-forest">AGROMIA / ADMIN</p>
          <h1 className="text-display-md text-charcoal mt-3">Sign in</h1>
        </div>
        <label className="block text-sm text-charcoal">Email<input name="email" type="email" required className="form-input-editorial" /></label>
        <label className="block text-sm text-charcoal">Password<input name="password" type="password" required className="form-input-editorial" /></label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">{loading ? 'Signing in...' : 'Sign in'}</button>
        <Link href="/admin/forgot-password" className="block text-center text-sm text-forest underline">Forgot password?</Link>
      </form>
    </main>
  );
}
