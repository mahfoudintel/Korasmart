"use client";

import { useEffect, useState } from "react";
import { useLocalProfile } from "@/hooks/use-local-profile";

export type ChatMessage = {
  id: string;
  conversationId: string;
  recipients: string[];
  playerName: string;
  displayName: string;
  avatarSrc: string;
  body: string;
  createdAt: string;
};

const storageKey = "korasmart-chat-messages-v1";
const chatChangedEvent = "korasmart-chat-messages-changed";

function readMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as Partial<ChatMessage>[];
    return Array.isArray(parsed)
      ? parsed
          .filter((message) => message.id && message.playerName && message.body && message.createdAt)
          .map((message) => ({
            conversationId: "team",
            recipients: [],
            avatarSrc: "",
            displayName: message.playerName || "",
            ...message
          }) as ChatMessage)
      : [];
  } catch {
    window.localStorage.removeItem(storageKey);
    return [];
  }
}

function saveMessages(messages: ChatMessage[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(messages.slice(-200)));
  window.dispatchEvent(new Event(chatChangedEvent));
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useChat() {
  const { profile } = useLocalProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const syncMessages = () => setMessages(readMessages());
    syncMessages();
    window.addEventListener("storage", syncMessages);
    window.addEventListener(chatChangedEvent, syncMessages);

    return () => {
      window.removeEventListener("storage", syncMessages);
      window.removeEventListener(chatChangedEvent, syncMessages);
    };
  }, []);

  const currentAvatar = profile.avatarDataUrl || profile.avatarPreset;

  const sendMessage = (body: string, conversationId = "team", recipients: string[] = []) => {
    const trimmed = body.trim();
    if (!trimmed || !profile.loggedIn) return false;

    const nextMessages = [
      ...messages,
      {
        id: makeId(),
        conversationId,
        recipients,
        playerName: profile.playerName,
        displayName: profile.displayName || profile.playerName,
        avatarSrc: currentAvatar,
        body: trimmed,
        createdAt: new Date().toISOString()
      }
    ];

    setMessages(nextMessages);
    saveMessages(nextMessages);
    return true;
  };

  const deleteMessage = (messageId: string) => {
    const nextMessages = messages.filter((message) => message.id !== messageId || message.playerName !== profile.playerName);
    setMessages(nextMessages);
    saveMessages(nextMessages);
  };

  const ownPlayerName = profile.playerName;

  return {
    messages,
    ownPlayerName,
    loggedIn: profile.loggedIn,
    sendMessage,
    deleteMessage
  };
}
