import { ToolConfig } from "../allTools.js";
import { createViemWalletClient } from "../../utils/createViemWalletClient";
import { BGTABI } from "../../constants/tokenABI";
import { TOKEN } from "../../constants";
import { fetchTokenDecimalsAndParseAmount } from "../../utils/helpers";

interface BGTStationRedeemArgs {
  receiver?: string; // Address of the receiver for redemption (optional)
  amount: number; // Amount of BGT to redeem (as a number)
}

export const bgtStationRedeemTool: ToolConfig<BGTStationRedeemArgs> = {
  definition: {
    type: "function",
    function: {
      name: "bgt_station_redeem",
      description: "Redeem BGT to receiver, defaults to wallet client account",
      parameters: {
        type: "object",
        properties: {
          receiver: {
            type: ["string", "null"],
            pattern: "^0x[a-fA-F0-9]{40}$",
            description:
              "The receiver address to send redeemed BGT. Defaults to wallet client account if null.",
          },
          amount: {
            type: "number",
            minimum: 0,
            description: "The amount of BGT to redeem.",
          },
        },
        required: ["amount"],
      },
    },
  },
  handler: async (args) => {
    try {
      if (args.amount === undefined || args.amount <= 0) {
        throw new Error("A positive amount is required.");
      }

      const walletClient = createViemWalletClient();

      const receiver = args.receiver || walletClient.account.address;

      console.log("[INFO] Parsing amount based on token decimals...");
      const parsedAmount = await fetchTokenDecimalsAndParseAmount(
        walletClient,
        TOKEN.BGT,
        args.amount,
      );

      console.log(`[INFO] Redeeming BGT to receiver: ${receiver}...`);
      const redeemTx = await walletClient.writeContract({
        address: TOKEN.BGT,
        abi: BGTABI,
        functionName: "redeem",
        args: [receiver as `0x${string}`, parsedAmount],
      });

      console.log("[INFO] Waiting for transaction receipt...");
      const receipt = await walletClient.waitForTransactionReceipt({
        hash: redeemTx as `0x${string}`,
      });

      if (receipt.status !== "success") {
        throw new Error("Redemption transaction failed.");
      }

      console.log(
        "[INFO] Redemption successful. Transaction Hash:",
        receipt.transactionHash,
      );
      return receipt.transactionHash;
    } catch (error: any) {
      console.error("[ERROR] Failed to redeem BGT:", error.message);
      throw new Error(`Failed to redeem BGT: ${error.message}`);
    }
  },
};
