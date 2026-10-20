"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  House,
  Pencil,
  Sparkles,
  Backpack,
  CircleCheck,
} from "lucide-react";
import { cn } from "cn";

const links = [
  { href: "/", label: "主頁", icon: House },
  { href: "/scope", label: "範圍", icon: BookOpen },
  { href: "/learn", label: "生字", icon: Sparkles },
  { href: "/play", label: "練習", icon: Backpack },
  { href: "/quiz", label: "小測", icon: CircleCheck },
  { href: "/write", label: "寫作", icon: Pencil },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-20 border-b border-amber-200/80 bg-[#fff8ec]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-amber-800">
            <span className="grid size-10 place-items-center rounded-2xl bg-amber-300 text-xl">
              ☀️
            </span>
            <span className="leading-tight">
              Sunny Class
              <span className="block text-xs font-semibold text-amber-700/80">
                小一英文溫習
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-bold",
                    active
                      ? "bg-amber-500 text-white"
                      : "text-amber-900 hover:bg-amber-100",
                  )}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-10">{children}</main>
      <nav className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-amber-200 bg-[#fff8ec]/95 backdrop-blur md:hidden">
        <ul className="grid grid-cols-6">
          {links.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold",
                    active ? "text-amber-700" : "text-stone-500",
                  )}
                >
                  <Icon className="size-5" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
