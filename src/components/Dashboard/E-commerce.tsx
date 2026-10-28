"use client";

import { RefreshCw, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DashboardData = {
  type: "error" | "success";
  totalUsers: number;
};

const numberFormat = new Intl.NumberFormat();

export default function ECommerce({ data: initialData }: { data: DashboardData }) {
  const router = useRouter();
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [connection, setConnection] = useState<"live" | "reconnecting">("live");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let stopped = false;
    let timer: number | undefined;

    const refresh = () => {
      if (stopped || document.visibilityState !== "visible") return;
      setRefreshing(true);
      router.refresh();
      setUpdatedAt(new Date());
      setConnection("live");
      setRefreshing(false);
    };

    timer = window.setInterval(refresh, 3000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stopped = true;
      if (timer) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-[6in] space-y-3 pb-4">
      <section className="flex h-[0.2in] min-h-[0.2in] items-center justify-between gap-2 overflow-hidden rounded-md bg-gradient-to-r from-slate-950 to-indigo-950 px-2 text-white shadow-sm">
        <h1 className="truncate text-[11px] font-semibold leading-none">Dashboard</h1>
        <div className="flex min-w-0 items-center gap-1.5">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${connection === "live" ? "bg-emerald-400" : "bg-amber-300"}`} />
          <p className="truncate text-[10px] leading-none text-slate-200">
            {connection === "live" ? "Live" : "Reconnecting"}{updatedAt ? ` · ${updatedAt.toLocaleTimeString()}` : " · checking"}
          </p>
          <button type="button" onClick={() => router.refresh()} disabled={refreshing} aria-label="Refresh dashboard" title="Refresh now" className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-slate-200 transition hover:bg-white/10 disabled:opacity-60">
            <RefreshCw aria-hidden="true" className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </section>
      <article className="flex min-h-16 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-strokedark dark:bg-boxdark" aria-label="Account total">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Accounts</p>
          <p className="mt-0.5 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{numberFormat.format(initialData.totalUsers || 0)}</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-primary dark:bg-indigo-950/40"><Users className="h-4 w-4" aria-hidden="true" /></span>
      </article>
    </main>
  );
}
