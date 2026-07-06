"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, WifiOff, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type CheckStatus = "idle" | "running" | "ok" | "fail";

type CheckResult = {
  label: string;
  status: CheckStatus;
  detail: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

async function withTimeout(input: RequestInfo | URL, init?: RequestInit, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === "ok") return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (status === "fail") return <XCircle className="h-5 w-5 text-red-600" />;
  if (status === "running") return <RefreshCw className="h-5 w-5 animate-spin text-slate-500" />;
  return <WifiOff className="h-5 w-5 text-slate-400" />;
}

function CheckRow({ result }: { result: CheckResult }) {
  return (
    <li className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <StatusIcon status={result.status} />
        <div>
          <p className="font-black text-slate-950">{result.label}</p>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{result.detail}</p>
        </div>
      </div>
    </li>
  );
}

export default function NetworkCheckPage() {
  const [results, setResults] = useState<CheckResult[]>([]);
  const [running, setRunning] = useState(false);

  const supabaseHost = useMemo(() => {
    if (!supabaseUrl) return "Not configured";
    try {
      return new URL(supabaseUrl).host;
    } catch {
      return "Invalid URL";
    }
  }, []);

  const runChecks = useCallback(async () => {
    setRunning(true);
    const next: CheckResult[] = [];

    next.push({
      label: "Browser network",
      status: navigator.onLine ? "ok" : "fail",
      detail: navigator.onLine ? "The browser says this device is online." : "The browser says this device is offline."
    });

    try {
      const response = await withTimeout("/", { cache: "no-store" });
      next.push({
        label: "KoraSmart / Vercel",
        status: response.ok ? "ok" : "fail",
        detail: `App origin answered with HTTP ${response.status}.`
      });
    } catch (error) {
      next.push({
        label: "KoraSmart / Vercel",
        status: "fail",
        detail: error instanceof Error ? error.message : "Could not reach the app origin."
      });
    }

    if (!supabaseUrl || !supabase) {
      next.push({
        label: "Supabase configuration",
        status: "fail",
        detail: "NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in Vercel."
      });
    } else {
      next.push({
        label: "Supabase configuration",
        status: "ok",
        detail: `Configured host: ${supabaseHost}.`
      });

      try {
        const response = await withTimeout(`${supabaseUrl}/auth/v1/health`, { cache: "no-store" });
        next.push({
          label: "Supabase Auth reachability",
          status: response.ok ? "ok" : "fail",
          detail: `Supabase Auth answered with HTTP ${response.status}.`
        });
      } catch (error) {
        next.push({
          label: "Supabase Auth reachability",
          status: "fail",
          detail: error instanceof Error ? error.message : "Could not reach Supabase Auth."
        });
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        next.push({
          label: "Current login session",
          status: error ? "fail" : "ok",
          detail: error ? error.message : data.session ? `Logged in as ${data.session.user.email || "a Supabase user"}.` : "No active login session on this browser."
        });

        if (data.session) {
          const profile = await supabase.rpc("korasmart_get_my_profile").maybeSingle();
          next.push({
            label: "KoraSmart profile link",
            status: profile.error || !profile.data ? "fail" : "ok",
            detail: profile.error ? profile.error.message : profile.data ? "The logged-in user is linked to a player profile." : "No player profile returned for this login."
          });
        }
      } catch (error) {
        next.push({
          label: "Supabase session check",
          status: "fail",
          detail: error instanceof Error ? error.message : "Could not read the Supabase session."
        });
      }
    }

    setResults(next);
    setRunning(false);
  }, [supabaseHost]);

  useEffect(() => {
    void runChecks();
  }, [runChecks]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,.16)] backdrop-blur-[20px] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-green-700">Network check</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">KoraSmart connection</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
              Open this page on home Wi-Fi and mobile data. The failed row tells us which service the network cannot reach.
            </p>
          </div>
          <button
            onClick={runChecks}
            disabled={running}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#3dad3d] px-5 font-black text-white shadow-[0_12px_24px_rgba(47,158,47,.22)] transition hover:bg-[#319c31] disabled:opacity-60"
          >
            <RefreshCw className={`h-5 w-5 ${running ? "animate-spin" : ""}`} />
            Run again
          </button>
        </div>

        <dl className="mt-6 grid gap-3 rounded-2xl border border-white/70 bg-white/55 p-4 text-sm font-semibold text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Current URL</dt>
            <dd className="mt-1 break-all text-slate-950">{typeof window === "undefined" ? "" : window.location.href}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Supabase host</dt>
            <dd className="mt-1 break-all text-slate-950">{supabaseHost}</dd>
          </div>
        </dl>

        <ul className="mt-6 grid gap-3">
          {(results.length ? results : [{ label: "Checks", status: "running" as CheckStatus, detail: "Running connection checks..." }]).map((result) => (
            <CheckRow key={result.label} result={result} />
          ))}
        </ul>
      </section>
    </main>
  );
}
