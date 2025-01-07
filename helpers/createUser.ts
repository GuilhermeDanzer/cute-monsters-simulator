import { createUser, getUser } from '@/services/userService'
import { Pokemon } from '@/types/pokemon'
import { v4 as uuidv4 } from 'uuid'
export const createUserLocalStorage = async (pokemons: Pokemon[]) => {
  let id = localStorage.getItem('id')
  if (!id) {
    id = uuidv4()
    localStorage.setItem('id', id)
    if (pokemons.length === 0) return []
    await createUser({ id: id, pokemons })
    console.log(pokemons)
    return pokemons
  } else {
    const user = await getUser(id)
    return user.pokemons
  }
}
