import {createPublicClient, createWalletClient, http, PublicClient, WalletClient} from 'viem';
import { berachainTestnetbArtio } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import {transfer} from "../tools";

/**
 * Main class for interacting with Ethereum
 *
 * @class BeraAgentKit
 * @property {WalletClient} client - Wallet client for signing transactions
 * @property {PublicClient} client - Public client for integration with blockchain
 * @property {string} openaiApiKey - API key for accessing OpenAI services
 */
export class BeraAgentKit {
  public walletClient: WalletClient;
  public publicClient: PublicClient;
  public openaiApiKey: string;


  constructor(privateKey: string, openaiApiKey: string, rpcUrl: string) {
    if (!privateKey.startsWith('0x')) {
      privateKey = `0x${privateKey}`;
    }
    
    this.walletClient = createWalletClient({
      account: privateKeyToAccount(privateKey as `0x${string}`),
      chain: berachainTestnetbArtio,
      transport: http(rpcUrl),
    });

    this.publicClient = createPublicClient({
          chain: berachainTestnetbArtio,
          transport: http(rpcUrl),
    });
  
    this.openaiApiKey = openaiApiKey;
  }

  async transfer(
      to: string,
      amount: string,
      tokenAddress?: string,
  ): Promise<string> {
    return transfer(this, to, amount, tokenAddress);
  }

}