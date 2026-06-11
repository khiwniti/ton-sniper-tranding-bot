import { webhookCallback } from "grammy";
import { bot } from "../bot";

// Vercel Serverless Function entry point
export default webhookCallback(bot, "http");
