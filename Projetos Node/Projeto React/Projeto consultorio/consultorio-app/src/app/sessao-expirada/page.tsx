// app/sessao-expirada/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SessaoExpirada() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000) // espera 3 segundos antes de redirecionar

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h1>Sessão expirada</h1>
      <p>Você será redirecionado para o login em instantes...</p>
    </div>
  )
}
