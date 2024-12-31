'use client'
import React from 'react'
import styles from './card.module.css'
import Image from 'next/image'
import { ProgressBar } from '../progressBar'

interface CardProps {
  name: string
  type: string
  totalLife: number
  currentLife: number
  level: number
  image: string
  onSelect: () => void
  isSelected: boolean
  experience: number
  nextLevelExp: number
}

export const Card: React.FC<CardProps> = ({
  name,
  type,
  totalLife,
  currentLife,
  level,
  image,
  onSelect,
  isSelected,
  experience,
  nextLevelExp,
}) => {
  const expPercentage = (experience / nextLevelExp) * 100

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
        <div className={styles.topInfo}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.stats}>lvl: {level}</p>
        </div>
        <Image src={image} alt={name} width={150} height={150} />

        <p className={styles.stats}>
          HP: {totalLife} / {currentLife}
        </p>
        <p className={styles.stats}>Type: {type}</p>
        <ProgressBar percentage={expPercentage} />
        <p className={styles.stats}>
          EXP: {experience} / {nextLevelExp}
        </p>
      </div>

      <button
        className={`${styles.button} ${isSelected ? styles.pressed : ''}`}
        onClick={() => {
          onSelect()
        }}>
        {isSelected ? 'Training' : 'Train'}{' '}
      </button>
    </div>
  )
}
