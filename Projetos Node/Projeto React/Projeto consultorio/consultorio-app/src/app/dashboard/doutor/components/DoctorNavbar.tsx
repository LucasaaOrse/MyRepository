// src/app/dashboard/doctor/components/DoctorNavbar.tsx
'use client'
import Link from 'next/link'
import { FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function DoctorNavbar() {
  const router = useRouter()
  const handleLogout = () => {
    document.cookie = 'session=; Max-Age=0; path=/'
    router.push('/')
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b">
      <h1 className="text-2xl font-bold text-blue-800">Painel Médico</h1>
      <div className="space-x-4">
        <Link href="/dashboard/doutor" className="text-blue-600 hover:underline flex items-center">
          <FaCalendarAlt className="mr-1"/> Agenda
        </Link>
        <button onClick={handleLogout} className="text-red-600 hover:text-red-800 flex items-center">
          <FaSignOutAlt className="mr-1"/> Sair
        </button>
      </div>
    </nav>
  )
}
