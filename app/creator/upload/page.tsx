'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/elements/button';
import { Header } from '@/components/layout/header';

type Category = { id: string; name: string };

export default function UploadPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, name')
      .order('name')
      .then(({ data }) => setCategories(data || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!file) {
      setMessage('Choisis une photo à uploader.');
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Tu dois être connecté pour publier une photo.');
      setLoading(false);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const path = `${user.id}/${fileName}`;

    const { error: uploadOriginalError } = await supabase.storage
      .from('photos-original')
      .upload(path, file);

    if (uploadOriginalError) {
      setMessage('Erreur upload original : ' + uploadOriginalError.message);
      setLoading(false);
      return;
    }

    const { error: uploadPreviewError } = await supabase.storage
      .from('photos-preview')
      .upload(path, file);

    if (uploadPreviewError) {
      setMessage('Erreur upload aperçu : ' + uploadPreviewError.message);
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('photos').insert({
      creator_id: user.id,
      category_id: categoryId || null,
      title,
      description,
      storage_path: path,
      preview_path: path,
      price: parseInt(price, 10),
      status: 'pending',
    });

    if (insertError) {
      setMessage('Erreur enregistrement : ' + insertError.message);
    } else {
      setMessage(
        'Photo envoyée ! Elle sera visible après validation par un administrateur.'
      );
      setFile(null);
      setTitle('');
      setDescription('');
      setPrice('');
    }

    setLoading(false);
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen justify-center bg-slate-900 px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-lg flex-col gap-4 rounded-lg bg-slate-800 p-8"
        >
          <h1 className="text-2xl font-bold text-white">Publier une photo</h1>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm text-slate-300"
          />

          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white"
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white"
          >
            <option value="">Choisir une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Prix (FCFA)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-white"
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Envoi...' : 'Publier'}
          </Button>

          {message && <p className="text-sm text-slate-300">{message}</p>}
        </form>
      </main>
    </>
  );
}
