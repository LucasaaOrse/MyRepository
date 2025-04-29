// src/utils/enrichPokemon.ts
import { api } from "@/services/api"

export async function enrichPokemonWithTypeIcons(pokemonUrl: string) {
  const { data: pokemonData } = await api.get(pokemonUrl)

  const typesWithIcons = await Promise.all(
    pokemonData.types.map(async (typeInfo: { type: { url: string; name: string } }) => {
      const { data: typeDetails } = await api.get(typeInfo.type.url)

      const iconUrl = typeDetails?.sprites?.["generation-iii"]?.["firered-leafgreen"]?.name_icon

      return {
        ...typeInfo,
        icon: iconUrl,
      }
    })
  )

  return {
    ...pokemonData,
    types: typesWithIcons,
  }
}
