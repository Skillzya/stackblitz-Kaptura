'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import { Button } from '@/components/elements/button';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await signUp(email, password);

    if (error) {
      setMessage('Erreur : ' + error.message);
    } else {
      setMessage('Compte créé ! Vérifie ta boîte mail pour confirmer.');
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-slate-800 p-8"
      >
        <h1 className="text-2xl font-bold text-white">Créer un compte</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white"
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Création...' : "S'inscrire"}
        </Button>

        {message && <p className="text-sm text-slate-300">{message}</p>}
      </form>
    </main>
  );
}
