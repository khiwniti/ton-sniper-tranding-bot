import { VercelRequest, VercelResponse } from "@vercel/node";
import { middleware, webhook } from "@line/bot-sdk";
import { handleLineEvent } from "../line-bot";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
    channelSecret: process.env.LINE_CHANNEL_SECRET || ""
};

// Next.js/Vercel serverless function body parser must be disabled 
// so the LINE middleware can verify the raw body signature.
export const configApp = {
    api: {
        bodyParser: false,
    },
};

// Create a middleware function instance
const lineMiddleware = middleware(config);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "POST") {
        try {
            // First, run the LINE signature verification middleware
            await new Promise<void>((resolve, reject) => {
                lineMiddleware(req as any, res as any, (err: any) => {
                    if (err) return reject(err);
                    resolve();
                });
            });

            // If signature is valid, process events
            const events: webhook.Event[] = req.body.events;
            
            // Process all events concurrently
            const results = await Promise.all(
                events.map(async (event: webhook.Event) => {
                    try {
                        await handleLineEvent(event);
                    } catch (err) {
                        console.error("Error in handleLineEvent:", err);
                    }
                })
            );

            // Return success to LINE
            return res.status(200).json({ status: "success", results });
        } catch (error) {
            console.error("LINE Webhook Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
