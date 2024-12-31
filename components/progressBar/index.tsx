import React from 'react'
import styles from './progressBar.module.css'
interface ProgressBarProps {
  percentage: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className={styles.bar}>
      <div
        className={styles.progress}
        style={{ width: `${percentage}%` }}></div>
    </div>
  )
}
