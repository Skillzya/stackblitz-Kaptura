import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/header';

export default async function ExplorePage() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-white">Explorer</h1>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories?.map((cat) => (
            <span
              key={cat.id}
              className="cursor-pointer rounded-full border border-slate-600 px-4 py-1.5 text-sm text-slate-300 hover:border-primary hover:text-primary"
            >
              {cat.name}
            </span>
          ))}
        </div>

        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => {
              const { data: urlData } = supabase.storage
                .from('photos-preview')
                .getPublicUrl(photo.preview_path);

              return (
                <a
                  key={photo.id}
                  href={`/photos/${photo.id}`}
                  className="overflow-hidden rounded-lg bg-slate-800"
                >
                  <img
                    src={urlData.publicUrl}
                    alt={photo.title}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-2">
                    <p className="truncate text-sm text-white">{photo.title}</p>
                    <p className="text-xs text-slate-400">{photo.price} FCFA</p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 py-20 text-center">
            <p className="text-lg text-slate-400">
              Aucune photo disponible pour le moment
            </p>
            <p className="text-sm text-slate-500">
              Les premières photos apparaîtront ici une fois publiées par les
              créateurs
            </p>
          </div>
        )}
      </main>
    </>
  );
}