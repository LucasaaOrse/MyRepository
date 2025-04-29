"use client"

import { useEffect, useState } from "react"
import { getCookie, deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useLogin } from "@/hooks/useLogin" // Hook de login
import Image from "next/image"
import logo from "../../public/logo.png"

export default function Home() {
  const { login } = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const message = getCookie("error")
    if (message) {
      setError(message.toString())
      deleteCookie("error")
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email || !password) {
      setError("Preencha todos os campos")
      return
    }

    try {
      await login(email, password)  // Chamando o hook para login
      router.push("/dashboard")      // Redireciona após o login
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setError("Erro ao fazer login. Verifique suas credenciais.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Image src={logo} alt="logo" width={150} height={150} className="mb-4" />

      <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-8 bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>

        <input 
          type="email" 
          name="email" 
          id="email" 
          placeholder="Digite seu email"  
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
        />

        <input 
          type="password" 
          name="password" 
          id="password"
          placeholder="********" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Entrar
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <p className="text-center text-sm text-gray-600">
          Ainda não tem uma conta?{" "}
          <a href="/signUp" className="text-blue-600 hover:underline font-medium">
            Cadastre-se aqui
          </a>
        </p>
      </form>
    </div>
  )
}
