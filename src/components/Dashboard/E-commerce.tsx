"use client";

import { RefreshCw, Users } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type DashboardData = {
  type: "error" | "success";
  totalUsers: number;
};

const numberFormat = new Intl.NumberFormat();

export default function ECommerce({ data }: { data: DashboardData }) {
  const router = useRouter();
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();

  const refreshNow = () => {
    setUpdatedAt(new Date());
    startTransition(() => router.refresh());
  };

  useEffect(() => {
    setUpdatedAt(new Date());

    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      setUpdatedAt(new Date());
      startTransition(() => router.refresh());
    };

    const timer = window.setInterval(refresh, 5000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router, startTransition]);

  return (
    <main className="mx-auto w-full max-w-[6in] space-y-3 pb-5">
      <section className="flex min-h-20 flex-col justify-between gap-3 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-4 py-3 text-white shadow-sm sm:flex-row sm:items-center">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200">Workspace overview</p>
          <h1 className="mt-1 text-lg font-semibold leading-tight">Dashboard</h1>
        </div>
        <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
          <div className="min-w-0 flex-1" aria-live="polite">
            <p className="truncate text-xs font-semibold">{isPending ? "Refreshing" : "Auto-refresh on"}</p>
            <p className="truncate text-[10px] text-slate-300">Every 5 seconds{updatedAt ? " · updated " + updatedAt.toLocaleTimeString() : " · checking"}</p>
          </div>
          <button type="button" onClick={refreshNow} disabled={isPending} aria-label="Refresh dashboard now" title="Refresh now" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-200 transition hover:bg-white/10 disabled:opacity-60">
            <RefreshCw aria-hidden="true" className={"h-3.5 w-3.5 " + (isPending ? "animate-spin" : "")} />
          </button>
        </div>
      </section>

      <article className="flex min-h-[4.5rem] items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-strokedark dark:bg-boxdark" aria-label="Account total">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Accounts</p>
          <p className="mt-1 text-2xl font-semibold leading-none tracking-tight text-slate-900 dark:text-white">{numberFormat.format(data.totalUsers || 0)}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-primary dark:bg-indigo-950/40">
          <Users className="h-4 w-4" aria-hidden="true" />
        </span>
      </article>
    </main>
  );
}
