"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { api } from "@/services/api"
import React from "react"
import { enrichPokemonWithTypeIcons } from "@/utils/enrichPokemon"
import { Pokecard } from "./components"

interface PokemonTypeDetail {
    damage_relations: any // ou mais específico se quiser
    // sprite?: string (caso exista)
    name: string
    // qualquer outro campo que a API de tipos retornar
  }

export interface Pokemon {
    name: string,
    height: number,
    sprites: { front_default: string, back_default: string }
    types: { type: { name: string, url: string }; icon?: string}[]
    
}

interface Props {
    initialPokemons: Pokemon[]
}

export default function PokemonList({ initialPokemons }: Props) {
    const [pokemons, setPokemons] = useState<Pokemon[]>(initialPokemons)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchMorePokemons = async () => {
        if (loading) return

        setLoading(true)
        const offset = page * 10 // Calcula o offset para carregar os próximos 10 pokémons

        const { data } = await api.get(`/pokemon?offset=${offset}&limit=10`)

        const detailedPokemons = await Promise.all(
            data.results.map((pokemon: {url: string }) => {
                const enrichPokemon = enrichPokemonWithTypeIcons(pokemon.url)

                return enrichPokemon
            })
        )
          
        

        setPokemons((prev) => [...prev, ...detailedPokemons])
        setLoading(false)
    }

    // Ref para o elemento de carregamento (marcador de rolagem)
    const loadMoreRef = React.useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Verifica se o último elemento está visível
                const lastEntry = entries[0]
                if (lastEntry.isIntersecting && !loading) {
                    setPage((prevPage) => prevPage + 1)
                }
            },
            {
                rootMargin: "100px", // Quando o último elemento estiver 100px do fundo da página, o observer será disparado
            }
        )

        // Começa a observar o elemento de carregamento
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current)
            }
        }
    }, [loading])

    useEffect(() => {
        if (page > 1) {
            fetchMorePokemons()
        }
    }, [page])

    const filteredPokemons = pokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (


        <div>
            <div className="flex justify-center bg-blue-500 flex-col items-center">
                <label htmlFor="busca" className="text-green-500 mt-0.5">Buscar Pokemons</label>
                <input type="text" name="busca" id="busca" className="m-4 p-1 bg-white " onChange={((t) => setSearchTerm(t.target.value))} value={searchTerm} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 mt-2 bg-gray-50">
                {filteredPokemons.map((pokemon, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 p-4 rounded-lg shadow-md bg-gray-100 flex flex-col items-center justify-between hover:shadow-lg transition-shadow"
                    >
                        <h1 className="text-xl font-semibold text-blue-600 mb-3 bg-blue-100 px-3 py-1 rounded-md">
                            {pokemon.name}
                        </h1>
                        <Pokecard key={index} pokemon={pokemon}/>
                        <p className="text-sm text-gray-700 mb-2">
                            Altura: {pokemon.height} Centímetros
                        </p>
                        {pokemon.types.map((type, i) => (
                            <div key={i}>
                                {type.icon && (
                                    <Image src={type.icon}
                                        alt={type.type.name}
                                        width={64}
                                        height={24}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
                {/* Div de carregamento que será observada pelo IntersectionObserver */}
                <div ref={loadMoreRef} className="h-8"></div>
                {loading && <p>Carregando...</p>} {/* Exibe a mensagem de carregamento enquanto carrega novos pokémons */}
            </div>
        </div>
    )
}
