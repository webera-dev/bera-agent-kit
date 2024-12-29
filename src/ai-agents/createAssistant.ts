import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants";
import { tools } from "../tools/allTools";

/**
 * This function to creates an assistant using OpenAI’s Beta Assistants API
 * @param client - OpenAI client
 * @returns - The created assistant
 */

export async function createAssistant(client: OpenAI): Promise<Assistant> {
  return await client.beta.assistants.create({
    model: "gpt-4o-mini",
    name: "My Assistant",
    instructions: `You are a helpful assistant.
        You are in control of a wallet that you can use what ever you want to do.
        You can use the following tools to interact with the wallet:
        - get_balance: Get the balance of a wallet.
        - transfer: Transfer native currency or ERC20 tokens to a recipient.
        - kodiak_swap: Perform a token swap on Kodiak
        `,
    tools: Object.values(tools).map((tool) => tool.definition),
  });
}
