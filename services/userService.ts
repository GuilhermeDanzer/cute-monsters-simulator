import { Pokemon } from '@/types/pokemon'
import axios from 'axios'

interface User {
  id: string
  pokemons: Pokemon[]
}

export async function createUser({ id, pokemons }: User) {
  await axios.post(
    'https://d885-2804-1354-81e8-d200-7d95-4ed2-ddc2-5ce2.ngrok-free.app/api/users',
    {
      id: id,
      pokemons,
    }
  )
}

export async function getUser(id: string): Promise<User> {
  const response = await axios.get(
    `https://d885-2804-1354-81e8-d200-7d95-4ed2-ddc2-5ce2.ngrok-free.app/api/users/${id}`
  )
  return response.data as User
}

export async function updateUser({ id, pokemons }: User) {
  await axios.patch(
    `https://d885-2804-1354-81e8-d200-7d95-4ed2-ddc2-5ce2.ngrok-free.app/api/users/${id}`,
    {
      pokemons,
    }
  )
}
