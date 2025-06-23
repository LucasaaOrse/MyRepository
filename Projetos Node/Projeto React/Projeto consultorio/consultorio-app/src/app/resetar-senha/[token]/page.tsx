'use client'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { FaLock } from 'react-icons/fa'

type NewPasswordForm = {
  password: string
}

export default function RedefinirSenha() {
  const params = useParams()
  const token = params.token as string

  console.log('Token:', token)

  const { register, handleSubmit } = useForm<NewPasswordForm>()
  const router = useRouter()
  const [userId, setUserId] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const buscarUserId = async () => {
      try {
        const res = await api.get(`/tokeninfo?token=${token}`)
        setUserId(res.data.user_id)
      } catch (err) {
        setErro('Token inválido ou expirado')
      }
    }
  
    buscarUserId()
  }, [token])

  const onSubmit = async (data: NewPasswordForm) => {
    try {
      if (!userId) {
        setErro('ID do usuário não encontrado')
        return
      }

      await api.put('/changePassword', {
        password: data.password,
        id: userId,
        token,
      })

      setMensagem('Senha redefinida com sucesso. Redirecionando para login...')
      setTimeout(() => router.push('/login/paciente'), 3001)
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao redefinir senha'
      setErro(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D1FAE5] via-white to-[#E0F7F5]">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <FaLock className="text-4xl text-[#2B7A78] mb-2" />
          <h1 className="text-2xl font-semibold text-[#2B7A78]">Nova Senha</h1>
          <p className="text-sm text-gray-500 text-center">Digite sua nova senha abaixo</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Nova senha</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9]"
              placeholder="••••••••"
            />
          </div>

          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          {mensagem && <p className="text-green-600 text-sm">{mensagem}</p>}

          <button
            type="submit"
            className="w-full bg-[#2B7A78] text-white py-2 rounded-md hover:bg-[#256c67] transition duration-200"
          >
            Redefinir senha
          </button>
        </form>
      </div>
    </div>
  )
}
