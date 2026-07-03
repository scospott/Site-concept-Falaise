"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";

export type ChatMessage = { role: "user" | "assistant"; content: string };

type VillaChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  send: (text: string) => void;
  /** true dès qu'au moins un message utilisateur a été envoyé */
  started: boolean;
};

const ChatContext = createContext<VillaChatState | null>(null);

/**
 * Provider léger : l'historique est partagé entre la section inline et le
 * widget flottant — une seule conversation avec Maël, deux fenêtres.
 */
export function VillaChatProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("hote");
  const locale = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const loadingRef = useRef(false);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loadingRef.current) return;
      setError(null);
      // Ajout optimiste du message utilisateur
      const next: ChatMessage[] = [
        ...messagesRef.current,
        { role: "user", content },
      ];
      messagesRef.current = next;
      setMessages(next);
      loadingRef.current = true;
      setIsLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next, locale }),
        });
        const data = (await res.json().catch(() => null)) as {
          reply?: string;
          error?: string;
        } | null;
        if (!res.ok || !data?.reply) {
          throw new Error(data?.error ?? "request_failed");
        }
        const withReply: ChatMessage[] = [
          ...messagesRef.current,
          { role: "assistant", content: data.reply },
        ];
        messagesRef.current = withReply;
        setMessages(withReply);
      } catch {
        // Message de repli poli — jamais de détail technique
        setError(t("error"));
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
    [locale, t],
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        error,
        send,
        started: messages.length > 0,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

/** Hook partagé par les deux interfaces — aucune duplication de la logique d'appel. */
export function useVillaChat(): VillaChatState {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useVillaChat doit être utilisé sous <VillaChatProvider>");
  }
  return ctx;
}
