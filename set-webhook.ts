import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const url = process.env.VERCEL_URL; // e.g., https://your-app.vercel.app

if (!token || !url) {
    console.error("Missing TELEGRAM_BOT_TOKEN or VERCEL_URL in environment.");
    process.exit(1);
}

const webhookUrl = `${url}/api/webhook`;

async function setWebhook() {
    try {
        const response = await axios.get(`https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`);
        console.log("Webhook Set Success:", response.data);
    } catch (error) {
        console.error("Error setting webhook:", error);
    }
}

setWebhook();
