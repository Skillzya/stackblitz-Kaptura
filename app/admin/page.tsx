'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/elements/button'
import { Header } from '@/components/layout/header'

type Photo = {
  id: string
  title: string
  description: string
  price: number
  status: string
  storage_path: string
}

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  async function loadPendingPhotos() {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    setPhotos(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadPendingPhotos()
  }, [])

  async function handleModerate(id: string, status: 'approved' | 'rejected') {
    await supabase.from('photos').update({ status }).eq('id', id)
    loadPendingPhotos()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-white">
          Moderation des photos
        </h1>

        {loading ? (
          <p className="text-slate-400">Chargement...</p>
        ) : photos.length === 0 ? (
          <p className="text-slate-400">Aucune photo en attente de validation.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {photos.map((photo) => {
              const { data: urlData } = supabase.storage
                .from('photos-preview')
                .getPublicUrl(photo.storage_path)

              return (
                <div
                  key={photo.id}
                  className="flex items-center gap-4 rounded-lg bg-slate-800 p-4"
                >
                  <img
                    src={urlData.publicUrl}
                    alt={photo.title}
                    className="h-24 w-24 rounded-md object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-bold text-white">{photo.title}</p>
                    <p className="text-sm text-slate-400">{photo.description}</p>
                    <p className="text-sm text-slate-500">{photo.price} FCFA</p>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleModerate(photo.id, 'approved')}>
                      Approuver
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleModerate(photo.id, 'rejected')}
                    >
                      Rejeter
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}