import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'ress/dist/ress.min.css'
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '都道府県別総人口推移情報',
  description: '株式会社ゆめみ様コーディングテスト課題',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
