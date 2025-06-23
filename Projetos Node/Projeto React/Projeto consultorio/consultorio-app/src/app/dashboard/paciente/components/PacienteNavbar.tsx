'use client'
import { useEffect, useState } from 'react'
import { FaUserCircle, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function PacienteNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get('/me')
        console.log(res)
        setUserName(res.data.user.name)
      } catch (err) {
        console.error('Erro ao buscar usuário:', err)
        setUserName('Paciente')
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token') // caso use cookie, pode ignorar
    router.push('/')
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b">
      <h1 className="text-2xl font-bold text-[#2B7A78]">Consultório</h1>
      <div className="relative">
        <button
          className="flex items-center space-x-2 text-[#2B7A78] hover:text-[#256c67]"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FaUserCircle className="text-2xl" />
          <span>{userName}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
            <a href="/dashboard/paciente" className="block px-4 py-2 hover:bg-gray-100 text-sm">
              <FaCalendarAlt className="inline mr-1" /> Minhas Consultas
            </a>
            <a href="/dashboard/paciente/perfil" className="block px-4 py-2 hover:bg-gray-100 text-sm">
              Editar Perfil
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
            >
              <FaSignOutAlt className="inline mr-1" /> Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
