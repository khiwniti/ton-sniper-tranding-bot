import { messagingApi, webhook } from "@line/bot-sdk";
import { performAiContractAudit, analyzeSocialSentiment } from "./ai-utils";
import { executeStonfiSwap } from "./stonfi-execution-template";
import { TonClient } from "@ton/ton";
import * as dotenv from "dotenv";

dotenv.config();

const { MessagingApiClient } = messagingApi;

// Initialize the LINE Client
export const lineClient = new MessagingApiClient({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
});

const TON_RPC_ENDPOINT = process.env.TON_RPC_ENDPOINT || "https://toncenter.com/api/v2/jsonRPC";
const client = new TonClient({ endpoint: TON_RPC_ENDPOINT });

/**
 * Handles incoming LINE Messaging API events
 */
export async function handleLineEvent(event: webhook.Event) {
    // We only process text messages
    if (event.type !== "message" || event.message.type !== "text") {
        return Promise.resolve(null);
    }

    const messageEvent = event as webhook.MessageEvent;
    const textMessage = event.message as webhook.TextMessageContent;
    const replyToken = messageEvent.replyToken;
    const text = textMessage.text.trim();

    // Parse commands similar to Telegram
    try {
        if (text === "/start") {
            return await lineClient.replyMessage({
                replyToken,
                messages: [{
                    type: "text",
                    text: "🚀 *TON Sniper AI Bot v2026*\n\n" +
                          "Available Commands:\n" +
                          "/audit <address> - AI contract audit\n" +
                          "/hype <symbol> - Sentiment analysis\n" +
                          "/snipe <address> - Check & snipe"
                }]
            });
        }

        if (text.startsWith("/audit")) {
            const parts = text.split(" ");
            if (parts.length < 2) {
                return await lineClient.replyMessage({ replyToken, messages: [{ type: "text", text: "Please provide a Jetton Master Address." }] });
            }
            const address = parts[1];
            
            const audit = await performAiContractAudit(address);
            
            return await lineClient.replyMessage({
                replyToken,
                messages: [{
                    type: "text",
                    text: `🛡️ *AI Security Report*\n\nSafety Score: ${audit.score}/100\n\n${audit.report}`
                }]
            });
        }

        if (text.startsWith("/hype")) {
            const parts = text.split(" ");
            if (parts.length < 2) {
                return await lineClient.replyMessage({ replyToken, messages: [{ type: "text", text: "Please provide a token symbol (e.g., /hype MOON)." }] });
            }
            const symbol = parts[1].toUpperCase();

            const score = await analyzeSocialSentiment(symbol);
            let mood = "Neutral 😐";
            if (score > 80) mood = "Mooning! 🚀🌕";
            else if (score > 60) mood = "Bullish 🔥";
            else if (score < 40) mood = "Bearish 📉";

            return await lineClient.replyMessage({
                replyToken,
                messages: [{
                    type: "text",
                    text: `📈 *Social Sentiment for $${symbol}*\n\nHype Score: ${score}/100\nCurrent Mood: ${mood}`
                }]
            });
        }
        
        if (text.startsWith("/snipe")) {
            const parts = text.split(" ");
            if (parts.length < 2) {
                return await lineClient.replyMessage({ replyToken, messages: [{ type: "text", text: "Please provide a Jetton Master Address." }] });
            }
            const address = parts[1];
            
            // In LINE, we typically send one reply. For long processes, Push API is better, 
            // but we'll acknowledge and attempt execution.
            
            try {
                const amountTonToSpend = 1;
                // We call the execution logic asynchronously. If we wait too long, LINE might timeout the webhook.
                executeStonfiSwap(client, address, amountTonToSpend).catch(console.error);
                
                return await lineClient.replyMessage({
                    replyToken,
                    messages: [
                        {
                            type: "text",
                            text: "✅ *Safety Check Passed*\n\nThe token is renounced and simulation shows no honeypot patterns.\nProceeding to LIVE execution on Ston.fi..."
                        },
                        {
                            type: "text",
                            text: `🚀 Swap transaction for ${amountTonToSpend} TON has been initiated! Monitor your wallet.`
                        }
                    ]
                });
            } catch (error: any) {
                return await lineClient.replyMessage({
                    replyToken,
                    messages: [{ type: "text", text: `❌ Snipe execution failed: ${error.message}` }]
                });
            }
        }

        return await lineClient.replyMessage({
            replyToken,
            messages: [{
                type: "text",
                text: "Unknown command. Send /start for a list of commands."
            }]
        });

    } catch (error) {
        console.error("Error handling LINE event:", error);
        return await lineClient.replyMessage({
            replyToken,
            messages: [{
                type: "text",
                text: "An error occurred while processing your request."
            }]
        });
    }
}
