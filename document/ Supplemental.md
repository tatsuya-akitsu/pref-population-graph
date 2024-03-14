# 補足資料

## 稼働合計時間

- 画面実装：12h
- 単体テスト実装：11.5h

## 各種参考サイト

**環境構築**

- [`require('node:module')._preloadModules` is not a function.](https://github.com/oven-sh/bun/issues/6227)
  - 当初環境構築をbunで実装していて、単体テスト導入時にこちらのエラーが出てしまった際にissue内のやりとりを参考にしました。

**チャートライブラリ**

- [Reactのチャートライブラリ調査メモ in 2023春](https://zenn.dev/leftletter/articles/cdf3d30b74718c)
- [React+MUI(Material-UI)に合うChartライブラリは？【比較】](https://swamplabo.com/react-chart-libraries/)
  - Chartライブラリについては任意のものを使用ということだったので、トレンドなど調査してみようと思い参考にしました。
- [`<Recharts />`](https://recharts.org/en-US/api/LineChart)
  - 実装にあたり公式を参考にしました。
    - LineChart
    - ResponsiveContainer
    - Legend
    - Tooltip
    - XAxis
    - YAxis

**API**

- [RESAS](https://opendata.resas-portal.go.jp/docs/api/v1/prefectures.html)
  - 取得するAPI部分で、都道府県一覧および人口構成のページを参照しました。

**React**

- [React.memo / useCallback / useMemo の使い方、使い所を理解してパフォーマンス最適化をする](https://qiita.com/soarflat/items/b9d3d17b8ab1f5dbfed2)
  - `useMemo`や`useCallback`部分で認識に不安があったので、参考にしました。
- [React.memoの使い方。パフォーマンスアップ【Reactの学習】](https://usconsort.com/react-memo-typescript/)
  - `React.memo`は使用したことがなかったので、参考にしました。
- [Reactのパフォーマンスチューニングについて勉強したところをまとめてみた](https://watataku-blog.vercel.app/blog/17l_n9b8e0)
  - パフォーマンス・チューニング出来る箇所がないか確認するために参考にしました。
- [React 18のuseEffectの変更点について](https://zenn.dev/takeharu/scraps/d14cf9d4239ec4)
  - useEffectが2回走っている部分について、参考にしました。
  - 今回も正しい解決方法にはなっていないように感じるので、反省点です。

**デザイン**

- [tailwindui](https://tailwindui.com/components)
- [tailwindcss](https://tailwindcss.com/docs/customizing-colors)
  - 画面デザイン実装時に工数削減のため、UIを参考にしました。

**単体テスト**

- [Testing Library](https://testing-library.com/docs/react-testing-library/api)
  - 単体テスト実装時に採用したため、公式を参考にしました。
- [Setting up Jest with Next.js](https://nextjs.org/docs/app/building-your-application/testing/jest)
  - 単体テスト環境構築に際して、公式を参考にしました。
- [Next.js + TypeScript + Jestでテストを実行できる環境を構築する](https://qiita.com/masakiwakabayashi/items/204ed2b32254bbc9a5c1)
  - 単体テスト実装にて、jest.config.tsの記載内容を参考にしました。
- [Jest × React Testing Library テスト内のイベントが state の更新を待ってくれないにハマる](https://chaika.hatenablog.com/entry/2023/08/21/083000)
  - hooksの処理が更新されなかった際に、参考にしました。
- [jest-fetch-mock-react-typescript](https://github.com/mayraamaral/jest-fetch-mock-react-typescript/blob/main/src/App.test.tsx)
  - fetchをモック化する際に[jest-fetch-mock](https://www.npmjs.com/package/jest-fetch-mock)ライブラリ導入を検討していたので、参考にしました。
- [Testing Fetch API Calls In React](https://medium.com/@razita.afrina/testing-fetch-api-calls-in-react-7f047ac2d220)
  - fetchをモック化する際に期待通りに処理できなかった為、参考にしました。
- [JestとReact Testing Libraryで学ぶReactアプリのテスト入門：基礎から応用まで](https://dev-k.hatenablog.com/entry/jest-react-testing-library-react-testing-tutorial#Jest%E3%81%A8RTL%E3%81%AE%E3%83%A2%E3%83%83%E3%82%AF)
  - 画面描画時に発火するAPI通信がテスト上で正常に稼働しなかったため、hooks周りの記法に誤りがあるのではと考え、一部参考にしました。
  - ただ、原因は別であったため採用はしていません。
- [フロントエンドテスト 入門 React Testing Library編](https://zenn.dev/hinoshin/articles/c598b2d5126421#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%95%E3%83%83%E3%82%AF)
  - hooksに関する部分で壁にぶつかった際、こちらを参考にしました。
  - `react-dom/test-utils`からexport出来るメンバーの`act`をこちらを参考に採用しました。
- [How to test React Hooks](https://blog.logrocket.com/test-react-hooks/)
  - React Testing Libraryを用いてのhooks部分のテストについて調査した際に参考にしました。
- [React のテストを書いてたら act で囲んでよーって言われたとき](https://bufferings.hatenablog.com/entry/2021/11/18/015809)
  - 下記エラーが出てしまったため、参考にしました。
  - ただ解決には至れずでした。

```zsh
Warning: An update to Counter inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
    /* fire events that update state */
});
/* assert on the output */
```

- [Next.js使ったプロジェクトでテストを書く](https://zenn.dev/slowhand/articles/7bfe83207b434d)
  - `Enzyme`が使ったことがなく少し気になったので、調べてみました。
- [React Testing LibraryのfireEvent vs. user-event](https://zenn.dev/k_log24/articles/4c1cd37ff0ca50)
  - fireEventとuser-eventについてざっくりとですが、違いを知りたかったので参考にしました。
- [Jestを使ってテストを行う際に、Rechartsが原因で通らなかった時の対処](https://qiita.com/otohusan/items/530b7a645c119ce78daa)
- [Recharts のカスタマイズやエラー対応など](https://zenn.dev/kurosame/scraps/7fd9ab72bcea83)
  - 単体テスト時にRechartsが原因でテストが通らなかったので参考にしました。


## ChatGPTへ投げた箇所

- Recharts使用箇所で、Legendがデータの数分だけ出てしまっていたため質問しました。
  - https://chat.openai.com/share/ed983f5e-9432-4292-9811-3199e07c1058
- Recharts使用箇所で、Legendのデザインを調整したかったので、質問しました。
  - https://chat.openai.com/share/fdd745fe-110f-48e4-a9ad-81421a677ee2
- 配列操作部分で、自身で考案したのですが迷走してしまったため、質問しました。
  - https://chat.openai.com/share/5210a4d8-af81-4e97-98c1-f25ed0cf0c27
- 単体テスト時に都道府県一覧のcheckboxに対するイベントをテストしたく、質問しました。
  - https://chat.openai.com/share/31abb95e-8fae-4d40-94e2-ecb35944b602
- Rechartsが単体テストでコケた際に、質問しました。
  - https://chat.openai.com/share/840be714-347c-4247-be88-652d63129892
