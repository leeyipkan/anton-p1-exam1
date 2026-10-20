import Link from "next/link";
import { ReportCard } from "@/components/report-card";

export default function ReportPage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm font-extrabold text-amber-700">Read this after you play</p>
        <h1 className="text-4xl font-extrabold text-stone-900">Familiar skills and easy misses</h1>
        <p className="mt-2 max-w-2xl text-lg text-stone-600">
          Built from every answer in the dash and the quiz. Questions that come up again, and get missed more often, sit at the top.
        </p>
      </header>
      <ReportCard />
      <Link href="/play" className="inline-flex h-12 items-center rounded-full bg-stone-900 px-6 font-extrabold text-white">
        Back to the dash
      </Link>
    </div>
  );
}
