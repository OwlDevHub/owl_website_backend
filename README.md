# OWL Website Backend

Serverless backend for collecting user data from the OWL waiting list and sending notifications to Telegram.

Deployed on [Vercel](https://vercel.com).

## Endpoints

### `POST /api/sendToTelegram`

Accepts user data and forwards it to a Telegram chat via bot API.

**Request body:**

```json
{
  "email": "user@example.com",
  "ipAddress": "1.2.3.4",
  "timezone": "Europe/Kiev",
  "deviceInfo": {
    "deviceType": "desktop",
    "os": "Windows",
    "osVersion": "10",
    "browserName": "Chrome",
    "browserVersion": "120",
    "platform": "Win32",
    "language": "en-US",
    "localDateTime": "2024-01-01T12:00:00",
    "screen": {
      "screenWidth": 1920,
      "screenHeight": 1080,
      "windowInnerWidth": 1920,
      "windowInnerHeight": 950,
      "devicePixelRatio": 1,
      "screenColorDepth": 24,
      "orientation": "landscape-primary"
    },
    "browser": {
      "userAgent": "Mozilla/5.0 ...",
      "cookieEnabled": true,
      "hardwareConcurrency": 8,
      "deviceMemory": 8,
      "maxTouchPoints": 0,
      "isMobile": false,
      "isTablet": false
    },
    "network": {
      "effectiveType": "4g",
      "downlink": 10,
      "rtt": 50,
      "saveData": false
    },
    "performance": {
      "pageLoadTime": 1200,
      "domReadyTime": 800
    }
  }
}
```

## Environment Variables

Create a `.env` file (see `.env.example`):

| Variable            | Description                  |
| ------------------- | ---------------------------- |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token           |
| `CHAT_ID`           | Target chat ID               |
| `TOPIC_ID`          | Topic/thread ID (optional)   |

## Development

```bash
# Install dependencies
npm install

# Run locally with Vercel CLI
npm start
```

## Project Structure

```
api/
  sendToTelegram.ts    — serverless function entry point
utils/
  telegram.ts          — Telegram message formatting and sending
  validation.ts        — HTML escaping helper
types.ts              — TypeScript interfaces
```

## License

MIT
