import { createPublicClient, http } from 'viem';
import { berachainTestnetbArtio } from 'viem/chains';

export function createViemPublicClient() {
  return createPublicClient({
    chain: berachainTestnetbArtio,
    transport: http(),
  });
}
