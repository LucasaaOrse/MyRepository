'use client'

import { useForm } from 'react-hook-form'
import api from '@/lib/api'
import { useState } from 'react'
import { FaEnvelope } from 'react-icons/fa'
import Link from 'next/link'


type RecoveryForm = {
  email: string
}

export default function RecuperarSenha() {
  const { register, handleSubmit } = useForm<RecoveryForm>()
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const onSubmit = async (data: RecoveryForm) => {
    try {
      const res = await api.post('/passwordRecovery', data)
      const token = res.data
      setMensagem(`http://10.0.20.116:3001/resetar-senha/${token}`)
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao solicitar recuperação'
      setErro(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#D1FAE5] via-white to-[#E0F7F5]">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <FaEnvelope className="text-4xl text-[#2B7A78] mb-2" />
          <h1 className="text-2xl font-semibold text-[#2B7A78]">Recuperar Senha</h1>
          <p className="text-sm text-gray-500 text-center">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
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

          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          {mensagem && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">Um link foi gerado. </p>
              <a
                href={mensagem}
                className="text-green-600 text-sm font-semibold hover:underline"
              >
                Clique aqui para recuperar sua senha
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#2B7A78] text-white py-2 rounded-md hover:bg-[#256c67] transition duration-200"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
