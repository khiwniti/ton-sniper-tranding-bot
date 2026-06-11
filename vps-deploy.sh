#!/bin/bash

echo "🚀 Starting VPS Deployment Setup for TON Sniper Radar..."

# 1. Update system packages
echo "📦 Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Node.js (v20) and npm
echo "🟢 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 globally
echo "⚙️ Installing PM2 Process Manager..."
sudo npm install -g pm2

# 4. Install project dependencies
echo "📥 Installing project dependencies..."
npm install

# 5. Instructions for the user
echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Edit ecosystem.config.js and update VERCEL_URL and TELEGRAM_CHAT_ID."
echo "2. Run the radar: pm2 start ecosystem.config.js"
echo "3. Ensure it runs on reboot: pm2 startup && pm2 save"
echo "4. View logs: pm2 logs ton-sniper-radar"
