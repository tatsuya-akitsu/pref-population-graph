'use client'
import React from 'react'
import styles from '@/app/styles/listitem.module.css'

type Props = {
  selected: string[];
  onChange: (value: string) => void;
  pref: {
    prefCode: number;
    prefName: string;
  }
}

const ListItem: React.FC<Props> = React.memo(({ selected, onChange, pref }) => {
  const onGetPrefectureCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  return (
    <li className={styles.listitem}>
      <div className={styles.checkbox}>
        <input
          type="checkbox"
          name={`prefecture_${pref.prefCode}`}
          id={`prefecture_${pref.prefCode}`}
          value={pref.prefCode}
          onChange={onGetPrefectureCode}
          checked={selected.includes(`${pref.prefName}`)}
        />
      </div>
      <div className={styles.labelbox}>
        <label htmlFor={`prefecture_${pref.prefCode}`}>{pref.prefName}</label>
      </div>
    </li>
  );
})

ListItem.displayName = 'ListItem'

// const ListItem: React.FC<Props> = ({ selected, onChange, pref }) => {
//   const onGetPrefectureCode = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChange(e.target.value)
//   }
//   return (
//     <li className={styles.listitem}>
//       <div className={styles.checkbox}>
//         <input
//           type="checkbox"
//           name={`prefecture_${pref.prefCode}`}
//           id={`prefecture_${pref.prefCode}`}
//           value={pref.prefCode}
//           onChange={onGetPrefectureCode}
//           checked={selected.includes(`${pref.prefName}`)}
//         />
//       </div>
//       <div className={styles.labelbox}>
//         <label htmlFor={`prefecture_${pref.prefCode}`}>{pref.prefName}</label>
//       </div>
//     </li>
//   );
// }

export default ListItem
