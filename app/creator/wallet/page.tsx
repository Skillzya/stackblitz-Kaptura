'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/layout/header'

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('wallets')
        .select('*')
        .eq('creator_id', user.id)
        .single()

      setWallet(data)
      setLoading(false)
    }
    load()
  }, [router])

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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-white">Mon portefeuille</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-800 p-6">
            <p className="text-sm text-slate-400">Solde disponible</p>
            <p className="mt-2 text-3xl font-bold text-primary">
              {wallet?.available_balance || 0} FCFA
            </p>
          </div>

          <div className="rounded-lg bg-slate-800 p-6">
            <p className="text-sm text-slate-400">Solde en attente</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {wallet?.pending_balance || 0} FCFA
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
        <a
            href="/creator/payouts"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Demander un retrait
          </a>
        </div>
      </main>
    </>
  )
}