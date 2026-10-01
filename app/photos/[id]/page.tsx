import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/header';
import { notFound } from 'next/navigation';

export default async function PhotoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: photo } = await supabase
    .from('photos')
    .select('*, profiles(email), categories(name)')
    .eq('id', params.id)
    .eq('status', 'approved')
    .single();

  if (!photo) {
    notFound();
  }
  const { data: licenses } = await supabase
    .from('licenses')
    .select('*')
    .order('price_multiplier');

  const { data: urlData } = supabase.storage
    .from('photos-preview')
    .getPublicUrl(photo.preview_path);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 px-6 py-8">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <img
            src={urlData.publicUrl}
            alt={photo.title}
            className="w-full rounded-lg object-cover"
          />

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-white">{photo.title}</h1>
            <p className="text-slate-400">{photo.description}</p>

            <div className="flex flex-col gap-1 text-sm text-slate-500">
              <span>Categorie : {photo.categories?.name || 'Non classee'}</span>
              <span>Par : {photo.profiles?.email}</span>
            </div>

            <div className="mt-4 rounded-lg bg-slate-800 p-4">
              <p className="mb-3 text-lg font-bold text-white">
                A partir de {photo.price} FCFA
              </p>

              <div className="flex flex-col gap-2">
                {licenses?.map((license) => (
                  <div
                    key={license.id}
                    className="flex items-center justify-between rounded-md border border-slate-600 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {license.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {license.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-300">
                        {Math.round(photo.price * license.price_multiplier)}{' '}
                        FCFA
                      </span>
                      <a
                        href={`/checkout/${photo.id}?license=${license.id}`}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                      >
                        Choisir
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
