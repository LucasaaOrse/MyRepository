"use server"

import { redirect } from "next/navigation"
import { api } from "@/services/api"

export async function handleLogin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    redirect("/")
  }

  const response = await api.post("/login", { email, password }).catch((error) => {
    console.log("Erro ao logar:", error)
    redirect("/")
  });

  if (!response) {
    return;
  }

  redirect("/dashboard")
}
