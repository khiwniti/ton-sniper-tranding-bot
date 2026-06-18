import { TonClient, WalletContractV5R1, internal, SendMode } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
// Note: You must run `npm install @ston-fi/sdk` to use this
import { DEX, pTON } from "@ston-fi/sdk"; 
import * as dotenv from "dotenv";

dotenv.config();

/**
 * ⚠️ LIVE TRADING TEMPLATE ⚠️
 * This file demonstrates how to execute a real TON -> Jetton swap on Ston.fi.
 * It is meant as a reference to replace the placeholder `executeRealMainnetTrade()` in index.ts.
 */

export async function executeStonfiSwap(
    client: TonClient, 
    targetJettonAddress: string, 
    amountTonToSpend: number
) {
    console.log(`\n[EXECUTION] Initiating LIVE TRADE on Ston.fi...`);
    
    // 1. Securely load the Hot Wallet Mnemonic
    // Format in .env: WALLET_MNEMONIC="word1 word2 word3 ... word24"
    const mnemonic = process.env.WALLET_MNEMONIC;
    if (!mnemonic) {
        throw new Error("[EXECUTION] FATAL: WALLET_MNEMONIC is missing from environment variables.");
    }

    try {
        console.log("[EXECUTION] Deriving KeyPair from Mnemonic...");
        const keyPair = await mnemonicToPrivateKey(mnemonic.split(" "));

        // 2. Initialize the Wallet Contract (Using V5R1 based on user keys)
        const wallet = WalletContractV5R1.create({ 
            workchain: 0, 
            publicKey: keyPair.publicKey 
        });
        const walletContract = client.open(wallet);

        // Check if wallet has enough balance (Adding 0.2 TON for routing gas)
        const balance = await walletContract.getBalance();
        const requiredBalance = (amountTonToSpend + 0.2) * 1e9; // toNano equivalent
        if (Number(balance) < requiredBalance) {
            throw new Error(`[EXECUTION] Insufficient balance. Have: ${Number(balance)/1e9}, Need: ${amountTonToSpend + 0.2}`);
        }

        console.log(`[EXECUTION] Wallet initialized. Balance OK. Proceeding to build Swap Payload...`);

        // 3. Initialize Ston.fi SDK Routers
        // Updated to use correct v1 router initialization
        
        const isTestnet = process.env.NETWORK === "testnet";
        // The Router constructor in the SDK often expects an address string first
        const router = client.open(DEX.v1.Router.create(
            isTestnet ? "kQAL97U0Uv0oZpA7H_E8uW_X3X8uW_X3X8uW_X3X8uW_X3" : "EQB3ncyBUTjZUAUOTn7f_yB-s5SscCjH-M-6f9Z6P3Z-1p" 
        ));

        // In Ston.fi, you don't swap TON directly. You swap proxy TON (pTON).
        // The SDK handles wrapping TON -> pTON -> Jetton automatically.
        const proxyTon = new pTON.v1();

        // 4. Build the Swap Transaction Payload
        // We set slippage tolerance to 15% (0.15) to ensure execution in volatile moments
        const txParams = await router.getSwapTonToJettonTxParams({
            userWalletAddress: wallet.address,
            proxyTon: proxyTon,
            offerAmount: amountTonToSpend.toString(),
            askJettonAddress: targetJettonAddress,
            minAskAmount: "1", // In reality, you'd query the expected out amount and multiply by 0.85
            queryId: Date.now(),
        });

        console.log("[EXECUTION] Swap Payload Built. Fetching Wallet Seqno...");
        const seqno = await walletContract.getSeqno();

        console.log("[EXECUTION] Signing and Broadcasting Transaction to TON...");
        
        // 5. Sign and Send
        await walletContract.sendTransfer({
            seqno,
            secretKey: keyPair.secretKey,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            messages: [
                internal({
                    to: txParams.to,
                    value: txParams.value,
                    body: txParams.body,
                })
            ]
        });

        console.log(`[EXECUTION] ✅ SWAP BROADCASTED SUCCESSFULLY!`);
        console.log(`[EXECUTION] Awaiting confirmation... Monitor price to trigger Auto-Sell.`);
        
        // At this point, you would call `monitorAndAutoSell()` from advanced-risk-manager.ts
        // monitorAndAutoSell("NEW_TOKEN", currentPrice, tokensReceived);

    } catch (error) {
        console.error(`[EXECUTION] ❌ Trade Execution Failed:`, error);
        throw error; // Re-throw so the UI knows it failed
    }
}
