"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";
import { useVillaChat } from "./VillaChat";

const SUGGESTION_KEYS = ["s1", "s2", "s3", "s4"] as const;

function Avatar() {
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-pin/50 font-display text-sm text-pin"
    >
      M
    </span>
  );
}

function Bulle({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: ReactNode;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-pin px-4 py-2.5 text-[15px] leading-[1.6] text-creme">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3">
      <Avatar />
      <div className="chat-markdown max-w-[85%] pt-1 text-[15px] leading-[1.6] text-encre">
        {children}
      </div>
    </div>
  );
}

/**
 * Fenêtre de conversation partagée (section inline + widget) : mêmes
 * messages, même hook. `compact` resserre les espacements pour le widget.
 */
export default function ChatWindow({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("hote");
  const { messages, isLoading, error, send, started } = useVillaChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suivre le fil : scroll interne en bas à chaque nouveau message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading, error]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-filet bg-calcaire/85 backdrop-blur ${
        compact ? "" : "shadow-[0_20px_60px_rgba(38,51,43,0.12)]"
      }`}
    >
      <div
        ref={scrollRef}
        data-lenis-prevent
        className={`flex-1 space-y-5 overflow-y-auto ${compact ? "p-4" : "p-6 md:p-8"}`}
      >
        {/* Message d'accueil de Maël — présent d'emblée, aucun appel API */}
        <Bulle role="assistant">
          <p>{t("welcome")}</p>
        </Bulle>

        {messages.map((message, i) =>
          message.role === "assistant" ? (
            <Bulle key={i} role="assistant">
              <ReactMarkdown
                allowedElements={[
                  "p",
                  "ul",
                  "ol",
                  "li",
                  "strong",
                  "em",
                  "a",
                  "br",
                ]}
                unwrapDisallowed
              >
                {message.content}
              </ReactMarkdown>
            </Bulle>
          ) : (
            <Bulle key={i} role="user">
              {message.content}
            </Bulle>
          ),
        )}

        {isLoading && (
          <div className="flex items-center gap-3">
            <Avatar />
            <span
              className="chat-typing flex gap-1.5 pt-1"
              aria-label={t("loading")}
            >
              <i className="h-1.5 w-1.5 rounded-full bg-pin/70" />
              <i className="h-1.5 w-1.5 rounded-full bg-pin/70" />
              <i className="h-1.5 w-1.5 rounded-full bg-pin/70" />
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3">
            <Avatar />
            <p className="max-w-[85%] pt-1 text-sm text-soleil">{error}</p>
          </div>
        )}

        {!started && (
          <div className={`flex flex-wrap gap-2 ${compact ? "" : "pt-2"}`}>
            {SUGGESTION_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => send(t(`suggestions.${key}`))}
                className="rounded-full border border-filet px-3.5 py-1.5 text-sm text-encre/80 transition-colors duration-300 hover:border-pin hover:text-pin"
              >
                {t(`suggestions.${key}`)}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={submit}
        className={`flex items-center gap-3 border-t border-filet ${
          compact ? "p-3" : "p-4 md:px-6"
        }`}
      >
        <label htmlFor={compact ? "mael-widget-input" : "mael-inline-input"} className="sr-only">
          {t("placeholder")}
        </label>
        <input
          id={compact ? "mael-widget-input" : "mael-inline-input"}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-encre placeholder:text-encre/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label={t("send")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pin text-creme transition-all duration-300 ease-luxe enabled:hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <path
              d="M2 8h11M9 3.5L13.5 8 9 12.5"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
