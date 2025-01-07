import { Pokemon } from '@/types/pokemon'
import axios from 'axios'

interface User {
  id: string
  pokemons: Pokemon[]
}
const baseUrl = 'https://cute-monsters-backend.onrender.com/api/users'

export async function createUser({ id, pokemons }: User) {
  await axios.post(`${baseUrl}`, {
    id: id,
    pokemons,
  })
}

export async function getUser(id: string): Promise<User> {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data as User
}

export async function updateUser({ id, pokemons }: User) {
  await axios.patch(`${baseUrl}/${id}`, {
    pokemons,
  })
}
