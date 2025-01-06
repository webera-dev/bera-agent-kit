import { createTestClient, http } from "viem";
import { foundry } from "viem/chains";

export function createViemTestClient(mode: "anvil" | "hardhat") {
  return createTestClient({
    chain: foundry,
    mode: mode,
    transport: http(),
  });
}
