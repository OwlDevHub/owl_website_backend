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

  const { email, ipAddress, timezone, deviceInfo } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const message = formatTelegramMessage(req.body);

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const responseData = await response.json();
    console.log("Telegram API response:", responseData);

    if (!response.ok) {
      return res
        .status(500)
        .json({ error: "Telegram API Error", details: responseData });
    }

    return res.status(200).json({ message: "OK" });
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

function formatTelegramMessage(data: any): string {
  const { email, ipAddress, timezone, deviceInfo } = data;

  const screen = deviceInfo?.screen || {};
  const browser = deviceInfo?.browser || {};
  const network = deviceInfo?.network || {};
  const performance = deviceInfo?.performance || {};

  let message = `🔔 <b>NEW USER ON THE WAITING LIST!</b>\n\n`;

  message += `📧 <b>Email:</b> ${escapeHtml(email)}\n`;
  message += `🌐 <b>IP Address:</b> ${escapeHtml(ipAddress || "Unknown")}\n`;
  message += `🕐 <b>Timezone:</b> ${escapeHtml(timezone || "Unknown")}\n\n`;

  message += `💻 <b>Device Information:</b>\n`;
  message += `├─ <b>Device Type:</b> ${escapeHtml(deviceInfo?.deviceType || "Unknown")}\n`;
  message += `├─ <b>OS:</b> ${escapeHtml(deviceInfo?.os || "Unknown")} ${escapeHtml(deviceInfo?.osVersion || "")}\n`;
  message += `├─ <b>Browser:</b> ${escapeHtml(deviceInfo?.browserName || "Unknown")} ${escapeHtml(deviceInfo?.browserVersion || "")}\n`;
  message += `├─ <b>Platform:</b> ${escapeHtml(deviceInfo?.platform || "Unknown")}\n`;
  message += `└─ <b>Language:</b> ${escapeHtml(deviceInfo?.language || "Unknown")}\n\n`;

  if (screen.screenWidth && screen.screenHeight) {
    message += `📺 <b>Screen Information:</b>\n`;
    message += `├─ <b>Screen Resolution:</b> ${screen.screenWidth} x ${screen.screenHeight}\n`;
    message += `├─ <b>Window Size:</b> ${screen.windowInnerWidth} x ${screen.windowInnerHeight}\n`;
    message += `├─ <b>Pixel Ratio:</b> ${screen.devicePixelRatio || 1}x\n`;
    message += `├─ <b>Color Depth:</b> ${screen.screenColorDepth || "Unknown"} bit\n`;
    message += `└─ <b>Orientation:</b> ${escapeHtml(screen.orientation || "Unknown")}\n\n`;
  }

  if (browser.userAgent) {
    message += `🔧 <b>Browser Details:</b>\n`;
    message += `├─ <b>User Agent:</b> ${escapeHtml(browser.userAgent.substring(0, 100))}${browser.userAgent.length > 100 ? "..." : ""}\n`;
    message += `├─ <b>Cookies Enabled:</b> ${browser.cookieEnabled ? "✅ Yes" : "❌ No"}\n`;
    message += `├─ <b>Hardware Concurrency:</b> ${browser.hardwareConcurrency || "Unknown"} cores\n`;
    message += `├─ <b>Device Memory:</b> ${browser.deviceMemory ? browser.deviceMemory + " GB" : "Unknown"}\n`;
    message += `├─ <b>Max Touch Points:</b> ${browser.maxTouchPoints || 0}\n`;
    message += `├─ <b>Mobile Device:</b> ${browser.isMobile ? "✅ Yes" : "❌ No"}\n`;
    message += `└─ <b>Tablet Device:</b> ${browser.isTablet ? "✅ Yes" : "❌ No"}\n\n`;
  }

  if (network.available !== false && network.effectiveType) {
    message += `🌍 <b>Network Information:</b>\n`;
    message += `├─ <b>Connection Type:</b> ${escapeHtml(network.effectiveType || "Unknown")}\n`;
    message += `├─ <b>Downlink:</b> ${network.downlink ? network.downlink + " Mbps" : "Unknown"}\n`;
    message += `├─ <b>RTT:</b> ${network.rtt ? network.rtt + " ms" : "Unknown"}\n`;
    message += `└─ <b>Save Data Mode:</b> ${network.saveData ? "✅ Enabled" : "❌ Disabled"}\n\n`;
  }

  if (performance.pageLoadTime) {
    message += `⚡ <b>Performance:</b>\n`;
    message += `├─ <b>Page Load Time:</b> ${performance.pageLoadTime} ms\n`;
    if (performance.domReadyTime) {
      message += `├─ <b>DOM Ready Time:</b> ${performance.domReadyTime} ms\n`;
    }
    if (performance.usedJSHeapSize) {
      const usedHeapMB = Math.round(performance.usedJSHeapSize / 1048576);
      const totalHeapMB = Math.round(performance.totalJSHeapSize / 1048576);
      message += `└─ <b>JS Memory Usage:</b> ${usedHeapMB} MB / ${totalHeapMB} MB\n`;
    }
    message += `\n`;
  }

  if (deviceInfo?.localDateTime) {
    message += `⏰ <b>Local Time on Device:</b>\n`;
    message += `├─ <b>Date/Time:</b> ${escapeHtml(deviceInfo.localDateTime)}\n`;
    message += `├─ <b>Time:</b> ${escapeHtml(deviceInfo.localTime || "Unknown")}\n`;
    message += `└─ <b>Date:</b> ${escapeHtml(deviceInfo.localDate || "Unknown")}\n\n`;
  }

  message += `🕐 <b>Request Received Time (UTC):</b>\n`;
  message += `└─ ${new Date().toISOString()}\n`;

  return message;
}

function escapeHtml(text: string): string {
  if (!text) return "Unknown";

  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}
