import { BeraAgent } from "../src";
import { createViemWalletClient } from "../src/utils/createViemWalletClient";
import { log } from "../src/utils/logger";

async function example() {
  // Initialize the wallet client
  const walletClient = createViemWalletClient();

  // Initialize the BeraAgent with your OpenAI API key and wallet client
  const agent = new BeraAgent(
    {
      openAIApiKey: process.env.OPENAI_API_KEY || "",
    },
    walletClient,
  );

  log.info(
    `Initializing agent with wallet client ${walletClient.account.address}`,
  );
  try {
    // Initialize the agent (creates assistant and thread)
    await agent.initialize();

    // Check wallet balance first
    const balanceResponse = await agent.sendMessage(
      `Check my wallet balance with the wallet address ${walletClient.account.address}`,
    );
    log.info(`Balance Check Response: ${balanceResponse}`);

    // Transfer tokens to another wallet
    const transferResponse = await agent.sendMessage(
      `Help me transfer 0.1 Bera to wallet ${walletClient.account.address}`,
    );
    log.info(`Transfer Response: ${transferResponse}`);

    // Send a general message about Berachain
    const response = await agent.sendMessage(
      "What can you help me with on Berachain?",
    );
    log.info(`Berachain Capabilities Response: ${response}`);

    // // You can send multiple messages in the same thread
    // const response2 = await agent.sendMessage("How do I stake BGT?");
    // console.log("Staking Guide Response:", response2);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  example().catch(console.error);
}
