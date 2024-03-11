'use client'
import { Prefectures } from "@/types";
import ListItem from "./components/ListItem";
import React, { useEffect, useRef, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import listStyles from '@/app/styles/listitem.module.css'
import layoutStyles from '@/app/styles/layout.module.css'
import chartsStyles from '@/app/styles/charts.module.css'
import Tab from "./components/Tab";
import useWindowSize from "./hooks/resize";
import { PrefectureNames, colors } from "./constants";
import OriginalLegend from "./components/OriginalLegend";

type ChartsData = {
  [key in Prefectures.Constants.PrefectureName]?: number;
} & {
  color: Array<string>;
  year: number;
};

const Home: React.FC = () => {
  const [pref, setPref] = useState<Prefectures.Response.List>()
  const [population, setPopulation] = useState<Prefectures.Response.Population>()
  const [data, setData] =
    useState<Array<ChartsData>>();
  const [label, setLabel] = useState<Prefectures.Constants.ViewLabel | string>('')
  const [selected, setSelected] = useState<Prefectures.Constants.PrefectureName[]>([])
  const [code, setCode] = useState<string>('')
  const width = useWindowSize()
  const isDevFlg = useRef<boolean>(true)

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

  const onFetchPrefecturePopulation = async () => {
    const res = await fetch(
      `${process.env.RESAS_API_ENDPOINT}/api/v1/population/composition/perYear?cityCode=-&prefCode=${code}`,
      {
        headers: {
          'X-API-KEY': `${process.env.RESAS_API_KEY}`,
        },
      }
    );
    const data: Prefectures.Response.Population = await res.json()
    setPopulation(data)

    const targetLabel: Prefectures.Constants.ViewLabel = data.result.data.filter((d) => d.label === '総人口')[0].label
    onChangePrefectureCategory(targetLabel)
  }

  const onGetPrefectureCode = (value: string) => {
    setCode(value)
  }

  const onChangePrefectureCategory = (value: Prefectures.Constants.ViewLabel) => {
    setLabel(value)
  }

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isDevFlg.current) {
      isDevFlg.current = false;
      return;
    }
    onFetchPrefectureList()

    return () => {
      setPref(undefined)
      setCode('')
    }
  }, [])

  useEffect(() => {
    if (code.length !== 0) {
      onFetchPrefecturePopulation()
    }
  }, [code])

  useEffect(() => {
    if (label.length !== 0 && population) {
      const targetPref = pref?.result.filter((p) => `${p.prefCode}` === code)[0].prefName as Prefectures.Constants.PrefectureName
      setSelected((prev) => [...prev, `${targetPref}`])

      const chartData = population?.result.data
        .filter((d) => d.label === label)[0]
        .data.map((d) => {
          return {
            year: d.year,
            population: d.value,
          };
        });

      setData((prev) => {
        if (prev && prev.length) {
          const data: ChartsData[] = prev.map((item) => {
            return {
              ...item,
              [`${targetPref}`]: chartData.filter(
                (c) => c.year === item.year
              )[0].population,
              color: [
                ...item.color,
                colors[PrefectureNames.indexOf(`${targetPref}`)],
              ],
            };
          })
          return data
        } else {
          const data: ChartsData[] = chartData.map((item) => {
            return {
              year: item.year,
              [`${targetPref}`]: item.population,
              color: [colors[PrefectureNames.indexOf(`${targetPref}`)]],
            };
          })
          return data
        }
      })
    }
  }, [label, population])

  return (
    <main className={layoutStyles.container}>
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
      {data?.length && (
        <React.Fragment>
          <Tab
            current={label}
            onClick={onChangePrefectureCategory}
          />
          <ResponsiveContainer
            className={chartsStyles.charts}
            width={width * 0.75}
            height={width * 0.4}
          >
            <LineChart
              width={width * 0.75}
              height={width * 0.4}
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
                label={{ value: label, position: 'insideLeft', angle: -90, offset: 0 }}
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
