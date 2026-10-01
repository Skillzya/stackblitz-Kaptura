'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/elements/button'
import { Header } from '@/components/layout/header'

export default function CheckoutPage({
  params,
}: {
  params: { photoId: string }
}) {
  const searchParams = useSearchParams()
  const licenseId = searchParams.get('license')
  const router = useRouter()

  const [photo, setPhoto] = useState<any>(null)
  const [license, setLicense] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const { data: photoData } = await supabase
        .from('photos')
        .select('*')
        .eq('id', params.photoId)
        .single()

      const { data: licenseData } = await supabase
        .from('licenses')
        .select('*')
        .eq('id', licenseId)
        .single()

      setPhoto(photoData)
      setLicense(licenseData)
      setLoading(false)
    }
    load()
  }, [params.photoId, licenseId])

  async function handlePay(method: 'wave' | 'orange_money') {
    setProcessing(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage('Tu dois etre connecte pour acheter.')
      setProcessing(false)
      return
    }

    const total = Math.round(photo.price * license.price_multiplier)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        total_amount: total,
        status: 'paid',
        payment_method: method,
      })
      .select()
      .single()

    if (orderError) {
      setMessage('Erreur commande : ' + orderError.message)
      setProcessing(false)
      return
    }

    const { error: purchaseError } = await supabase.from('purchases').insert({
      order_id: order.id,
      photo_id: photo.id,
      buyer_id: user.id,
      license_id: license.id,
      price: total,
    })

    if (purchaseError) {
      setMessage('Erreur achat : ' + purchaseError.message)
      setProcessing(false)
      return
    }

    const creatorShare = Math.round(total * 0.8)

    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('creator_id', photo.creator_id)
      .single()

    if (wallet) {
      await supabase
        .from('wallets')
        .update({
          available_balance: wallet.available_balance + creatorShare,
          updated_at: new Date().toISOString(),
        })
        .eq('creator_id', photo.creator_id)
    }

    setMessage('Paiement reussi ! Redirection vers ta bibliotheque...')
    setTimeout(() => router.push('/library'), 1500)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
          Chargement...
        </main>
      </>
    )
  }

  if (!photo || !license) {
    return (
      <>
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
          Photo ou licence introuvable.
        </main>
      </>
    )
  }

  const total = Math.round(photo.price * license.price_multiplier)

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-10">
        <div className="w-full max-w-md rounded-lg bg-slate-800 p-8">
          <h1 className="mb-6 text-2xl font-bold text-white">Paiement</h1>

          <div className="mb-6 rounded-md bg-slate-900 p-4">
            <p className="font-medium text-white">{photo.title}</p>
            <p className="text-sm text-slate-400">Licence : {license.name}</p>
            <p className="mt-2 text-lg font-bold text-white">{total} FCFA</p>
          </div>

          <p className="mb-3 text-sm text-slate-300">Choisis ton moyen de paiement :</p>

          <div className="flex flex-col gap-3">
            <Button onClick={() => handlePay('wave')} disabled={processing}>
              {processing ? 'Traitement...' : 'Payer avec Wave'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handlePay('orange_money')}
              disabled={processing}
            >
              {processing ? 'Traitement...' : 'Payer avec Orange Money'}
            </Button>
          </div>

          {message && <p className="mt-4 text-sm text-slate-300">{message}</p>}
        </div>
      </main>
    </>
  )
}