
import { useState, } from "react"
import Image from "next/image"
import { Pokemon } from ".."

export function Pokecard({ pokemon }: {pokemon: Pokemon} ){
    const [mostrarCostas, setMostrarCostas] = useState(false)

    return(
        <Image
          src={mostrarCostas ? pokemon.sprites.back_default : pokemon.sprites.front_default}
          alt={pokemon.name}
          width={150}
          height={150}
          onMouseEnter={() => setMostrarCostas(true)}
          onMouseLeave={() => setMostrarCostas(false)}
        />
      )
}
