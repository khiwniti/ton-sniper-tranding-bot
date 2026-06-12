import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const NVIDIA_MODEL = "meta/llama-3.1-405b-instruct"; // High-performance model for analysis

/**
 * 🛡️ NVIDIA AI ENHANCEMENT: Smart Contract Risk Auditor
 * Uses NVIDIA's Llama-powered NIM to analyze contract risks.
 */
export async function performAiContractAudit(masterAddress: string): Promise<{ score: number; report: string }> {
    console.log(`[NVIDIA_AI] Requesting deep security audit for ${masterAddress}...`);
    
    if (!NVIDIA_API_KEY) {
        console.warn("[NVIDIA_AI] API Key missing. Falling back to Mock analysis.");
        return { score: 80, report: "Simulation Mode: Ensure NVIDIA_API_KEY is set for real analysis." };
    }

    try {
        const response = await axios.post(`${NVIDIA_BASE_URL}/chat/completions`, {
            model: NVIDIA_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an expert TON Blockchain Smart Contract Security Auditor. Analyze the provided Jetton Master address for rug-pull risks, hidden mint functions, and liquidity theft backdoors. Provide a safety score from 0-100."
                },
                {
                    role: "user",
                    content: `Please audit the following TON Jetton Master address: ${masterAddress}`
                }
            ],
            temperature: 0.2,
            max_tokens: 1024
        }, {
            headers: {
                "Authorization": `Bearer ${NVIDIA_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const aiContent = response.data.choices[0].message.content;
        
        // Simple logic to extract a score if the AI provides one, otherwise default to 85
        const scoreMatch = aiContent.match(/(\d{1,3})\/100/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 85;

        return { score, report: aiContent };

    } catch (error: any) {
        console.error("[NVIDIA_AI] Error during contract audit:", error?.response?.data || error.message);
        return { score: 0, report: "NVIDIA AI analysis failed. Manual verification required." };
    }
}

/**
 * 📊 NVIDIA AI ENHANCEMENT: Sentiment Analysis
 * Gauges market hype and mood using NVIDIA's high-speed inference.
 */
export async function analyzeSocialSentiment(symbol: string): Promise<number> {
    console.log(`[NVIDIA_AI] Analyzing social hype for $${symbol}...`);

    if (!NVIDIA_API_KEY) return Math.floor(Math.random() * 100);

    try {
        const response = await axios.post(`${NVIDIA_BASE_URL}/chat/completions`, {
            model: NVIDIA_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are a professional crypto sentiment analyst. Provide a hype score from 0 (dead) to 100 (extreme viral hype) for the given token symbol based on current market trends."
                },
                {
                    role: "user",
                    content: `Analyze market sentiment for TON memecoin: $${symbol}`
                }
            ],
            temperature: 0.5,
            max_tokens: 128
        }, {
            headers: {
                "Authorization": `Bearer ${NVIDIA_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const aiContent = response.data.choices[0].message.content;
        const scoreMatch = aiContent.match(/(\d{1,3})/);
        return scoreMatch ? parseInt(scoreMatch[1]) : 50;

    } catch (error) {
        console.error("[NVIDIA_AI] Sentiment error:", error);
        return 50;
    }
}
