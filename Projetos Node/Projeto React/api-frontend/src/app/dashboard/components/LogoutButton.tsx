"use client"

import { useLogout } from "@/hooks/useLogout"

export default function LogoutButton() {
  const { logout } = useLogout()

  return (
    <button
      onClick={logout}
      className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  )
}
