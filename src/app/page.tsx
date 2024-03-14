'use client'
import { Prefectures } from "@/types";
import ListItem from "./components/ListItem";
import React, { useEffect, useRef, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import listStyles from '@/app/styles/listitem.module.css'
import headerStyles from '@/app/styles/header.module.css'
import layoutStyles from '@/app/styles/layout.module.css'
import chartsStyles from '@/app/styles/charts.module.css'
import Tab from "./components/Tab";
import useWindowSize from "./hooks/resize";
import { PC_CHART_HEIGHT_RATIO, PC_CHART_WIDTH_RATIO, PC_MAX_WIDTH, PrefectureNames, SP_CHART_HEIGHT_RATIO, SP_CHART_WIDTH_RATIO, SP_MAX_WIDTH, colors } from "./constants";
import OriginalLegend from "./components/OriginalLegend";
import ChevronIcon from "./components/Chevron";

type ChartsData = {
  [key in Prefectures.Constants.PrefectureName]?: number;
} & {
  color: Array<string>;
  year: number;
};

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [pref, setPref] = useState<Prefectures.Response.List>()
  const [population, setPopulation] = useState<Prefectures.Response.Population>()
  const [data, setData] =
    useState<Array<ChartsData>>();
  const [label, setLabel] = useState<Prefectures.Constants.ViewLabel>('総人口')
  const [selected, setSelected] = useState<Prefectures.Constants.PrefectureName[]>([])
  const [code, setCode] = useState<string>('')
  const [chartWidth, setChartWidth] = useState<number>(0)
  const [chartHeight, setChartHeight] = useState<number>(0)
  const width = useWindowSize()
  const [isFetched, setIsFetched] = useState<boolean>(false)
  const [isSPMode, setIsSPMode] = useState<boolean>(false)
  const isDevFetchFlg = useRef<boolean>(true)
  const isDevFetchTargetPrefFlg = useRef<boolean>(true)
  const isDevPublishPrefFlg = useRef<boolean>(true)
  const isDevUpdateLabelFlg = useRef<boolean>(true)

  /*
    @COMMENT: 都道府県一覧を取得
  */
  const onFetchPrefectureList = async () => {
    const res = await fetch(
      `${process.env.RESAS_API_ENDPOINT}/api/v1/prefectures`,
      {
        headers: {
          'X-API-KEY': `${process.env.RESAS_API_KEY}`,
        },
      }
    );
    const data = await res.json()
    setPref(data)
  }

  /*
    @COMMENT: 特定の都道府県データを取得
  */
  const onFetchPrefecturePopulation = async (prefCode?: number) => {
    const res = await fetch(
      `${process.env.RESAS_API_ENDPOINT}/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode ? prefCode : code}`,
      {
        headers: {
          'X-API-KEY': `${process.env.RESAS_API_KEY}`,
        },
      }
    );

    return res;
  }

  /*
    @COMMENT: 取得した特定の都道府県データをChart表示用に成形
  */
  const onPublishPrefecturePopulation = () => {
    const targetPrefecture = pref?.result.filter((p) => `${p.prefCode}` === code)[0].prefName as Prefectures.Constants.PrefectureName
    const publishData = population?.result.data.filter((d) => d.label === label)[0].data.map((d) => {
      return {
        [targetPrefecture]: d.value,
        color: [colors[PrefectureNames.indexOf(targetPrefecture)]],
        year: d.year
      };
    })

    if (selected.length > 1) {
      const extractionPublishData = publishData?.map((d) => d[targetPrefecture]) as number[]
      setData((prev) => {
        const updatedPopulation = prev?.map((d, i) => {
          return {
            ...d,
            color: [
              ...d.color,
              colors[PrefectureNames.indexOf(targetPrefecture)],
            ],
            [targetPrefecture]: extractionPublishData[i],
          };
        })
        return updatedPopulation
      })
    } else {
      setData(publishData)
    }
  }

  /*
    @COMMENT: 選択された都道府県コードを選択済みリストへ追加
  */
  const onGetPrefectureCode = (value: string) => {
    setCode((prev) => {
      if (prev === value) {
        return ''
      } else {
        return value
      }
    })
    const targetPref = pref?.result.filter((p) => `${p.prefCode}` === value)[0]
      .prefName as Prefectures.Constants.PrefectureName;
    let updateSelected: Prefectures.Constants.PrefectureName[] = [];

    if (selected.includes(targetPref)) {
      updateSelected = selected.filter((v) => v !== targetPref)
    } else {
      updateSelected = [ ...selected, targetPref ]
    }
    setSelected(updateSelected);

    if (updateSelected.length === 0) {
      setData(undefined)
    }
  }

  /*
    @COMMENT: 選択されたタブ項目を元に、描画情報を更新
  */
  const onChangePublishPopulation = async () => {
    if (selected.length > 1) {
      const mergeData = async () => {
        let mergePublishData: Array<ChartsData> = [];
        for (const s of selected) {
          const prefCode = pref?.result.filter((p) => p.prefName === s)[0]
            .prefCode as number;
          const res = await onFetchPrefecturePopulation(prefCode);
          const data: Prefectures.Response.Population = await res.json();
          const publishData = data.result.data
            .filter((d) => d.label === label)[0]
            .data.map((d) => {
              return {
                [s]: d.value,
                color: [colors[PrefectureNames.indexOf(s)]],
                year: d.year,
              };
            }) as Array<ChartsData>;
          mergePublishData = [
            ...mergePublishData,
            ...publishData,
          ] as ChartsData[];
        }

        return mergePublishData
      }
      const mergePopulations = await mergeData()

      const result: {
        [year: number]: {
          [key in Prefectures.Constants.PrefectureName]?: number;
        } & {
          color: string[];
        };
      } = {};
      mergePopulations.forEach(item => {
        const year: number = item.year;
        if (!result[year]) {
          result[year] = {
            color: []
          };
        }
        const prefName = Object.keys(item)[0] as Prefectures.Constants.PrefectureName
        result[year][prefName] = item[prefName];
        if (item.color && item.color.length > 0) {
          result[year].color = [...result[year].color, ...item.color];
        }
      });

      const formatPopulation = Object.entries(result).map(([year, data]) => ({
        ...data,
        year: parseInt(year),
      }));
      setData(formatPopulation)
    } else {
      const targetPrefecture = pref?.result.filter(
        (p) => `${p.prefCode}` === code
      )[0].prefName as Prefectures.Constants.PrefectureName;
      const publishData = population?.result.data
        .filter((d) => d.label === label)[0]
        .data.map((d) => {
          return {
            [targetPrefecture]: d.value,
            color: [colors[PrefectureNames.indexOf(targetPrefecture)]],
            year: d.year,
          };
        });

      setData(publishData)
    }
  }

  /*
    @COMMENT: 選択されたタブ項目を保存
  */
  const onChangePopulationCategory = (value: Prefectures.Constants.ViewLabel) => {
    setLabel(value)
  }

  const onHandleAccordionState = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' && isDevFetchFlg.current
    ) {
      isDevFetchFlg.current = false;
      return;
    }
    if (!isFetched) {
      onFetchPrefectureList()
      setIsFetched(true)
    }
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isDevFetchTargetPrefFlg.current) {
      isDevFetchTargetPrefFlg.current = false;
      return;
    }
    if (code.length !== 0) {
      const onFetchPopulation = async () => {
        const res = await onFetchPrefecturePopulation();
        const data: Prefectures.Response.Population = await res.json()
        setPopulation(data)
      }
      onFetchPopulation()
    }
  }, [code])

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development'&& isDevPublishPrefFlg.current
    ) {
      isDevPublishPrefFlg.current = false;
      return;
    }
    if (population && code.length !== 0) {
      onPublishPrefecturePopulation();
    }
  }, [code, population])

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' && isDevUpdateLabelFlg.current
    ) {
      isDevUpdateLabelFlg.current = false;
      return;
    }

    if (label.length) {
      onChangePublishPopulation()
    }
  }, [label])

  useEffect(() => {
    if (width > PC_MAX_WIDTH) {
      setChartWidth(Math.round(PC_MAX_WIDTH * PC_CHART_WIDTH_RATIO))
      setChartHeight(Math.round(PC_MAX_WIDTH * PC_CHART_HEIGHT_RATIO));
      setIsSPMode(false)
    } else if (width < SP_MAX_WIDTH) {
      setChartWidth(Math.round(width * SP_CHART_WIDTH_RATIO))
      setChartHeight(Math.round(width * SP_CHART_HEIGHT_RATIO))
      setIsSPMode(true)
    } else {
      setChartWidth(Math.round(width * PC_CHART_WIDTH_RATIO))
      setChartHeight(Math.round(width * PC_CHART_HEIGHT_RATIO))
      setIsSPMode(false)
    }
  }, [width])

  return (
    <main className={layoutStyles.container}>
      <header className={headerStyles.header}>
        <h1>都道府県別人口推移グラフ</h1>
      </header>
      <ul className={listStyles.list}>
        {pref?.result.map((pref, i) => (
          <ListItem
            key={i}
            selected={selected}
            onChange={onGetPrefectureCode}
            pref={pref}
          />
        ))}
      </ul>
      {isSPMode && (
        <div className={listStyles.accordion}>
          <button
            type="button"
            className={listStyles.togglebutton}
            onClick={onHandleAccordionState}
          >
            都道府県一覧
            <ChevronIcon />
          </button>
          <div
            className={`${listStyles.listbox} ${isOpen ? listStyles.isOpen : ''}`}
          >
            <ul className={listStyles.accordionlist}>
              {pref?.result.map((pref, i) => (
                <ListItem
                  key={i}
                  selected={selected}
                  onChange={onGetPrefectureCode}
                  pref={pref}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      {data?.length && (
        <React.Fragment>
          <Tab
            current={label}
            onClick={onChangePopulationCategory}
          />
          <ResponsiveContainer
            className={chartsStyles.charts}
            width={chartWidth}
            height={chartHeight}
          >
            <LineChart
              width={chartWidth}
              height={chartHeight}
              data={data}
            >
              <CartesianGrid />
              <XAxis
                dataKey="year"
                label={{
                  value: '年度',
                  position: 'insideBottomRight',
                  offset: 0,
                }}
                scale="band"
              />
              <YAxis
                label={{
                  value: label,
                  position: 'insideLeft',
                  angle: -90,
                  offset: 0,
                }}
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat('ja-JP', {
                    maximumFractionDigits: 0,
                  }).format(+value)
                }
              />
              <Legend
                align="right"
                verticalAlign="top"
                content={<OriginalLegend selected={selected} />}
                wrapperStyle={{
                  position: 'inherit',
                  inset: 'inherit',
                  float: 'right',
                }}
              />
              {data.map((d, i) => (
                <Line
                  key={i}
                  type="monotone"
                  dataKey={selected[i]}
                  stroke={d.color[i]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </React.Fragment>
      )}
    </main>
  );
}

export default Home
