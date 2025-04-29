"use client"

import { api } from "@/services/api"
import { useEffect, useState } from "react"
import { UserActionModal } from "./components/UserActionModal"
import { EditUserModal } from "./components/EditUserModal"

interface User {
  id: string
  name: string
  email: string
  role: boolean
}

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("/users", { withCredentials: true })
        setUsers(response.data)
      } catch (err) {
        console.error(err)
        setError("Erro ao listar usuários")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  function openActionModal(user: User) {
    setSelectedUser(user)
    setIsActionModalOpen(true)
  }

  function closeActionModal() {
    setSelectedUser(null)
    setIsActionModalOpen(false)
  }

  function openEditModal() {
    setIsActionModalOpen(false)
    setIsEditModalOpen(true)
  }

  function closeEditModal() {
    setIsEditModalOpen(false)
    setSelectedUser(null)
  }

  async function handleEditUser(data: { id: string; name: string; email: string; role: boolean }) {
    try {
      await api.put("/user", data, { withCredentials: true })

      // Atualiza a lista de usuários
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === data.id ? { ...u, ...data } : u))
      )

      closeEditModal()
    } catch (err) {
      console.error("Erro ao editar usuário:", err)
    }
  }

  async function handleDeleteUser() {
    if (selectedUser) {
      try {
        await api.delete(`/user/${selectedUser.id}`, { withCredentials: true })
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== selectedUser.id))
      } catch (err) {
        console.error("Erro ao deletar usuário:", err)
      }
    }
    closeActionModal()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Lista de Usuários</h1>

        {loading && <p className="text-center text-gray-500">Carregando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Nome</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openActionModal(user)}
                  >
                    <td className="border px-4 py-2">{user.id}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role ? "Admin" : "Usuário"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isActionModalOpen && selectedUser && (
        <UserActionModal
          user={selectedUser}
          onClose={closeActionModal}
          onEdit={openEditModal}
          onDelete={handleDeleteUser}
        />
      )}

      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={closeEditModal}
          onSave={handleEditUser}
        />
      )}
    </div>
  )
}
