'use client'
import styles from '@/app/styles/listitem.module.css'

type Props = {
  code: string;
  onChange: (value: string) => void;
  pref: {
    prefCode: number;
    prefName: string;
  }
}

const ListItem: React.FC<Props> = ({ code, onChange, pref }) => {
  const onGetPrefectureCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }
  return (
    <li className={styles.listitem}>
      <div className={styles.checkbox}>
        <input
          type="radio"
          name="prefecture"
          id={`prefecture_${pref.prefCode}`}
          value={pref.prefCode}
          onChange={onGetPrefectureCode}
          checked={code === `${pref.prefCode}`}
        />
      </div>
      <div className={styles.labelbox}>
        <label htmlFor={`prefecture_${pref.prefCode}`}>{pref.prefName}</label>
      </div>
    </li>
  );
}

export default ListItem