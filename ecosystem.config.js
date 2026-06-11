module.exports = {
  apps: [
    {
      name: "ton-sniper-radar",
      script: "npx",
      args: "ts-node mempool-monitor.ts",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        // The URL of your Vercel deployment where Telegram/LINE webhooks are hosted
        VERCEL_URL: "https://your-vercel-project.vercel.app",
        // Your personal Telegram Chat ID to receive alerts from the Radar
        TELEGRAM_CHAT_ID: "123456789",
        // Uncomment below to use testnet
        // NETWORK: "testnet"
      }
    }
  ]
};
