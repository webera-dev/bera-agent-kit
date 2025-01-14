import { Address, parseUnits } from "viem";
import { createViemPublicClient } from "../../utils/createViemPublicClient";
import { ToolConfig } from "../allTools";
import { parseEther } from "viem/utils";
import { createViemWalletClient } from "../../utils/createViemWalletClient";
import { TokenABI } from "../../constants/tokenABI";
import { log } from "../../utils/logger";

interface TransferArgs {
  to: Address;
  amount: number;
  tokenAddress?: Address;
}

export const transferTool: ToolConfig<TransferArgs> = {
  definition: {
    type: "function",
    function: {
      name: "transfer",
      description: "Transfer native currency or ERC20 tokens to a recipient",
      parameters: {
        type: "object",
        properties: {
          to: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The recipient's public address",
          },
          amount: {
            type: "number",
            description: "The amount to transfer in Ether or token units",
          },
          tokenAddress: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
            description: "Optional ERC20 token address for token transfers",
          },
        },
        required: ["to", "amount"],
      },
    },
  },
  handler: async ({ to, amount, tokenAddress }, walletClient: any) => {
    try {
      // const walletClient = createViemWalletClient();
      console.info(
        `[INFO] Start transfer ${amount} ${tokenAddress || "BERA"} from ${walletClient.account.address} to ${to} `,
      );
      let tx: string;

      if (!tokenAddress) {
        tx = await walletClient.sendTransaction({
          to,
          value: parseEther(amount.toString()),
        });
      } else {
        const publicClient = createViemPublicClient();

        const decimals = await publicClient.readContract({
          address: tokenAddress,
          abi: TokenABI,
          functionName: "decimals",
          args: [],
        });

        const parsedAmount = parseUnits(amount.toString(), decimals);
        return await walletClient.writeContract({
          address: tokenAddress,
          abi: TokenABI,
          functionName: "transfer",
          args: [to, parsedAmount],
        });
      }

      const receipt = await walletClient.waitForTransactionReceipt({
        hash: tx as `0x${string}`,
      });

      if (receipt.status !== "success") {
        throw new Error(`transaction status ${receipt.status}`);
      }
      return tx;
    } catch (error: any) {
      log.error(
        `[INFO] Transfer ${amount} ${tokenAddress} to ${to} error: ${error.message}`,
      );
      throw new Error(`Transfer failed: ${error.message}`);
    }
  },
};
