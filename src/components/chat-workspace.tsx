"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Trash2, UserRound } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { useChat } from "@/hooks/use-chat";
import { useLanguage } from "@/components/language-provider";
import { translateText } from "@/lib/translations";
import { cn } from "@/lib/utils";

function formatChatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function ChatWorkspace() {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { messages, ownPlayerName, loggedIn, sendMessage, deleteMessage } = useChat();
  const { language } = useLanguage();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const submitMessage = (event: FormEvent) => {
    event.preventDefault();
    if (sendMessage(draft)) {
      setDraft("");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="min-h-[620px] p-0">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-lime-300/20 text-lime-300">
              <MessageCircle className="h-7 w-7" />
            </div>
            <div>
              <SectionTitle>Team Chat</SectionTitle>
              <p className="mt-1 text-sm text-white/62">Messages from logged-in players.</p>
            </div>
          </div>
          <span className="rounded-full bg-lime-300/15 px-3 py-1 text-xs font-black text-lime-300">
            {messages.length} <span>messages</span>
          </span>
        </div>

        <div ref={scrollRef} className="h-[440px] space-y-3 overflow-y-auto p-4">
          {messages.length ? (
            messages.map((message) => {
              const own = message.playerName === ownPlayerName;

              return (
                <div key={message.id} className={cn("flex gap-3", own && "justify-end")}>
                  {!own && (
                    <div
                      className="h-10 w-10 shrink-0 rounded-full border border-white/15 bg-cover bg-center"
                      style={{ backgroundImage: message.avatarSrc ? `url(${message.avatarSrc})` : undefined }}
                    >
                      {!message.avatarSrc && <UserRound className="m-2 h-5 w-5 text-white/60" />}
                    </div>
                  )}
                  <div className={cn("max-w-[78%] rounded-[18px] border p-3", own ? "border-lime-300/25 bg-lime-300/15" : "border-white/10 bg-white/[.06]")}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-white">{message.displayName}</p>
                      <span className="text-[11px] font-bold text-white/45">{formatChatTime(message.createdAt)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-white/78">{message.body}</p>
                    {own && (
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-black text-white/45 transition hover:text-orange-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid h-full place-items-center rounded-[18px] border border-dashed border-white/12 bg-white/[.03] text-center">
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
              className="inline-flex min-h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-lime-300 text-black transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
              title="Send"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </Card>

      <div className="space-y-5">
        <Card>
          <SectionTitle>Chat Access</SectionTitle>
          <div className="mt-4 space-y-3 text-sm text-white/68">
            <p>Only your logged-in profile can post here.</p>
            <p>You can delete your own messages.</p>
            <p>For deployment, this will become realtime chat with protected accounts.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
