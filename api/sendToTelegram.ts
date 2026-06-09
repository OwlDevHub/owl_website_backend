import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { TelegramData } from "../types.js";
import {
  formatTelegramMessage,
  sendTelegramMessage,
} from "../utils/telegram.js";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const TOPIC_ID = process.env.TOPIC_ID;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "The method is not supported" });
  }

  if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
    console.error("Missing TELEGRAM_BOT_TOKEN or CHAT_ID");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const { email, ipAddress, timezone, deviceInfo } = req.body as TelegramData;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const message = formatTelegramMessage({
    email,
    ipAddress,
    timezone,
    deviceInfo,
  });

  try {
    const result = await sendTelegramMessage(
      TELEGRAM_BOT_TOKEN,
      CHAT_ID,
      message,
      TOPIC_ID,
    );

    if (!result.ok) {
      return res.status(500).json({ error: "Failed to send notification" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
