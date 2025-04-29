import { useRouter } from "next/navigation"

import axios from "axios"

export function useLogout() {
  const router = useRouter()

  async function logout() {
    try {
      // Fazendo a chamada POST para a rota de logout
      await axios.post('/logout', {}, { withCredentials: true })

      // Redireciona para a página de login após o logout
      router.push('/')
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return { logout }
}
