"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { LogIn, Save, ShieldCheck } from "lucide-react";
import { type Session } from "@supabase/supabase-js";
import { isAuthRequired, usernameToEmail } from "@/lib/auth";
import { normalizeRole, type UserRole } from "@/lib/access";
import { players } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { FootballLogo } from "@/components/football-logo";

const localProfileStorageKey = "korasmart-local-profile-v1";
const localUsersStorageKey = "korasmart-local-users-v1";
const localProfileChangedEvent = "korasmart-local-profile-changed";

export type MemberProfile = {
  id: string;
  name: string;
  username: string | null;
  avatar_preset: string | null;
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

type RpcProfile = {
  id?: string;
  name?: string;
  username?: string | null;
  avatar_preset?: string | null;
  must_change_password?: boolean | null;
  role?: string | null;
};

const normalizeLocalUsername = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

const defaultLocalUsers = players.map((player, index) => ({
  username: normalizeLocalUsername(player.name),
  password: "kora2026",
  playerName: player.name,
  avatarPreset: `/images/avatars/avatar-${String((index % 20) + 1).padStart(2, "0")}.png`
}));

const authTimeoutMs = 8000;

async function withAuthTimeout<T>(promise: Promise<T>, label: string, timeoutMs = authTimeoutMs) {
  return await Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(`${label} timed out. Check your connection and try again.`)), timeoutMs);
    })
  ]);
}

function readLocalLoggedIn() {
  if (typeof window === "undefined") return false;

  try {
    const saved = window.localStorage.getItem(localProfileStorageKey);
    if (!saved) return false;
    return Boolean((JSON.parse(saved) as { loggedIn?: boolean }).loggedIn);
  } catch {
    window.localStorage.removeItem(localProfileStorageKey);
    return false;
  }
}

async function loadRemoteProfile(userId: string) {
  if (!supabase) return null;

  const rpcProfile = await supabase.rpc("korasmart_get_my_profile").maybeSingle();
  const rpcData = rpcProfile.data as RpcProfile | null;
  if (!rpcProfile.error && rpcData?.id && rpcData.name) {
    return {
      id: rpcData.id,
      name: rpcData.name,
      username: rpcData.username || null,
      avatar_preset: rpcData.avatar_preset || null,
      must_change_password: rpcData.must_change_password ?? false,
      user_roles: [{ role: rpcData.role || "player" }]
    };
  }

  const baseSelect = "id, name, username, must_change_password, user_roles(role)";
  const { data: sessionData } = await supabase.auth.getSession();
  const emailUsername = sessionData.session?.user.email?.split("@")[0]?.toLowerCase();
  const withAvatar = await supabase
    .from("players")
    .select(`id, name, username, avatar_preset, must_change_password, user_roles(role)`)
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (!withAvatar.error) return withAvatar.data;

  const fallback = await supabase
    .from("players")
    .select(baseSelect)
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (fallback.data) return { ...fallback.data, avatar_preset: null };

  if (!emailUsername) return null;

  const byUsernameWithAvatar = await supabase
    .from("players")
    .select(`id, name, username, avatar_preset, must_change_password, user_roles(role)`)
    .eq("username", emailUsername)
    .maybeSingle();

  if (!byUsernameWithAvatar.error && byUsernameWithAvatar.data) return byUsernameWithAvatar.data;

  const byUsernameFallback = await supabase
    .from("players")
    .select(baseSelect)
    .eq("username", emailUsername)
    .maybeSingle();

  return byUsernameFallback.data ? { ...byUsernameFallback.data, avatar_preset: null } : null;
}

function LoginForm({ onLocalLogin }: { onLocalLogin?: (username: string, password: string) => boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    if (onLocalLogin) {
      const success = onLocalLogin(username, password);
      if (!success) setError("Username or password is not correct.");
      setSubmitting(false);
      return;
    }

    if (!supabase) {
      setError("Login is not configured yet.");
      setSubmitting(false);
      return;
    }

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
            placeholder="username"
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
            placeholder="password"
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
        <p className="mt-2 text-sm leading-6 text-white/68">Welcome back. Choose a private password before entering KoraSmart.</p>

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

function ProfileLinkError({ onSignOut }: { onSignOut: () => Promise<void> }) {
  return (
    <main className="field-bg grid min-h-screen place-items-center px-4 py-10">
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.86),rgba(255,255,255,.54),rgba(255,255,255,.18))]" />
      <section className="relative w-full max-w-md rounded-[28px] border border-white/70 bg-white/75 p-6 text-slate-950 shadow-[0_24px_70px_rgba(2,12,27,.2)] backdrop-blur-[20px]">
        <FootballLogo compact />
        <h1 className="mt-8 text-3xl font-black text-slate-950">Profile not linked</h1>
        <p className="mt-3 text-sm leading-6 font-semibold text-slate-600">
          This login exists, but it is not connected to a KoraSmart player profile yet.
        </p>
        <button
          onClick={onSignOut}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#3dad3d] font-black text-white shadow-[0_12px_24px_rgba(47,158,47,.22)] transition hover:bg-[#319c31]"
        >
          Back to sign in
        </button>
      </section>
    </main>
  );
}

function ConnectionErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <main className="field-bg grid min-h-screen place-items-center px-4 py-10">
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.86),rgba(255,255,255,.54),rgba(255,255,255,.18))]" />
      <section className="relative w-full max-w-md rounded-[28px] border border-white/70 bg-white/78 p-6 text-slate-950 shadow-[0_24px_70px_rgba(2,12,27,.2)] backdrop-blur-[20px]">
        <FootballLogo compact />
        <h1 className="mt-8 text-3xl font-black text-slate-950">Connection problem</h1>
        <p className="mt-3 text-sm leading-6 font-semibold text-slate-600">{message}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={onRetry}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#3dad3d] px-5 font-black text-white shadow-[0_12px_24px_rgba(47,158,47,.22)] transition hover:bg-[#319c31]"
          >
            Try again
          </button>
          <a
            href="/network-check"
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 font-black text-slate-950 transition hover:bg-slate-50"
          >
            Network check
          </a>
        </div>
      </section>
    </main>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase && isAuthRequired));
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileLoadComplete, setProfileLoadComplete] = useState(false);
  const [localLoggedIn, setLocalLoggedIn] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const isNetworkCheck = pathname === "/network-check";

  useEffect(() => {
    if (supabase && isAuthRequired) return;

    const syncLocalLogin = () => setLocalLoggedIn(readLocalLoggedIn());
    syncLocalLogin();
    window.addEventListener("storage", syncLocalLogin);
    window.addEventListener(localProfileChangedEvent, syncLocalLogin);

    return () => {
      window.removeEventListener("storage", syncLocalLogin);
      window.removeEventListener(localProfileChangedEvent, syncLocalLogin);
    };
  }, []);

  useEffect(() => {
    if (!supabase || !isAuthRequired) {
      setLoading(false);
      return;
    }

    const client = supabase;

    const loadSession = async () => {
      try {
        setConnectionError("");
        const { data } = await withAuthTimeout(client.auth.getSession(), "Login session check");
        setSession(data.session);
      } catch (error) {
        setConnectionError(error instanceof Error ? error.message : "Could not connect to KoraSmart login.");
      } finally {
        setLoading(false);
      }
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
        setProfileLoadComplete(false);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      setProfileLoadComplete(false);

      let data = null;
      try {
        setConnectionError("");
        data = await withAuthTimeout(loadRemoteProfile(session.user.id), "Player profile check");
      } catch (error) {
        if (!cancelled) {
          setConnectionError(error instanceof Error ? error.message : "Could not load your player profile.");
          setProfileLoadComplete(false);
          setProfileLoading(false);
        }
        return;
      }

      const roles = Array.isArray(data?.user_roles) ? data.user_roles.map((item: { role?: string }) => item.role) : [];
      const role = roles.includes("superuser")
        ? "superuser"
        : roles.includes("admin")
          ? "admin"
          : roles.includes("budgeting_booking_officer")
            ? "budgeting_booking_officer"
            : "player";

      if (!cancelled) {
        setProfile(data ? { ...data, role: normalizeRole(role) } : null);
        setProfileLoadComplete(true);
        setProfileLoading(false);
      }
    }

    loadProfile();

    const client = supabase;
    if (!client || !session?.user.id) return;

    const channel = client
      .channel(`korasmart-profile-${session.user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `auth_user_id=eq.${session.user.id}` },
        () => {
          void loadProfile();
        }
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "user_roles" }, () => {
        void loadProfile();
      })
      .subscribe();

    return () => {
      cancelled = true;
      void client.removeChannel(channel);
    };
  }, [session?.user.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      signOut: async () => {
        await supabase?.auth.signOut();
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(localProfileStorageKey);
          window.dispatchEvent(new Event(localProfileChangedEvent));
        }
      }
    }),
    [loading, profile, session]
  );

  if (isNetworkCheck) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  if (loading) {
    return <main className="field-bg grid min-h-screen place-items-center text-lg font-black text-lime-300">Loading KoraSmart...</main>;
  }

  if (connectionError) {
    return <ConnectionErrorScreen message={connectionError} onRetry={() => window.location.reload()} />;
  }

  if (supabase && isAuthRequired && !session) {
    return <LoginForm />;
  }

  if (supabase && isAuthRequired && session && !profile && (profileLoading || !profileLoadComplete)) {
    return <main className="field-bg grid min-h-screen place-items-center text-lg font-black text-lime-300">Loading player profile...</main>;
  }

  if (supabase && isAuthRequired && session && profileLoadComplete && !profile) {
    return <ProfileLinkError onSignOut={value.signOut} />;
  }

  if ((!supabase || !isAuthRequired) && !localLoggedIn) {
    return (
      <LoginForm
        onLocalLogin={(username, password) => {
          const normalizedUsername = normalizeLocalUsername(username);
          const users = (() => {
            try {
              const saved = window.localStorage.getItem(localUsersStorageKey);
              if (!saved) {
                window.localStorage.setItem(localUsersStorageKey, JSON.stringify(defaultLocalUsers));
                return defaultLocalUsers;
              }
              return JSON.parse(saved) as { username: string; password: string; playerName: string; avatarPreset: string }[];
            } catch {
              return defaultLocalUsers;
            }
          })();
          const user = users.find((item) => item.username === normalizedUsername && item.password === password);
          if (!user) return false;

          window.localStorage.setItem(
            localProfileStorageKey,
            JSON.stringify({
              username: user.username,
              playerName: user.playerName,
              displayName: user.playerName,
              avatarDataUrl: "",
              avatarPreset: user.avatarPreset,
              loggedIn: true
            })
          );
          window.dispatchEvent(new Event(localProfileChangedEvent));
          setLocalLoggedIn(true);
          return true;
        }}
      />
    );
  }

  if (supabase && isAuthRequired && profile?.must_change_password) {
    return <ChangePasswordForm profile={profile} />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
