import { Address, parseUnits } from "viem";
import { TokenABI } from "../constants/tokenABI";
import axios from "axios";
import { URL } from "../constants";

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

export const fetchVaultAndTokenAddress = async (
  token: Address,
  isVault: boolean,
): Promise<{ vaultAddress: Address; stakingTokenAddress: Address }> => {
  try {
    console.log(`[INFO] Fetching vaults data...`);
    const response = await axios.get(URL.BGTVaultURL);
    const vaults = response.data.vaults;

    for (const vault of vaults) {
      if (isVault && vault.vaultAddress === token) {
        console.log(`[INFO] Found matching vault: ${vault.vaultAddress}`);
        return {
          vaultAddress: vault.vaultAddress as Address,
          stakingTokenAddress: vault.stakingTokenAddress as Address,
        };
      } else if (!isVault && vault.stakingTokenAddress === token) {
        console.log(
          `[INFO] Found matching staking token: ${vault.stakingTokenAddress}`,
        );
        return {
          vaultAddress: vault.vaultAddress as Address,
          stakingTokenAddress: vault.stakingTokenAddress as Address,
        };
      }
    }

    throw new Error(
      `No matching ${isVault ? "staking token" : "vault"} address found for ${token}`,
    );
  } catch (error: any) {
    console.error("[ERROR] Failed to fetch addresses:", error.message);
    throw error;
  }
};
