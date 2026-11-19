'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/admin/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        recoveryKey: form.get('recoveryKey'),
        newPassword: form.get('newPassword'),
      }),
    });
    const body = await response.json();
    if (!response.ok) setError(body.error || 'Unable to reset password.');
    else setMessage('Password updated. You can now sign in.');
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 space-y-6">
        <div><p className="text-label text-forest">AGROMIA / ADMIN</p><h1 className="text-display-md text-charcoal mt-3">Reset password</h1></div>
        <label className="block text-sm">Admin email<input name="email" type="email" required className="form-input-editorial" /></label>
        <label className="block text-sm">Admin recovery key<input name="recoveryKey" type="password" required className="form-input-editorial" /></label>
        <label className="block text-sm">New password<input name="newPassword" type="password" minLength={8} required className="form-input-editorial" /></label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        {message && <p className="text-sm text-forest">{message}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">{loading ? 'Resetting...' : 'Reset password'}</button>
        <Link href="/admin/login" className="block text-center text-sm text-forest underline">Back to sign in</Link>
      </form>
    </main>
  );
}
