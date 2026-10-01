'use client';

import { Header } from '@/components/layout/header';

export default function CreatorDashboard() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-white">Espace createur</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="/creator/upload"
            className="rounded-lg bg-slate-800 p-6 hover:border hover:border-primary"
          >
            <p className="text-lg font-bold text-white">Publier une photo</p>
            <p className="mt-1 text-sm text-slate-400">
              Ajoute une nouvelle photo a la marketplace
            </p>
          </a>

          <a
            href="/creator/wallet"
            className="rounded-lg bg-slate-800 p-6 hover:border hover:border-primary"
          >
            <p className="text-lg font-bold text-white">Mon portefeuille</p>
            <p className="mt-1 text-sm text-slate-400">
              Consulte tes revenus et demande un retrait
            </p>
          </a>

          <a
            href="/library"
            className="rounded-lg bg-slate-800 p-6 hover:border hover:border-primary"
          >
            <p className="text-lg font-bold text-white">Ma bibliotheque</p>
            <p className="mt-1 text-sm text-slate-400">
              Retrouve les photos que tu as achetees
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
