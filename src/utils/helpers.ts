import { Address, formatUnits, parseUnits } from "viem";
import { TokenABI } from "../constants/tokenABI";
import axios from "axios";
import { URL } from "../constants";
import { log } from "./logger";

const tokenDecimalsCache: Map<string, number> = new Map();

export const fetchTokenDecimalsAndFormatAmount = async (
  walletClient: any,
  token: Address,
  amount: bigint,
): Promise<string> => {
  if (!tokenDecimalsCache.has(token)) {
    console.log(`[INFO] Fetching token decimals for ${token}`);
    const tokenDecimals = await walletClient.readContract({
      address: token,
      abi: TokenABI,
      functionName: "decimals",
      args: [],
    });
    tokenDecimalsCache.set(token, Number(tokenDecimals));
  }

  const tokenDecimals = tokenDecimalsCache.get(token)!;
  const formattedAmount = formatUnits(amount, tokenDecimals);
  console.log(`[INFO] Formatted amount: ${formattedAmount.toString()} units`);
  return formattedAmount;
};

export const fetchTokenDecimalsAndParseAmount = async (
  walletClient: any,
  token: Address,
  amount: number | bigint,
): Promise<bigint> => {
  if (!tokenDecimalsCache.has(token)) {
    log.info(`[INFO] Fetching token decimals for ${token}`);
    const tokenDecimals = await walletClient.readContract({
      address: token,
      abi: TokenABI,
      functionName: "decimals",
      args: [],
    });
    tokenDecimalsCache.set(token, Number(tokenDecimals));
  }

  const tokenDecimals = tokenDecimalsCache.get(token)!;
  const parsedAmount = parseUnits(amount.toString(), tokenDecimals);
  log.info(`[INFO] Parsed amount: ${parsedAmount.toString()} units`);
  return parsedAmount;
};

export const checkAndApproveAllowance = async (
  walletClient: any,
  token: Address,
  spender: Address,
  amount: bigint,
): Promise<void> => {
  log.info(`[INFO] Checking allowance for ${token} to spender ${spender}`);

  // Fetch current allowance
  const allowance = await walletClient.readContract({
    address: token,
    abi: TokenABI,
    functionName: "allowance",
    args: [walletClient.account.address, spender],
  });

  log.info(`[INFO] Current allowance: ${allowance}`);

  if (BigInt(allowance) < amount) {
    log.info(
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

    log.info(`[INFO] Approval successful`);
  } else {
    log.info(`[INFO] Sufficient allowance available`);
  }
};

export const fetchVaultAndTokenAddress = async (
  token: Address,
  isVault: boolean,
): Promise<{ vaultAddress: Address; stakingTokenAddress: Address }> => {
  try {
    log.info(`[INFO] Fetching vaults data...`);
    const response = await axios.get(URL.BGTVaultURL);
    const vaults = response.data.vaults;

    for (const vault of vaults) {
      if (isVault && vault.vaultAddress === token) {
        log.info(`[INFO] Found matching vault: ${vault.vaultAddress}`);
        return {
          vaultAddress: vault.vaultAddress as Address,
          stakingTokenAddress: vault.stakingTokenAddress as Address,
        };
      } else if (!isVault && vault.stakingTokenAddress === token) {
        log.info(
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
    log.error("[ERROR] Failed to fetch addresses:", error.message);
    throw error;
  }
};
