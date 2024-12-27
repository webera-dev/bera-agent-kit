import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
// import { abstractTestnet } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";
import { berachainTestnetbArtio } from "viem/chains";

export function createViemWalletClient() {
    if (!process.env.PRIVATE_KEY) {
        throw new Error("[INFO] PRIVATE_KEY environment variable is not set.");
    }

    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

    return createWalletClient({
        account,
        chain: berachainTestnetbArtio,
        transport: http(),
    }).extend(eip712WalletActions());
}
