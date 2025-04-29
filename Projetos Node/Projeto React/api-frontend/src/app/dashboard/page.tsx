import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { api } from "@/services/api"
import LogoutButton from "./components/LogoutButton"

export default async function DashboardPage() {
  const cookieStore =  await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    redirect("/")
  }

  try {
    await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    redirect("/")
  }



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tela de Dashboard</h1>
      <LogoutButton />
    </div>
  )
}
