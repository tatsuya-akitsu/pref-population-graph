'use client'
import { Prefectures } from "@/types"
import { ViewLabels } from "../constants"
import styles from '@/app/styles/tab.module.css'

type Props = {
  current: Prefectures.Constants.ViewLabel | string
  onClick: (value: Prefectures.Constants.ViewLabel) => void
}

const Tab: React.FC<Props> = ({ current, onClick }) => {
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
}

export default Tab
