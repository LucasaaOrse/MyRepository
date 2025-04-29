import React from "react"

export function Navbar() {
    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow border-gray-400 border ">

                <h3 className="text-2xl font-bold text-blue-600">Pokenode</h3>
                <ul className="flex gap-6 text-gray-700 font-medium">
                    <li><a className="hover:text-blue-500" href="#">Home</a></li>
                    <li><a className="hover:text-blue-500" href="#">Sobre</a></li>
                    <li><a className="hover:text-blue-500" href="#">Contato</a></li>
                </ul>
                
        </nav>
    )
}
