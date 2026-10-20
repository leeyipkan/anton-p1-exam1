import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sunny Class 小一英文溫習",
  description: "根據小一英文 Unit 1 至 Unit 4 範圍整理嘅生字、句型同練習。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK" className={`${nunito.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
