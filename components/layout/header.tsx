'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/elements/button';
import type { User } from '@supabase/supabase-js';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await signOut();
    router.push('/login');
  }

  if (loading) return null;

  return (
    <header className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-6 py-4">
      <span className="font-bold text-white">Marketplace Photos</span>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300">{user.email}</span>
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          <a href="/login">
            <Button variant="secondary">Connexion</Button>
          </a>
          <a href="/signup">
            <Button>Inscription</Button>
          </a>
        </div>
      )}
    </header>
  );
}
