// src/hooks/useAuthAdmin.ts
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function useAuthAdmin() {
  const router = useRouter()

  useEffect(() => {
    api.get('/me')
      .then(res => {
        if (res.data.user.type !== 'admin') {
          router.push('/')  
        }
      })
      .catch(() => {
        router.push('/sessao-expirada')
      })
  }, [router])
}
