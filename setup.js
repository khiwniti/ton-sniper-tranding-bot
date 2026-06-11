const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const envPath = path.join(__dirname, ".env");

console.log("==========================================");
console.log("🚀 TON SNIPER AI BOT - SETUP WIZARD 🚀");
console.log("==========================================");
console.log("This wizard will help you configure your .env file.\n");

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

async function runSetup() {
    let envContent = "";

    console.log("--- 1. Telegram Configuration ---");
    const tgToken = await askQuestion("Enter your Telegram Bot Token (from @BotFather): ");
    const tgChatId = await askQuestion("Enter your personal Telegram Chat ID (for radar alerts): ");
    
    envContent += `TELEGRAM_BOT_TOKEN=${tgToken}\n`;
    envContent += `TELEGRAM_CHAT_ID=${tgChatId}\n\n`;

    console.log("\n--- 2. LINE Configuration (Optional) ---");
    const useLine = await askQuestion("Do you want to configure LINE? (y/N): ");
    if (useLine.toLowerCase() === 'y') {
        const lineToken = await askQuestion("Enter LINE Channel Access Token: ");
        const lineSecret = await askQuestion("Enter LINE Channel Secret: ");
        envContent += `LINE_CHANNEL_ACCESS_TOKEN=${lineToken}\n`;
        envContent += `LINE_CHANNEL_SECRET=${lineSecret}\n\n`;
    } else {
        envContent += `LINE_CHANNEL_ACCESS_TOKEN=\n`;
        envContent += `LINE_CHANNEL_SECRET=\n\n`;
    }

    console.log("\n--- 3. Network Configuration ---");
    const network = await askQuestion("Use mainnet or testnet? (mainnet/testnet) [default: mainnet]: ");
    const rpcUrl = network.toLowerCase() === 'testnet' 
        ? "https://testnet.toncenter.com/api/v2/jsonRPC" 
        : "https://toncenter.com/api/v2/jsonRPC";
    
    envContent += `NETWORK=${network.toLowerCase() === 'testnet' ? 'testnet' : 'mainnet'}\n`;
    envContent += `TON_RPC_ENDPOINT=${rpcUrl}\n\n`;

    console.log("\n--- 4. Wallet Configuration (For Live Trading) ---");
    console.warn("⚠️  SECURITY WARNING: Never use your main wallet. Create a new hot wallet.");
    const mnemonic = await askQuestion("Enter your 24-word Mnemonic (or press Enter to skip for now): ");
    if (mnemonic) {
        envContent += `WALLET_MNEMONIC="${mnemonic}"\n`;
    }

    fs.writeFileSync(envPath, envContent.trim());
    console.log("\n==========================================");
    console.log("✅ .env file successfully created!");
    console.log("==========================================");
    console.log("\nQuick Start Commands:");
    console.log("1. Deploy the Bot interface to Vercel:");
    console.log("   npm run deploy:vercel");
    console.log("   (Make sure to add your .env variables to your Vercel project settings!)");
    console.log("\n2. Set your Telegram Webhook:");
    console.log("   npm run set:webhook:tg");
    console.log("\n3. Start the 24/7 Radar Monitor (Local or VPS):");
    console.log("   npm run start:radar");
    
    rl.close();
}

runSetup();
