import { setCookie } from "cookies-next"
import { api } from "@/services/api"

export function useLogin() {
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", {
        email,
        password
      })

      // Salvando o token no cookie de forma segura
      const token = response.data.token
      const expressTime = 60 * 60 * 24 * 30 * 1000  // 30 dias

      setCookie("session", token, {
        maxAge: expressTime,
        path: "/",
        httpOnly: true,  // Segurança: não acessível via JavaScript
        secure: process.env.NODE_ENV === "production",  // Só é enviado via HTTPS em produção
      })
    } catch (error) {
      throw new Error("Falha ao autenticar o usuário")
    }
  }

  return { login }
}
