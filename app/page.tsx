'use client'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import { Card } from '@/components/card'
import { getRandomPokemon } from '@/helpers/pokemonHelper'
import { Pokemon } from '@/types/pokemon'
import pokemonsData from '@/data/pokemons.json'
import { ProgressBar } from '@/components/progressBar'
import { createUserLocalStorage } from '@/helpers/createUser'
import { updateUser } from '@/services/userService'

export default function Home() {
  const allPokemons: Pokemon[] = pokemonsData as Pokemon[]

  const [initialPokemon, setInitialPokemon] = useState<Pokemon | null>(null)
  const [wildPokemons, setWildPokemons] = useState<Pokemon[]>([])
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [trainingCapacity] = useState<number>(3)
  const [trainingPokemons, setTrainingPokemons] = useState<Pokemon[]>([])
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [isCatching, setIsCatching] = useState<boolean>(false)
  const totalCatchTime = 5000

  const handlePokemonSelect = (selectedPokemon: Pokemon) => {
    if (trainingPokemons.some(pokemon => pokemon.id === selectedPokemon.id)) {
      setTrainingPokemons(
        trainingPokemons.filter(pokemon => pokemon.id !== selectedPokemon.id)
      )
    } else {
      if (trainingPokemons.length >= trainingCapacity) {
        const [, ...rest] = trainingPokemons
        setTrainingPokemons([...rest, selectedPokemon])
      } else {
        setTrainingPokemons([...trainingPokemons, selectedPokemon])
      }
    }
  }

  // Get experience needed for the next level
  const getNextLevelExp = (level: number) => {
    return level * 5
  }

  // Catch a Pokémon after progress is complete
  const catchPokemon = () => {
    const randomPokemon = getRandomPokemon(wildPokemons)

    if (Math.random() > 0.7) {
      setWildPokemons(
        wildPokemons.filter(pokemon => pokemon.id !== randomPokemon.id)
      )
      setPokemons(pokemons => [...pokemons, randomPokemon])
    }

    setIsCatching(false)
    setElapsedTime(0)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isCatching) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => {
          if (prevTime >= totalCatchTime) {
            clearInterval(interval)
            catchPokemon()
            return 0
          }
          return prevTime + 100
        })
      }, 100)
    }

    return () => clearInterval(interval)
  }, [isCatching])

  const percentage = Math.min((elapsedTime / totalCatchTime) * 100, 100)

  const updateUserData = async () => {
    const id = localStorage.getItem('id')
    await updateUser({ id: id || '', pokemons })
  }

  useEffect(() => {
    const fetchData = async () => {
      const randomPokemon = getRandomPokemon(allPokemons)
      setInitialPokemon(randomPokemon)
      setWildPokemons(
        allPokemons.filter(pokemon => pokemon.id !== randomPokemon.id)
      )
      const myPokemons = await createUserLocalStorage([randomPokemon])
      setPokemons(myPokemons)
    }
    fetchData()
  }, [allPokemons])
  useEffect(() => {
    const interval = setInterval(() => {
      setPokemons(prevPokemons =>
        prevPokemons.map(pokemon => {
          if (trainingPokemons.some(tp => tp.id === pokemon.id)) {
            const newExp = pokemon.experience + 1
            const nextLevelExp = getNextLevelExp(pokemon.level)
            if (newExp >= nextLevelExp) {
              return {
                ...pokemon,
                experience: newExp - nextLevelExp,
                level: pokemon.level + 1,
              }
            }
            return { ...pokemon, experience: newExp }
          }
          return pokemon
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [trainingPokemons])

  if (!initialPokemon) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.buttonDiv}>
          <button
            onClick={() => {
              setIsCatching(true)
            }}
            style={{ color: 'black' }}
            disabled={isCatching} // Disable button while catching
          >
            Catch
          </button>
          <button
            onClick={() => {
              updateUserData()
            }}
            style={{ color: 'black' }}
            disabled={isCatching} // Disable button while catching
          >
            Save
          </button>
        </div>

        {isCatching && <ProgressBar percentage={percentage} />}
        <p style={{ marginBottom: 10, color: '#000' }}>
          Training: {trainingPokemons.length} / {trainingCapacity}
        </p>

        <div
          style={{
            flexDirection: 'row',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
          }}>
          {pokemons.map(pokemon => (
            <Card
              image={pokemon.image}
              key={pokemon.id}
              name={pokemon.name}
              type={pokemon.type}
              totalLife={pokemon.totalLife}
              currentLife={pokemon.currentLife}
              level={pokemon.level}
              experience={pokemon.experience}
              nextLevelExp={getNextLevelExp(pokemon.level)}
              onSelect={() => handlePokemonSelect(pokemon)}
              isSelected={trainingPokemons.some(tp => tp.id === pokemon.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
