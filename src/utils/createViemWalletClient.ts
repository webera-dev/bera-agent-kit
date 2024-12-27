import {createWalletClient, http, publicActions} from "viem";
import { privateKeyToAccount } from "viem/accounts";
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
    }).extend(publicActions);
}
