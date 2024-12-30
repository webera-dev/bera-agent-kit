import { Address, parseUnits } from "viem";
import { TokenABI } from "../constants/tokenABI";

export const fetchTokenDecimalsAndParseAmount = async (
  walletClient: any,
  token: Address,
  amount: number,
): Promise<bigint> => {
  console.log(`[INFO] Fetching token decimals for ${token}`);
  const tokenDecimals = await walletClient.readContract({
    address: token,
    abi: TokenABI,
    functionName: "decimals",
    args: [],
  });
  const parsedAmount = parseUnits(amount.toString(), tokenDecimals);
  console.log(`[INFO] Parsed amount: ${parsedAmount.toString()} units`);
  return parsedAmount;
};

export const checkAndApproveAllowance = async (
  walletClient: any,
  token: Address,
  spender: Address,
  amount: bigint,
): Promise<void> => {
  console.log(`[INFO] Checking allowance for ${token} to spender ${spender}`);

  // Fetch current allowance
  const allowance = await walletClient.readContract({
    address: token,
    abi: TokenABI,
    functionName: "allowance",
    args: [walletClient.account.address, spender],
  });

  console.log(`[INFO] Current allowance: ${allowance}`);

  if (BigInt(allowance) < amount) {
    console.log(
      `[INFO] Allowance insufficient. Approving ${amount} for spender ${spender}`,
    );

    // Approve the required amount
    const approvalTx = await walletClient.writeContract({
      address: token,
      abi: TokenABI,
      functionName: "approve",
      args: [spender, amount],
    });

    const approvalReceipt = await walletClient.waitForTransactionReceipt({
      hash: approvalTx as `0x${string}`,
    });

    if (approvalReceipt.status !== "success") {
      throw new Error("Approval transaction failed");
    }

    console.log(`[INFO] Approval successful`);
  } else {
    console.log(`[INFO] Sufficient allowance available`);
  }
};
