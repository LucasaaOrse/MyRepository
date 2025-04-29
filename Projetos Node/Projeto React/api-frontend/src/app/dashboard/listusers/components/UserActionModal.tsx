"use client"

interface User {
  id: string
  name: string
  email: string
  role: boolean
}

interface UserActionModalProps {
  user: User
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function UserActionModal({ user, onClose, onEdit, onDelete }: UserActionModalProps) {
  if (!user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-center text-blue-600 mb-4">
          O que deseja fazer com {user.name}?
        </h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={onEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition"
          >
            Deletar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-md transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
