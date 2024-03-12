'use client'
import React from 'react'
import { Prefectures } from "@/types"
import { ViewLabels } from "../constants"
import styles from '@/app/styles/tab.module.css'

type Props = {
  current: Prefectures.Constants.ViewLabel | string
  onClick: (value: Prefectures.Constants.ViewLabel) => void
}

const Tab: React.FC<Props> = React.memo(({ current, onClick }) => {
  return (
    <ul className={styles.list}>
      {ViewLabels.map((item, i) => (
        <li
          key={i}
          className={`${styles.item} ${current === item.label ? styles.isCurrent : ''}`}
          onClick={() => onClick(item.label)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
})

Tab.displayName = 'Tab'
export default Tab
