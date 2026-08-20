'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirect: false,
    });
    if (result?.error) setError('Invalid email or password.');
    else window.location.href = '/admin';
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
        <button type="submit" className="btn btn-primary w-full justify-center">Sign in</button>
      </form>
    </main>
  );
}
