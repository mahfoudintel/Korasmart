"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Trash2, UserRound, Users, X } from "lucide-react";
import { players } from "@/lib/data";
import { useChat } from "@/hooks/use-chat";
import { useLocalProfile } from "@/hooks/use-local-profile";
import { useLanguage } from "@/components/language-provider";
import { translateText } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { useOutsideDismiss } from "@/hooks/use-outside-dismiss";

function formatChatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function ChatDock() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [activeConversationId, setActiveConversationId] = useState("team");
  const [groupSelection, setGroupSelection] = useState<string[]>([]);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const closeDock = useCallback(() => setOpen(false), []);
  const { messages, ownPlayerName, loggedIn, sendMessage, deleteMessage } = useChat();
  const { profile } = useLocalProfile();
  const { language } = useLanguage();

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, open, activeConversationId]);
  useOutsideDismiss(dockRef, open, closeDock);

  const directConversations = players
    .filter((player) => player.name !== profile.playerName)
    .map((player) => {
      const members = [profile.playerName, player.name].sort();
      return {
        id: `direct:${members.join(":")}`,
        label: player.name,
        recipients: members
      };
    });

  const groupMembers = Array.from(new Set([profile.playerName, ...groupSelection])).sort();
  const groupConversation = groupSelection.length
    ? {
        id: `group:${groupMembers.join(":")}`,
        label: `${translateText("Group", language)} (${groupSelection.length + 1})`,
        recipients: groupMembers
      }
    : null;

  const activeConversation =
    activeConversationId === "team"
      ? { id: "team", label: "Team chat", recipients: players.map((player) => player.name) }
      : groupConversation?.id === activeConversationId
        ? groupConversation
        : directConversations.find((conversation) => conversation.id === activeConversationId) || { id: "team", label: "Team chat", recipients: players.map((player) => player.name) };

  const visibleMessages = messages.filter((message) => message.conversationId === activeConversation.id);

  const submitMessage = (event: FormEvent) => {
    event.preventDefault();
    if (sendMessage(draft, activeConversation.id, activeConversation.recipients)) setDraft("");
  };

  return (
    <div ref={dockRef} className="fixed bottom-24 right-0 z-40 lg:bottom-8">
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group flex h-16 w-16 items-center gap-3 rounded-l-[22px] border border-r-0 border-black/20 bg-lime-300 px-4 text-black shadow-[0_0_34px_rgba(190,255,64,.55)] ring-4 ring-lime-300/20 backdrop-blur-xl transition-all hover:w-52",
          open && "hidden"
        )}
        title="Team chat"
      >
        <span className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-orange-500 text-[11px] font-black text-white">{messages.length}</span>
        <MessageCircle className="h-7 w-7 shrink-0" />
        <span className="hidden whitespace-nowrap text-sm font-black opacity-0 transition group-hover:opacity-100 sm:block">Open chat</span>
      </button>

      {open && (
        <div className="relative mr-3 grid h-[min(720px,calc(100vh-7rem))] w-[min(1040px,calc(100vw-1.5rem))] overflow-hidden rounded-[22px] border border-white/12 bg-[#10190f]/95 shadow-2xl backdrop-blur-xl lg:grid-cols-[300px_minmax(0,1fr)]">
          <button
            onClick={closeDock}
            className="absolute right-3 top-3 z-20 inline-flex h-11 items-center gap-2 rounded-full border border-orange-300/45 bg-black/65 px-4 text-sm font-black text-orange-100 shadow-[0_0_24px_rgba(251,146,60,.22)] backdrop-blur-xl transition hover:border-orange-200 hover:bg-orange-400 hover:text-black"
            aria-label="Close chat"
            title="Close chat"
          >
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">Close</span>
          </button>

          <aside className="hidden min-h-0 border-r border-white/10 bg-white/[.04] p-4 lg:flex lg:flex-col">
            <div className="flex items-center justify-between gap-2 pr-24">
              <div>
                <p className="text-sm font-black text-white">Team chat</p>
                <p className="text-xs text-white/50">Private or group messages</p>
              </div>
            </div>

            <button
              onClick={() => setActiveConversationId("team")}
              className={cn("mt-4 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-black", activeConversation.id === "team" ? "bg-lime-300 text-black" : "bg-white/[.05] text-white/82")}
            >
              <Users className="h-5 w-5" />
              Team chat
            </button>

            {groupConversation && (
              <button
                onClick={() => setActiveConversationId(groupConversation.id)}
                className={cn("mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-black", activeConversation.id === groupConversation.id ? "bg-lime-300 text-black" : "bg-white/[.05] text-white/82")}
              >
                <MessageCircle className="h-5 w-5" />
                {groupConversation.label}
              </button>
            )}

            <p className="mt-4 text-xs font-black uppercase text-white/45">Direct messages</p>
            <div className="mt-2 space-y-1 overflow-y-auto pr-1">
              {players.map((player) => {
                const online = loggedIn && player.name === profile.playerName;
                const direct = directConversations.find((conversation) => conversation.recipients.includes(player.name));
                const isSelf = player.name === profile.playerName;

                return (
                  <button
                    key={player.name}
                    disabled={isSelf}
                    onClick={() => direct && setActiveConversationId(direct.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-white/78 transition",
                      direct && activeConversation.id === direct.id && "bg-lime-300/15 text-lime-200",
                      isSelf ? "cursor-default opacity-70" : "hover:bg-white/[.06]"
                    )}
                  >
                    <span className={cn("h-2.5 w-2.5 rounded-full", online ? "bg-lime-300 shadow-[0_0_12px_rgba(190,255,64,.75)]" : "bg-white/25")} />
                    <span className="min-w-0 flex-1 truncate font-bold">{player.name}</span>
                    <span className={cn("text-[10px] font-black uppercase", online ? "text-lime-300" : "text-white/35")}>
                      {online ? "Online" : "Offline"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.04] p-3">
              <p className="text-xs font-black uppercase text-white/55">New group</p>
              <div className="mt-2 grid max-h-28 gap-1 overflow-y-auto pr-1">
                {players.filter((player) => player.name !== profile.playerName).map((player) => (
                  <label key={player.name} className="flex items-center gap-2 rounded-xl px-2 py-1 text-xs font-bold text-white/72">
                    <input
                      type="checkbox"
                      checked={groupSelection.includes(player.name)}
                      onChange={(event) => {
                        setGroupSelection((current) =>
                          event.target.checked ? [...current, player.name] : current.filter((name) => name !== player.name)
                        );
                      }}
                      className="accent-lime-300"
                    />
                    {player.name}
                  </label>
                ))}
              </div>
              <button
                disabled={!groupConversation}
                onClick={() => groupConversation && setActiveConversationId(groupConversation.id)}
                className="mt-3 h-9 w-full rounded-full bg-lime-300 text-xs font-black text-black disabled:bg-white/10 disabled:text-white/35"
              >
                Open group chat
              </button>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col">
            <header className="flex items-center justify-between gap-3 border-b border-white/10 p-4 pr-28">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-lime-300/20 text-lime-300">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black text-white">{activeConversation.label}</p>
                  <p className="text-xs text-white/50">{visibleMessages.length} <span>messages</span></p>
                </div>
              </div>
            </header>

            <div className="border-b border-white/10 p-3 lg:hidden">
              <div className="flex gap-2 overflow-x-auto">
                {[{ name: "Team chat" }, ...players].map((player) => {
                  if (player.name === "Team chat") {
                    return (
                      <button key="team-mobile" onClick={() => setActiveConversationId("team")} className={cn("inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-black", activeConversation.id === "team" ? "bg-lime-300 text-black" : "bg-white/[.05] text-white/75")}>
                        Team chat
                      </button>
                    );
                  }
                  const online = loggedIn && player.name === profile.playerName;
                  const direct = directConversations.find((conversation) => conversation.recipients.includes(player.name));

                  return (
                    <button key={player.name} disabled={player.name === profile.playerName} onClick={() => direct && setActiveConversationId(direct.id)} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-2 text-xs font-black text-white/75 disabled:opacity-60">
                      <span className={cn("h-2 w-2 rounded-full", online ? "bg-lime-300" : "bg-white/25")} />
                      {player.name}
                    </button>
                  );
                })}
              </div>
              <details className="mt-3 rounded-2xl border border-white/10 bg-white/[.04] p-3">
                <summary className="cursor-pointer text-xs font-black uppercase text-white/65">New group</summary>
                <div className="mt-3 grid max-h-32 grid-cols-2 gap-1 overflow-y-auto">
                  {players.filter((player) => player.name !== profile.playerName).map((player) => (
                    <label key={player.name} className="flex items-center gap-2 rounded-xl px-2 py-1 text-xs font-bold text-white/72">
                      <input
                        type="checkbox"
                        checked={groupSelection.includes(player.name)}
                        onChange={(event) => {
                          setGroupSelection((current) =>
                            event.target.checked ? [...current, player.name] : current.filter((name) => name !== player.name)
                          );
                        }}
                        className="accent-lime-300"
                      />
                      {player.name}
                    </label>
                  ))}
                </div>
                <button
                  disabled={!groupConversation}
                  onClick={() => groupConversation && setActiveConversationId(groupConversation.id)}
                  className="mt-3 h-9 w-full rounded-full bg-lime-300 text-xs font-black text-black disabled:bg-white/10 disabled:text-white/35"
                >
                  Open group chat
                </button>
              </details>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {visibleMessages.length ? (
                visibleMessages.map((message) => {
                  const own = message.playerName === ownPlayerName;

                  return (
                    <div key={message.id} className={cn("flex gap-3", own && "justify-end")}>
                      {!own && (
                        <div className="h-9 w-9 shrink-0 rounded-full border border-white/15 bg-cover bg-center" style={{ backgroundImage: message.avatarSrc ? `url(${message.avatarSrc})` : undefined }}>
                          {!message.avatarSrc && <UserRound className="m-2 h-5 w-5 text-white/60" />}
                        </div>
                      )}
                      <div className={cn("max-w-[82%] rounded-[18px] border p-3", own ? "border-lime-300/25 bg-lime-300/15" : "border-white/10 bg-white/[.06]")}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-black text-white">{message.displayName}</p>
                          <span className="text-[11px] font-bold text-white/45">{formatChatTime(message.createdAt)}</span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-white/78">{message.body}</p>
                        {own && (
                          <button onClick={() => deleteMessage(message.id)} className="mt-2 inline-flex items-center gap-1 text-[11px] font-black text-white/45 hover:text-orange-200">
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <MessageCircle className="mx-auto h-10 w-10 text-lime-300" />
                    <p className="mt-3 font-black text-white">No messages yet.</p>
                    <p className="mt-1 text-sm text-white/55">Start the first team conversation.</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={submitMessage} className="border-t border-white/10 p-4">
              <div className="flex gap-3">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={!loggedIn}
                  rows={2}
                  maxLength={600}
                  placeholder={translateText("Write a message", language)}
                  className="min-h-14 flex-1 resize-none rounded-[18px] border border-white/12 bg-white/[.06] px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/35 focus:border-lime-300/45 disabled:opacity-50"
                />
                <button
                  disabled={!loggedIn || !draft.trim()}
                  className="inline-flex min-h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-lime-300 text-black hover:bg-lime-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
                  title="Send"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
