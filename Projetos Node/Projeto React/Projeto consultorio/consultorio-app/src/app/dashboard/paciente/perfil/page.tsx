'use client'

import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import PacienteNavbar from '../components/PacienteNavbar'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
}

export default function PerfilPaciente() {
  const [user, setUser] = useState<User>({ id: 0, name: '', email: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // 1) Carrega dados iniciais
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const res = await api.get('/me')
        const u = res.data.user
        setUser({
          id: u.id,
          name: u.name ?? '',
          email: u.email ?? ''
        })
      } catch (err) {
        console.error('Erro ao carregar usuário:', err)
        router.push('/')  // não autenticado
      }
    }
    carregarUsuario()
  }, [router])

  // 2) Atualiza campo name/email no estado
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  // 3) Submete o PUT e refaz GET /me
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    try {
      await api.put('/user', {
        id: user.id,
        name: user.name.trim(),
        email: user.email.trim()
      })
      setSuccess('Dados atualizados com sucesso!')

      // refetch para garantir estado sincronizado
      const res2 = await api.get('/me')
      const u2 = res2.data.user
      setUser({
        id: u2.id,
        name: u2.name ?? '',
        email: u2.email ?? ''
      })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar usuário.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1FAE5] via-white to-[#E0F7F5]">
      <PacienteNavbar />

      <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#2B7A78] mb-6 flex items-center gap-2">
          <FaUser /> Meu Perfil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-[#3AAFA9] focus:border-[#3AAFA9]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring-[#3AAFA9] focus:border-[#3AAFA9]"
              required
            />
          </div>

          {success && <p className="text-green-600 text-sm">{success}</p>}
          {error   && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#2B7A78] text-white py-2 rounded-md hover:bg-[#256c67] transition"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  )
}
