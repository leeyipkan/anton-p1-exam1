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
  title: "Sunny Class Primary 1 English",
  description: "Words, patterns, and games for Primary 1 English Units 1, 2, and 4.",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.ico` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
