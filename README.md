# 🚀 TON Sniper AI Trading Bot v2026

An institutional-grade, AI-enhanced algorithmic trading bot for the TON (The Open Network) ecosystem. Built for extreme speed, maximum capital preservation, and multi-platform control (Telegram & LINE).

## 🌟 Architecture Overview

This project is split into three core components:

1. **The Webhooks (Vercel Serverless)**:
   - Handles incoming commands from **Telegram** and **LINE**.
   - Executes AI Security Audits (`/audit`) and Sentiment Analysis (`/hype`).
   - Runs the TVM Sandbox simulation to prevent honeypots.

2. **The Risk Manager (`advanced-risk-manager.ts`)**:
   - **Dynamic Position Sizing**: Never risks more than 15% of your portfolio per trade.
   - **Ultra-Micro Challenge Mode**: Capable of executing snipes with less than `< 0.01 TON` for extreme micro-wallets.
   - **Emotionless Exits**: Hard stop-loss at -35%, auto-sells 50% at 2x profit, and leaves a "moonbag" running with a trailing stop.
   - **LP Burn Check**: Verifies if liquidity is locked before buying.

3. **The Radar (`mempool-monitor.ts`)**:
   - A Node.js script designed to run 24/7 on a VPS.
   - Scans the TON mempool for new `add_liquidity` events on DEXs (Ston.fi / DeDust).
   - Instantly pings the Vercel webhook to trigger the automated `/snipe` command.

## 🛠️ Setup & Deployment

### 1. Prerequisites
- Node.js (v20+)
- A [Vercel](https://vercel.com/) Account (Free tier is sufficient)
- A Telegram Bot Token (via [@BotFather](https://t.me/botfather))
- A LINE Developer Account (Optional, for LINE integration)

### 2. Vercel Deployment (The Bot Interface)
Deploy the webhook listeners to Vercel to keep the bot online 24/7 with zero idle costs.

```bash
npm install
npm install -g vercel
vercel deploy --prod
```

Configure your environment variables in the Vercel Dashboard:
- `TELEGRAM_BOT_TOKEN`
- `TON_RPC_ENDPOINT` (e.g., https://toncenter.com/api/v2/jsonRPC)
- `LINE_CHANNEL_ACCESS_TOKEN` (If using LINE)
- `LINE_CHANNEL_SECRET` (If using LINE)

Set your Telegram Webhook to point to your Vercel deployment:
```bash
VERCEL_URL=https://your-vercel-project.vercel.app TELEGRAM_BOT_TOKEN=YOUR_TOKEN npx ts-node set-webhook.ts
```

### 3. Local / VPS Deployment (The Radar)
The mempool scanner needs a persistent environment to watch the blockchain continuously.

```bash
# Set your Vercel URL so the Radar knows where to send buy signals
export VERCEL_URL=https://your-vercel-project.vercel.app
export TELEGRAM_CHAT_ID=your_personal_chat_id

# Start the continuous scanner
npx ts-node mempool-monitor.ts
```

## 💬 Bot Commands (Telegram / LINE)

Interact with your bot via natural language commands:

- `/start` - Displays the main menu.
- `/audit <address>` - Runs an AI-powered security audit on a Jetton Master contract.
- `/hype <symbol>` - Scans social media to determine the hype score and market mood.
- `/snipe <address>` - Manually trigger a security check and simulated snipe.

## ⚠️ Important Note on Execution

Currently, the `executeRealMainnetTrade()` function in the pipeline is a **Simulated Placeholder**. 
To execute real trades with real TON, you must update the execution logic to securely import your wallet mnemonic, construct the `Bag of Cells (BoC)` for the DEX router (e.g., Ston.fi), and broadcast the signed transaction to the TON RPC. 

*Never commit your private keys or mnemonics to GitHub.* Use environment variables.

## 📜 License
MIT License. Proceed at your own risk. The cryptocurrency market, especially memecoins, is highly volatile. This software does not guarantee profits.
