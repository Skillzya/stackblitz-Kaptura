'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/header';

export default function LibraryPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('purchases')
        .select('*, photos(*), licenses(name)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      setPurchases(data || []);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
          Chargement...
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-white">Ma bibliotheque</h1>

        {purchases.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {purchases.map((purchase) => {
              const photo = purchase.photos;
              const { data: urlData } = supabase.storage
                .from('photos-original')
                .getPublicUrl(photo.storage_path);

              return (
                <div
                  key={purchase.id}
                  className="overflow-hidden rounded-lg bg-slate-800"
                >
                  <img
                    src={urlData.publicUrl}
                    alt={photo.title}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-white">
                      {photo.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      Licence : {purchase.licenses?.name}
                    </p>
                    <a
                      href={urlData.publicUrl}
                      download
                      className="mt-2 block rounded-md bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground"
                    >
                      Telecharger
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 py-20 text-center">
            <p className="text-lg text-slate-400">
              Tu n'as pas encore achete de photo
            </p>
            <a href="/explore" className="text-sm text-primary">
              Explorer les photos disponibles
            </a>
          </div>
        )}
      </main>
    </>
  );
}
