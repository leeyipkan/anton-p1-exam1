import Link from "next/link";
import { ReportCard } from "@/components/report-card";

export default function ReportPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm font-extrabold text-amber-700">玩完先睇</p>
        <h1 className="text-4xl font-extrabold text-stone-900">邊類最熟，邊類最易錯</h1>
        <p className="mt-2 max-w-2xl text-lg text-stone-600">
          根據冒險同小測嘅每一次作答。題目重覆出現，錯得多嘅會排喺前面。
        </p>
      </header>
      <ReportCard />
      <Link href="/play" className="inline-flex h-12 items-center rounded-full bg-stone-900 px-6 font-extrabold text-white">
        返去冒險
      </Link>
    </div>
  );
}
