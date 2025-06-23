'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import Link from 'next/link'

type LoginForm = {
  email: string
  password: string
}

export default function LoginPaciente() {
  const { register, handleSubmit } = useForm<LoginForm>()
  const [error, setError] = useState('')
  const router = useRouter()

  const onSubmit = async (data: LoginForm) => {
    try {
      await api.post('/login', data)
      router.push('/dashboard/paciente')
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro no login'
      setError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D1FAE5] via-white to-[#E0F7F5]">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <FaUser className="text-4xl text-[#2B7A78] mb-2" />
          <h1 className="text-2xl font-semibold text-[#2B7A78]">Login Paciente</h1>
          <p className="text-sm text-gray-500">Acesse sua conta para agendar consultas</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9]"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Senha</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9]"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#2B7A78] text-white py-2 rounded-md hover:bg-[#256c67] transition duration-200"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Esqueceu sua senha?{' '}
          <Link href="/recuperar-senha" className="text-[#2B7A78] font-semibold hover:underline">
            Clique aqui para recuperar
          </Link>
        </p>

        <p className="mt-6 text-sm text-center text-gray-600">
          Ainda não é cadastrado?{' '}
          <Link href="/cadastro/paciente" className="text-[#2B7A78] font-semibold hover:underline">
            Clique aqui e cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
