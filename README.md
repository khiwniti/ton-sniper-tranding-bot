# TON Sniper AI Bot (Vercel Edition)

This is an AI-enhanced Telegram bot for sniping TON memecoins, optimized for deployment on Vercel as a serverless function.

## AI Capabilities
- **AI Security Audits**: Uses LLMs to analyze contract risk beyond basic checks.
- **Sentiment Tracking**: Gauges social media hype to prioritize snipes.
- **Natural Language commands**: Interact with the bot using simple commands.

## Deployment on Vercel
1. **Prepare your Vercel Project**:
   - Install the Vercel CLI: `npm install -g vercel`
   - Run `vercel link` to connect your project.

2. **Set Environment Variables**:
   In your Vercel project settings, add:
   - `TELEGRAM_BOT_TOKEN`: Your bot token from @BotFather.
   - `TON_RPC_ENDPOINT`: TON RPC URL.
   - `AI_API_KEY`: (Optional) API key for Gemini or OpenAI.

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Webhook**:
   After deployment, copy your Vercel URL and run:
   ```bash
   VERCEL_URL=https://your-project.vercel.app npx ts-node set-webhook.ts
   ```

## Bot Commands
- `/start` - Main menu.
- `/audit <address>` - Get an AI security report for a Jetton.
- `/hype <symbol>` - Check social sentiment for a token.
- `/snipe <address>` - Run security checks and initiate a snipe.
- `/status` - Check current bot status and active positions.

## Note on Monitoring
While the Telegram interface runs on Vercel, the **real-time mempool monitoring** developed in the first phase requires a persistent process. It is recommended to run the monitoring logic on a VPS and have it send alerts/triggers to this Telegram bot's webhook.
