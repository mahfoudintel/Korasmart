"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, ChevronDown, LogIn, LogOut, Save } from "lucide-react";
import { useLocalProfile } from "@/hooks/use-local-profile";

const avatarPresets = Array.from({ length: 20 }, (_, index) => `/images/avatars/avatar-${String(index + 1).padStart(2, "0")}.png`);

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { profile, updateProfile, loginWithCredentials, logout } = useLocalProfile();
  const inputRef = useRef<HTMLInputElement | null>(null);

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
  const submitLogin = () => {
    const success = loginWithCredentials(username, password);
    if (!success) {
      setLoginError("Invalid username or password.");
      return;
    }

    setLoginError("");
    setPassword("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 pr-3 text-left text-white backdrop-blur-xl"
      >
        <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-lime-300 bg-gradient-to-br from-white to-zinc-500 text-lg font-black text-black">
          {avatarSrc ? (
            <Image src={avatarSrc} alt={profile.displayName} fill sizes="40px" className="object-cover" />
          ) : (
            initials
          )}
        </span>
        <span className="hidden leading-tight sm:block">
          <span className="block max-w-28 truncate text-sm font-black">{profile.loggedIn ? profile.displayName : "Logged out"}</span>
          <span className="block text-xs text-white/55">{profile.loggedIn ? "Local profile" : "Tap to login"}</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-white/70 sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-[20px] border border-white/10 bg-[#10190f]/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
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
              <p className="text-sm font-black text-white">Player profile</p>
              <span className="mt-2 inline-flex rounded-full bg-lime-300/15 px-3 py-1 text-xs font-black text-lime-300">
                {profile.loggedIn ? "Logged in" : "Logged out"}
              </span>
            </div>
          </div>

          {profile.loggedIn && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={logout} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-orange-300/50 bg-orange-400/12 px-4 text-sm font-black text-orange-100 shadow-[0_0_18px_rgba(251,146,60,.12)] transition hover:bg-orange-400 hover:text-black">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
              <button onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-lime-300 px-4 text-sm font-black text-black shadow-[0_0_22px_rgba(190,255,64,.22)] transition hover:bg-lime-200">
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
                  <p className="text-xs font-bold text-white/65">Choose avatar</p>
                  <div className="mt-2 grid max-h-44 grid-cols-5 gap-2 overflow-y-auto rounded-2xl border border-white/10 bg-white/[.04] p-2">
                    {avatarPresets.map((avatar) => {
                      const active = !profile.avatarDataUrl && profile.avatarPreset === avatar;

                      return (
                        <button
                          key={avatar}
                          onClick={() => updateProfile({ avatarPreset: avatar, avatarDataUrl: "" })}
                          className={`relative aspect-square overflow-hidden rounded-full border-2 ${active ? "border-lime-300" : "border-white/10"}`}
                          title="Choose avatar"
                        >
                          <Image src={avatar} alt="Soccer avatar" fill sizes="56px" className="object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[.05] p-3">
                  <p className="text-xs font-bold text-white/65">Player</p>
                  <p className="mt-1 font-black text-white">{profile.playerName}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">Assigned to this login.</p>
                </div>

                <label className="text-xs font-bold text-white/65">
                  Display name
                  <input
                    value={profile.displayName}
                    onChange={(event) => updateProfile({ displayName: event.target.value })}
                    className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-3 font-black text-white outline-none"
                  />
                </label>
              </div>

            </>
          ) : (
            <div className="mt-4 grid gap-3">
              <label className="text-xs font-bold text-white/65">
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="najib"
                  className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-3 font-black text-white outline-none placeholder:text-white/35"
                />
              </label>
              <label className="text-xs font-bold text-white/65">
                Password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && submitLogin()}
                  type="password"
                  placeholder="kora2026"
                  className="mt-2 h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-3 font-black text-white outline-none placeholder:text-white/35"
                />
              </label>
              {loginError && <p className="rounded-2xl border border-orange-300/20 bg-orange-300/10 p-3 text-xs font-bold text-orange-200">{loginError}</p>}
              <p className="rounded-2xl bg-white/[.05] p-3 text-xs leading-relaxed text-white/55">
                Prototype login: username is the player name without spaces, password is kora2026.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setOpen(false)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-4 text-sm font-black text-white/82">
                  Cancel
                </button>
                <button onClick={submitLogin} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-lime-300 px-4 text-sm font-black text-black">
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              </div>
            </div>
          )}

          {profile.loggedIn && (
            <p className="mt-4 rounded-2xl bg-white/[.05] p-3 text-xs font-bold text-white/58">
              Attendance uses this profile automatically.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
