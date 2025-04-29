"use client"

import { useState } from "react"

interface EditUserModalProps {
  user: {
    id: string
    name: string
    email: string
    role: boolean
  }
  onClose: () => void
  onSave: (data: { id: string; name: string; email: string; role: boolean }) => void
}

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState(user.role)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ id: user.id, name, email, role })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-blue-600 mb-6 text-center">
          Editar Usuário
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="text-gray-700 font-semibold">Nome</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              className="w-full border rounded-md p-2 mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Tipo</label>
            <select
              className="w-full border rounded-md p-2 mt-1"
              value={role ? "admin" : "user"}
              onChange={(e) => setRole(e.target.value === "admin")}
            >
              <option value="user">Usuário</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-md transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
