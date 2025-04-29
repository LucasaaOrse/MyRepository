
import { api } from "@/services/api";
import  PokemonList  from "./components/Lista";
import { Navbar } from "./components/Navbar";
import { enrichPokemonWithTypeIcons } from "@/utils/enrichPokemon";

async function getInitialPokemons() {
  const { data } = await api.get("/pokemon?limit=10")

  const detailed = await Promise.all(
    data.results.map(async (pokemon: any) => enrichPokemonWithTypeIcons(pokemon.url))
  )

  return detailed
}

export default async function Home() {
  
  const initialData = await getInitialPokemons()
   
  return (
    <div>
      <Navbar/>
      <PokemonList initialPokemons={initialData}/>
    </div>
  );
}
