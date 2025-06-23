"use client"
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-50 via-white to-blue-50 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" aria-label="Página inicial" className="w-[150px] h-[40px] block">
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="40" viewBox="0 0 150 40" fill="none">
            <text x="0" y="28" fontFamily="Segoe UI, sans-serif" fontSize="28" fontWeight="bold" fill="#2B7A78">
              Viva
            </text>
            <text x="65" y="28" fontFamily="Segoe UI, sans-serif" fontSize="28" fontWeight="bold" fill="#3AAFA9">
              Bem
            </text>
          </svg>
        </Link>

        <ul className="flex gap-6 text-[#2B7A78] font-medium items-center relative">
          <li><Link href="/">Início</Link></li>
          <li><Link href="/especialidades">Especialidades</Link></li>
          <li><Link href="/planos">Planos</Link></li>
          <li className="relative">
            <button onClick={() => setOpen(!open)} className="hover:underline">Login ▾</button>
            {open && (
              <ul className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-md shadow-lg text-sm w-48 z-10">
                <li>
                  <Link href="/login/paciente" className="block px-4 py-2 hover:bg-gray-100">Sou Paciente</Link>
                </li>
                <li>
                  <Link href="/login/medico" className="block px-4 py-2 hover:bg-gray-100">Sou Médico</Link>
                </li>
                <li>
                  <Link href="/login/admin" className="block px-4 py-2 hover:bg-gray-100">Sou Administrador</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}