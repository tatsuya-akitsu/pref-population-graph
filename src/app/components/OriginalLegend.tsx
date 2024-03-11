import { Prefectures } from "@/types";
import { PrefectureNames, colors } from "../constants";
import styles from '@/app/styles/charts.module.css'

type Props = {
  selected: Prefectures.Constants.PrefectureName[]
}

const OriginalLegend: React.FC<Props> = ({ selected }) => {
  return (
    <div className={styles.legend}>
      <ul className={styles.legendList}>
        {selected.map((s, i) => (
          <li
            key={i}
            className={styles.legendItem}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              aria-labelledby="title"
              aria-describedby="desc"
              role="img"
            >
              <path
                data-name="layer1"
                d="M54 24a22 22 0 1 0-28 21.1L32 62l6-16.8A22 22 0 0 0 54 24z"
                fill={colors[PrefectureNames.indexOf(`${s}`)]}
              ></path>
            </svg>
            <p style={{ color: colors[PrefectureNames.indexOf(`${s}`)] }}>
              {s}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OriginalLegend
