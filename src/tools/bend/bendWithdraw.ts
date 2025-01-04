import { Address } from "viem";
import { ToolConfig } from "../allTools";
import { BEND_ABI } from "../../constants/bendABI";
import { CONTRACT } from "../../constants/index";
import { createViemWalletClient } from "../../utils/createViemWalletClient";
import { fetchTokenDecimalsAndParseAmount } from "../../utils/helpers";
import { log } from "../../utils/logger";

interface BendWithdrawArgs {
  asset: Address;
  amount: number;
}

export const bendWithdrawTool: ToolConfig<BendWithdrawArgs> = {
  definition: {
    type: "function",
    function: {
      name: "bend_withdraw",
      description: "Withdraw tokens from Bend Protocol",
      parameters: {
        type: "object",
        properties: {
          asset: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
            description: "Token address to withdraw",
          },
          amount: {
            type: "number",
            description: "The amount of tokens to withdraw",
          },
        },
        required: ["asset", "amount"],
      },
    },
  },
  handler: async (args) => {
    try {
      const walletClient = createViemWalletClient();
      const onBehalfOf = walletClient.account.address;

      // Parse amount with correct decimals
      const parsedAmount = await fetchTokenDecimalsAndParseAmount(
        walletClient,
        args.asset,
        args.amount,
      );

      // Execute withdraw
      const hash = await walletClient.writeContract({
        address: CONTRACT.Bend,
        abi: BEND_ABI,
        functionName: "withdraw",
        args: [args.asset, parsedAmount, onBehalfOf],
      });

      log.info(
        `Successfully withdrew tokens from Bend. Transaction hash: ${hash}`,
      );
      return hash;
    } catch (error: any) {
      log.error(`Bend withdraw failed: ${error.message}`);
      throw error;
    }
  },
};
