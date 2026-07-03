import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/knowledge";

const MODEL = "claude-haiku-4-5";
const MAX_HISTORY = 12;
const MAX_MESSAGE_LENGTH = 2000;

type IncomingMessage = { role?: unknown; content?: unknown };

export async function POST(request: Request) {
  let body: { messages?: IncomingMessage[]; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return Response.json({ error: "missing_messages" }, { status: 400 });
  }
  const locale = body.locale === "en" ? "en" : "fr";

  // Historique tronqué côté serveur + assainissement
  const history = body.messages
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: String(m.content ?? "").slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((m) => m.content.trim().length > 0);

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return Response.json({ error: "invalid_messages" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Pas de clé configurée (.env.local absent) : réponse propre, pas de crash
    return Response.json({ error: "assistant_unavailable" }, { status: 503 });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: buildSystemPrompt(locale),
      messages: history,
    });
    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();
    if (!reply) {
      return Response.json({ error: "empty_reply" }, { status: 502 });
    }
    return Response.json({ reply });
  } catch (error) {
    // Log serveur uniquement — jamais de stack exposée au client
    console.error("[api/chat]", error);
    return Response.json({ error: "upstream_error" }, { status: 502 });
  }
}
