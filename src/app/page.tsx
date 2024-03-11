'use client'
import { Prefectures } from "@/types";
import ListItem from "./components/ListItem";
import React, { useEffect, useRef, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import listStyles from '@/app/styles/listitem.module.css'
import layoutStyles from '@/app/styles/layout.module.css'
import chartsStyles from '@/app/styles/charts.module.css'
import Tab from "./components/Tab";
import useWindowSize from "./hooks/resize";

type ChartsMap = {
  [key in Prefectures.Constants.ViewLabel]: number;
}

const Home: React.FC = () => {
  const [pref, setPref] = useState<Prefectures.Response.List>()
  const [population, setPopulation] = useState<Prefectures.Response.Population>()
  const [data, setData] =
    useState<Array<{ year: number; } & ChartsMap>>();
  const [label, setLabel] = useState<Prefectures.Constants.ViewLabel | string>('')
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
      const chartData = population?.result.data
        .filter((d) => d.label === label)[0]
        .data.map((d) => {
          return {
            year: d.year,
            [label]: d.value,
          };
        }) as Array<{ year: number } & ChartsMap>;
      console.log(data);
      setData(chartData);
    }
  }, [label, population])

  return (
    <main className={layoutStyles.container}>
      <ul className={listStyles.list}>
        {pref?.result.map((pref, i) => (
          <ListItem
            key={i}
            code={code}
            onChange={onGetPrefectureCode}
            pref={pref}
          />
        ))}
      </ul>
      {data?.length && (
        <React.Fragment>
          <Tab current={label} onClick={onChangePrefectureCategory} />
          <LineChart
            className={chartsStyles.charts}
            width={width * 0.75}
            height={width * 0.4}
            data={data}
          >
            <CartesianGrid />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat('ja-JP', {
                  maximumFractionDigits: 0,
                }).format(+value)
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={label}
              stroke="#8884d8"
            />
          </LineChart>
        </React.Fragment>
      )}
    </main>
  );
}

export default Home
