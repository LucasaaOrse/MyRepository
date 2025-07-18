// src/hooks/useAuthDoctor.ts
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function useAuthDoctor() {
  const router = useRouter()

  useEffect(() => {
    api.get('/me')
      .then(res => {
        if (res.data.user.type !== 'medico') {
          router.push('/')  
        }
      })
      .catch(() => {
        router.push('/sessao-expirada')
      })
  }, [router])
}
