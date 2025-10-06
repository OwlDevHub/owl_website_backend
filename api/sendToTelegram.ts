import type { VercelRequest, VercelResponse } from "@vercel/node";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = "1660218648";

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

  const { email, deviceInfo } = req.body;

  if (!email || !deviceInfo) {
    return res.status(400).json({ error: "Insufficient data" });
  }

  const message = `New user on the waiting list:\nEmail: ${email}\nDevice: ${deviceInfo}`;
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });

    const responseData = await response.json();
    console.log("Telegram API response:", responseData);

    if (!response.ok) {
      return res
        .status(500)
        .json({ error: "Telegram API Error", details: responseData });
    }

    return res.status(200).json({ message: "OK", details: responseData });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Server Error:", error);
      return res
        .status(500)
        .json({ error: "Server Error", details: error.message });
    } else {
      console.error("Unknown Error:", error);
      return res
        .status(500)
        .json({ error: "Server Error", details: "An unknown error occurred" });
    }
  }
}
