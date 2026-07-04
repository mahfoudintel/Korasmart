"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LogIn, Save, ShieldCheck } from "lucide-react";
import { type Session } from "@supabase/supabase-js";
import { isAuthRequired, usernameToEmail } from "@/lib/auth";
import { normalizeRole, type UserRole } from "@/lib/access";
import { supabase } from "@/lib/supabase";
import { FootballLogo } from "@/components/football-logo";

export type MemberProfile = {
  id: string;
  name: string;
  username: string | null;
  role: UserRole;
  must_change_password: boolean | null;
};

type AuthContextValue = {
  session: Session | null;
  profile: MemberProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  profile: null,
  loading: true,
  signOut: async () => undefined
});

export const useAuth = () => useContext(AuthContext);

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    setSubmitting(true);
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(username),
      password
    });

    if (loginError) {
      setError("Username or password is not correct.");
    }

    setSubmitting(false);
  };

  return (
    <main className="field-bg grid min-h-screen place-items-center px-4 py-10">
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.86),rgba(255,255,255,.54),rgba(255,255,255,.18))]" />
      <form onSubmit={login} className="relative w-full max-w-md rounded-[28px] border border-white/70 bg-white/70 p-6 text-slate-950 shadow-[0_24px_70px_rgba(2,12,27,.2)] backdrop-blur-[20px]">
        <div className="flex items-center justify-between gap-4">
          <FootballLogo compact />
          <div className="grid h-12 w-12 place-items-center rounded-full bg-lime-100 text-[#247e24]">
            <ShieldCheck className="h-7 w-7" />
          </div>
        </div>
        <h1 className="mt-8 text-3xl font-black text-slate-950">Sign in</h1>
        <p className="mt-2 text-sm leading-6 font-semibold text-slate-600">Use your player username and password to enter KoraSmart.</p>

        <label className="mt-6 block text-sm font-bold text-slate-700">
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="mt-2 h-12 w-full rounded-2xl border border-white/80 bg-white/75 px-4 font-black text-slate-950 outline-none focus:border-lime-400"
            placeholder="Najib"
            required
          />
        </label>

        <label className="mt-4 block text-sm font-bold text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="mt-2 h-12 w-full rounded-2xl border border-white/80 bg-white/75 px-4 font-black text-slate-950 outline-none focus:border-lime-400"
            required
          />
        </label>

        {error && <p className="mt-4 rounded-2xl border border-orange-300 bg-orange-50 p-3 text-sm font-bold text-orange-700">{error}</p>}

        <button disabled={submitting} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#3dad3d] font-black text-white shadow-[0_12px_24px_rgba(47,158,47,.22)] transition hover:bg-[#319c31] disabled:opacity-60">
          <LogIn className="h-5 w-5" />
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

function ChangePasswordForm({ profile }: { profile: MemberProfile | null }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !profile) return;

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError("");

    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) {
      setError(passwordError.message);
      setSubmitting(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("players")
      .update({ must_change_password: false })
      .eq("id", profile.id);

    if (profileError) {
      setError("Password changed, but profile update failed. Please contact the admin.");
      setSubmitting(false);
      return;
    }

    window.location.reload();
  };

  return (
    <main className="field-bg grid min-h-screen place-items-center px-4 py-10">
      <form onSubmit={savePassword} className="w-full max-w-md rounded-[28px] border border-white/12 bg-black/35 p-6 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-black text-white">Set Your Password</h1>
        <p className="mt-2 text-sm leading-6 text-white/68">Welcome {profile?.name || "back"}. Choose a private password before entering KoraSmart.</p>

        <label className="mt-6 block text-sm font-bold text-white/72">
          New password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            className="mt-2 h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300"
            required
          />
        </label>

        <label className="mt-4 block text-sm font-bold text-white/72">
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            className="mt-2 h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-black text-white outline-none focus:border-lime-300"
            required
          />
        </label>

        {error && <p className="mt-4 rounded-2xl border border-orange-400/25 bg-orange-400/10 p-3 text-sm font-bold text-orange-200">{error}</p>}

        <button disabled={submitting} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lime-300 font-black text-black transition hover:bg-lime-200 disabled:opacity-60">
          <Save className="h-5 w-5" />
          {submitting ? "Saving..." : "Save password"}
        </button>
      </form>
    </main>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase && isAuthRequired));

  useEffect(() => {
    if (!supabase || !isAuthRequired) {
      setLoading(false);
      return;
    }

    const client = supabase;

    const loadSession = async () => {
      const { data } = await client.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    loadSession();

    const { data: listener } = client.auth.onAuthStateChange((_, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!supabase || !isAuthRequired || !session?.user.id) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("players")
        .select("id, name, username, must_change_password, user_roles(role)")
        .eq("auth_user_id", session.user.id)
        .maybeSingle();

      const roles = Array.isArray(data?.user_roles) ? data.user_roles.map((item: { role?: string }) => item.role) : [];
      const role = roles.includes("superuser")
        ? "superuser"
        : roles.includes("admin")
          ? "admin"
          : roles.includes("budgeting_booking_officer")
            ? "budgeting_booking_officer"
            : "player";

      if (!cancelled) setProfile(data ? { ...data, role: normalizeRole(role) } : null);
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      signOut: async () => {
        await supabase?.auth.signOut();
      }
    }),
    [loading, profile, session]
  );

  if (loading) {
    return <main className="field-bg grid min-h-screen place-items-center text-lg font-black text-lime-300">Loading KoraSmart...</main>;
  }

  if (supabase && isAuthRequired && !session) {
    return <LoginForm />;
  }

  if (supabase && isAuthRequired && profile?.must_change_password) {
    return <ChangePasswordForm profile={profile} />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
