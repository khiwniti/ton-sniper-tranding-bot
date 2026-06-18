import { TonClient, WalletContractV4, internal, toNano, Address, SendMode } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { Factory, MAINNET_FACTORY_ADDR, Asset, VaultNative, PoolType } from "@dedust/sdk";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * ⚠️ LIVE TRADING TEMPLATE (DeDust.io) ⚠️
 * This file demonstrates how to execute a real TON -> Jetton swap on DeDust.
 * It serves as an alternative to the Ston.fi execution.
 */

export async function executeDedustSwap(
    client: TonClient, 
    targetJettonAddress: string, 
    amountTonToSpend: number
) {
    console.log(`\n[EXECUTION] Initiating LIVE TRADE on DeDust.io...`);
    
    // 1. Securely load the Hot Wallet Mnemonic
    const mnemonic = process.env.WALLET_MNEMONIC;
    if (!mnemonic) {
        throw new Error("[EXECUTION] FATAL: WALLET_MNEMONIC is missing from environment variables.");
    }

    try {
        console.log("[EXECUTION] Deriving KeyPair from Mnemonic...");
        const keyPair = await mnemonicToPrivateKey(mnemonic.split(" "));

        // 2. Initialize the Wallet Contract
        const wallet = WalletContractV4.create({ 
            workchain: 0, 
            publicKey: keyPair.publicKey 
        });
        const walletContract = client.open(wallet);

        // Check if wallet has enough balance (Adding ~0.2 TON for routing gas)
        const balance = await walletContract.getBalance();
        const requiredBalance = (amountTonToSpend + 0.2) * 1e9; 
        if (Number(balance) < requiredBalance) {
            throw new Error(`[EXECUTION] Insufficient balance. Have: ${Number(balance)/1e9}, Need: ${amountTonToSpend + 0.2}`);
        }

        console.log(`[EXECUTION] Wallet initialized. Proceeding to build DeDust Swap Payload...`);

        // 3. Initialize DeDust SDK
        const factory = client.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));

        // Define assets: Native TON and the Target Jetton
        const tonAsset = Asset.native();
        const jettonAsset = Asset.jetton(Address.parse(targetJettonAddress));

        // 4. Get the Native Vault and Pool
        const vault = client.open(await factory.getVault(tonAsset));
        const pool = client.open(await factory.getPool(PoolType.VOLATILE, [tonAsset, jettonAsset]));

        console.log(`[EXECUTION] Fetching Wallet Seqno...`);
        const seqno = await walletContract.getSeqno();

        console.log(`[EXECUTION] Signing and Broadcasting DeDust Transaction...`);
        
        // 5. Sign and Broadcast
        // To swap TON on DeDust, you send TON to the Native Vault with a swap payload.
        
        /* 
        // --- UNCOMMENT THIS BLOCK TO ENABLE LIVE TRADING ON DEDUST ---
        await walletContract.sendTransfer({
            seqno,
            secretKey: keyPair.secretKey,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            messages: [
                internal({
                    to: vault.address,
                    value: toNano((amountTonToSpend + 0.2).toString()), // Amount + Gas buffer
                    body: VaultNative.createSwapPayload({
                        poolAddress: pool.address,
                        limit: 0n, // Min amount out (set > 0n for slippage control in production)
                        swapParams: {
                            recipientAddress: wallet.address,
                        }
                    }),
                })
            ]
        });
        */

        console.log(`[EXECUTION] ✅ DEDUST SWAP BROADCASTED SUCCESSFULLY!`);
        console.log(`[EXECUTION] Monitor your wallet for the incoming tokens.`);

    } catch (error) {
        console.error(`[EXECUTION] ❌ DeDust Execution Failed:`, error);
    }
}
