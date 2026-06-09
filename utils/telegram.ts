import type { TelegramData } from "../types.js";
import { escapeHtml } from "./validation.js";

export function formatTelegramMessage(data: TelegramData): string {
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
  message += `├─ <b>Browser:</b> ${escapeHtml(deviceInfo?.browserName || "Unknown")} ${escapeHtml(deviceInfo?.browserVersion || "Unknown")}\n`;
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
    message += `├─ <b>Device Memory:</b> ${browser.deviceMemory !== "unknown" ? browser.deviceMemory + " GB" : "Unknown"}\n`;
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
  } else {
    message += `🌍 <b>Network Information:</b>\n`;
    message += `└─ Not available\n\n`;
  }

  if (performance.pageLoadTime && performance.pageLoadTime > 0) {
    message += `⚡ <b>Performance:</b>\n`;
    message += `├─ <b>Page Load Time:</b> ${performance.pageLoadTime} ms\n`;
    if (performance.domReadyTime) {
      message += `└─ <b>DOM Ready Time:</b> ${performance.domReadyTime} ms\n`;
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

export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  message: string,
  topicId?: string,
): Promise<{ ok: boolean }> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const payload: any = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML",
  };

  if (topicId) {
    const topicIdNumber = parseInt(topicId, 10);
    if (!isNaN(topicIdNumber)) {
      payload.message_thread_id = topicIdNumber;
      console.log(`Sending to topic ID: ${topicIdNumber}`);
    } else {
      console.error(`Invalid topicId format: "${topicId}" - not a number`);
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log("Telegram API response:", data);
  return data as { ok: boolean };
}
