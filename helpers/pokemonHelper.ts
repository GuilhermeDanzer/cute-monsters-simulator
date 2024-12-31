import { Pokemon } from '@/types/pokemon'

export const getRandomPokemon = (pokemons: Pokemon[]): Pokemon => {
  const randomIndex = Math.floor(Math.random() * pokemons.length)
  return pokemons[randomIndex]
}
