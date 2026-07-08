"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Camera, ChevronDown, Eye, KeyRound, LogIn, LogOut, Save, ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { canImpersonate, roleLabels } from "@/lib/access";
import { players } from "@/lib/data";
import { useLocalProfile } from "@/hooks/use-local-profile";
import { useRole } from "@/hooks/use-role";
import { useOutsideDismiss } from "@/hooks/use-outside-dismiss";
import { supabase } from "@/lib/supabase";

const avatarPresets = Array.from({ length: 20 }, (_, index) => `/images/avatars/avatar-${String(index + 1).padStart(2, "0")}.png`);

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordPanelOpen, setPasswordPanelOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [impersonationTarget, setImpersonationTarget] = useState(players[0]?.name || "");
  const { profile, updateProfile, loginWithCredentials, changeLocalPassword, logout, impersonatePlayer, stopImpersonating } = useLocalProfile();
  const { profile: authProfile, session } = useAuth();
  const { role } = useRole();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  useOutsideDismiss(menuRef, open, closeMenu);

  const handleAvatarUpload = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateProfile({ avatarDataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const initials = (profile.displayName || profile.playerName).slice(0, 1).toUpperCase();
  const avatarSrc = profile.avatarDataUrl || profile.avatarPreset;
  const canStartImpersonation = profile.loggedIn && canImpersonate(role) && !profile.impersonatorPlayerName;
  const impersonationOptions = players.filter((player) => player.name !== profile.playerName);
  const effectiveImpersonationTarget = impersonationOptions.some((player) => player.name === impersonationTarget)
    ? impersonationTarget
    : impersonationOptions[0]?.name || "";
  const submitLogin = () => {
    const success = loginWithCredentials(username, password);
    if (!success) {
      setLoginError("Invalid username or password.");
      return;
    }

    setLoginError("");
    setPassword("");
  };
  const saveNewPassword = async () => {
    if (newPassword.length < 8) {
      setPasswordMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage("");

    if (session && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordMessage(error.message);
        setPasswordSaving(false);
        return;
      }

      if (authProfile?.id) {
        await supabase.from("players").update({ must_change_password: false }).eq("id", authProfile.id);
      }
    } else if (!changeLocalPassword(newPassword)) {
      setPasswordMessage("Password could not be changed.");
      setPasswordSaving(false);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("Password updated.");
    setPasswordSaving(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-full border border-white/60 bg-white/78 px-1.5 text-left text-slate-950 shadow-[0_10px_24px_rgba(38,59,28,.1)] backdrop-blur-xl sm:h-12 sm:gap-3 sm:px-2 sm:pr-3"
      >
        <span className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-lime-300 bg-gradient-to-br from-white to-zinc-500 text-sm font-black text-black sm:h-10 sm:w-10 sm:text-lg">
          {avatarSrc ? (
            <Image src={avatarSrc} alt={profile.displayName} fill sizes="(max-width: 640px) 32px, 40px" className="object-cover" />
          ) : (
            initials
          )}
        </span>
          <span className="hidden leading-tight sm:block">
            <span className="block max-w-28 truncate text-sm font-black">{profile.loggedIn ? profile.displayName : "Logged out"}</span>
          <span className="block text-xs text-slate-500">{profile.impersonatorPlayerName ? "Impersonating" : profile.loggedIn ? roleLabels[role] : "Tap to login"}</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-slate-600 sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-[20px] border border-slate-200 bg-white p-4 text-slate-950 shadow-[0_24px_70px_rgba(2,12,27,.24)]">
          <button
            onClick={closeMenu}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Close profile menu"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-4 pr-10">
            <button
              onClick={() => profile.loggedIn && inputRef.current?.click()}
              disabled={!profile.loggedIn}
              className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-lime-300 bg-white text-2xl font-black text-black"
              title="Upload avatar"
            >
              {avatarSrc ? (
                <Image src={avatarSrc} alt={profile.displayName} fill sizes="80px" className="object-cover" />
              ) : (
                initials
              )}
              <span className="absolute bottom-0 left-0 right-0 grid h-7 place-items-center bg-black/55 text-white">
                <Camera className="h-4 w-4" />
              </span>
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-slate-950">Player profile</p>
              <span className="mt-2 inline-flex rounded-full bg-lime-100 px-3 py-1 text-xs font-black text-[#247e24]">
                {profile.impersonatorPlayerName ? `Impersonating ${profile.playerName}` : profile.loggedIn ? "Logged in" : "Logged out"}
              </span>
            </div>
          </div>

          {profile.impersonatorPlayerName && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs font-black uppercase text-amber-700">Impersonation active</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Original user: {profile.impersonatorPlayerName}. You are viewing the app as {profile.playerName}.
              </p>
              <button
                onClick={stopImpersonating}
                className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-black text-white"
              >
                <ShieldCheck className="h-4 w-4" />
                Stop impersonating
              </button>
            </div>
          )}

          {profile.loggedIn && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={logout} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-orange-300/60 bg-orange-100 px-4 text-sm font-black text-orange-700 transition hover:bg-orange-400 hover:text-black">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
              <button onClick={closeMenu} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#49b848] px-4 text-sm font-black text-white shadow-[0_12px_24px_rgba(47,158,47,.2)] transition hover:bg-[#3ca63c]">
                <Save className="h-4 w-4" />
                Done
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleAvatarUpload(event.target.files?.[0])}
          />

          {profile.loggedIn ? (
            <>
              <div className="mt-4 grid gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-600">Choose avatar</p>
                  <div className="mt-2 grid max-h-44 grid-cols-5 gap-2 overflow-y-auto rounded-2xl border border-white/60 bg-white/50 p-2">
                    {avatarPresets.map((avatar) => {
                      const active = !profile.avatarDataUrl && profile.avatarPreset === avatar;

                      return (
                        <button
                          key={avatar}
                          onClick={() => updateProfile({ avatarPreset: avatar, avatarDataUrl: "" })}
                          className={`relative aspect-square overflow-hidden rounded-full border-2 ${active ? "border-lime-500" : "border-white/70"}`}
                          title="Choose avatar"
                        >
                          <Image src={avatar} alt="Soccer avatar" fill sizes="56px" className="object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/60 bg-white/50 p-3">
              <p className="text-xs font-bold text-slate-600">Player</p>
              <p className="mt-1 font-black text-slate-950">{profile.playerName}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">Access: {roleLabels[role]}</p>
                </div>

                {!profile.impersonatorPlayerName && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <button
                      onClick={() => {
                        setPasswordPanelOpen((value) => !value);
                        setPasswordMessage("");
                      }}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-black text-white"
                    >
                      <KeyRound className="h-4 w-4" />
                      Change password
                    </button>

                    {passwordPanelOpen && (
                      <div className="mt-3 grid gap-3">
                        <label className="text-xs font-bold text-slate-600">
                          New password
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            autoComplete="new-password"
                            className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 font-black text-slate-950 outline-none focus:border-lime-400"
                          />
                        </label>
                        <label className="text-xs font-bold text-slate-600">
                          Confirm password
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            autoComplete="new-password"
                            className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 font-black text-slate-950 outline-none focus:border-lime-400"
                          />
                        </label>
                        {passwordMessage && (
                          <p className="rounded-2xl bg-white p-3 text-xs font-bold text-slate-600">{passwordMessage}</p>
                        )}
                        <button
                          onClick={saveNewPassword}
                          disabled={passwordSaving}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#49b848] px-4 text-sm font-black text-white disabled:opacity-60"
                        >
                          <Save className="h-4 w-4" />
                          {passwordSaving ? "Saving..." : "Save password"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {canStartImpersonation && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-bold text-slate-600">Impersonate player</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                      <select
                        value={effectiveImpersonationTarget}
                        onChange={(event) => setImpersonationTarget(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-950 outline-none"
                      >
                        {impersonationOptions.map((player) => (
                          <option key={player.name} value={player.name}>
                            {player.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => effectiveImpersonationTarget && impersonatePlayer(effectiveImpersonationTarget)}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-black text-white"
                      >
                        <Eye className="h-4 w-4" />
                        Impersonate
                      </button>
                    </div>
                  </div>
                )}

                <label className="text-xs font-bold text-slate-600">
                  Display name
                  <input
                    value={profile.displayName}
                    onChange={(event) => updateProfile({ displayName: event.target.value })}
                    className="mt-2 h-11 w-full rounded-2xl border border-white/60 bg-white/60 px-3 font-black text-slate-950 outline-none"
                  />
                </label>
              </div>

            </>
          ) : (
            <div className="mt-4 grid gap-3">
              <label className="text-xs font-bold text-slate-600">
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="username"
                  className="mt-2 h-11 w-full rounded-2xl border border-white/60 bg-white/60 px-3 font-black text-slate-950 outline-none placeholder:text-slate-400"
                />
              </label>
              <label className="text-xs font-bold text-slate-600">
                Password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && submitLogin()}
                  type="password"
                  placeholder="password"
                  className="mt-2 h-11 w-full rounded-2xl border border-white/60 bg-white/60 px-3 font-black text-slate-950 outline-none placeholder:text-slate-400"
                />
              </label>
              {loginError && <p className="rounded-2xl border border-orange-300/40 bg-orange-100 p-3 text-xs font-bold text-orange-700">{loginError}</p>}
              <p className="rounded-2xl bg-white/50 p-3 text-xs leading-relaxed text-slate-500">
                Enter your KoraSmart username and password.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={closeMenu} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/60 bg-white/40 px-4 text-sm font-black text-slate-700">
                  Cancel
                </button>
                <button onClick={submitLogin} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#49b848] px-4 text-sm font-black text-white">
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              </div>
            </div>
          )}

          {profile.loggedIn && (
            <p className="mt-4 rounded-2xl bg-white/50 p-3 text-xs font-bold text-slate-500">
              Attendance uses this profile automatically.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
