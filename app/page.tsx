import { Button } from '@/components/elements/button';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900">
        <h1 className="text-4xl font-bold text-white">
          Tailwind fonctionne 🎉
        </h1>
        <div className="flex gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <p className="text-sm text-slate-400">
          Supabase connecté : {supabase ? '✅ oui' : '❌ non'}
        </p>
      </main>
    </>
  );
}
