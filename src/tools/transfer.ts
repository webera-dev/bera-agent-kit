import { BeraAgentKit } from "../index";
import { parseEther } from "viem/utils";

/**
 * Transfer BERA or ERC20 tokens to a recipient
 * @param agent BeraAgentKit instance
 * @param to Recipient's public address
 * @param amount Amount to transfer (in Ether or token units)
 * @param tokenAddress Optional ERC20 token address
 * @returns Transaction signature
 */
export async function transfer(
    agent: BeraAgentKit,
    to: string,
    amount: string,
    tokenAddress?: string,
): Promise<string> {
    try {
        let tx: string;
        if (!agent.walletClient.account) {
            throw new Error("No account found");
        }

        if (!tokenAddress) {
            tx = await agent.walletClient.sendTransaction({
                account: agent.walletClient.account,
                chain: agent.walletClient.chain,
                to: to as `0x${string}`,
                value: parseEther(amount),
            });

        } else {
            tx = await agent.walletClient.writeContract({
                account: agent.walletClient.account,
                chain: agent.walletClient.chain,
                address: tokenAddress as `0x${string}`,
                abi: [{
                    name: 'transfer',
                    type: 'function',
                    stateMutability: 'nonpayable',
                    inputs: [
                        { name: 'recipient', type: 'address' },
                        { name: 'amount', type: 'uint256' }
                    ],
                    outputs: [{ type: 'bool' }]
                }],
                functionName: 'transfer',
                args: [to as `0x${string}`, parseEther(amount)]
            });
        }

        return tx;
    } catch (error: any) {
        throw new Error(`Transfer failed: ${error.message}`);
    }
}