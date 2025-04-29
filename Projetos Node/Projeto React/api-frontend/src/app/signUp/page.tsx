"use client"

import { useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/logo.png"


export default function Home() {
  const [error, setError] = useState("")
  const router = useRouter()
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    const email = form.get('email')
    const password = form.get('password')
    const name = form.get('name')

    try {
      const response = await api.post('user', {email, password, name})

      if (!email || !password || !name) {
        setError("Todos os campos são obrigatórios.")
        return
      }

      console.log(email, password, name, response.data)
      router.back()
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao fazer login")
    }
    

  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Image
      src={logo}
      alt="logo"
      width={150}
      height={150}
      className="mb-4"
      />
      
      <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-8 bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Cadastrar</h2>
        <input 
        type="text" 
        name="name" 
        id="name" 
        placeholder="Digite seu Nome"  
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
        />
        <input 
        type="email" 
        name="email" 
        id="email" 
        placeholder="Digite seu email"  
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
        />
        <input 
        type="password" 
        name="password" 
        id="password"
        placeholder="********" 
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button 
        type="submit"
        value="" 
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          Cadastrar
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <p className="text-center text-sm text-gray-600">
          Ja possui uma conta?{" "}
          <a href="/" className="text-blue-600 hover:underline font-medium">
            Faça login aqui
          </a>
        </p>
      </form>
      
    </div>
  );
}
