import "dotenv/config";
import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads";
import { Assistant } from "openai/resources/beta/assistants";
import { createAssistant } from "./ai-agents/createAssistant";
import { createThread } from "./ai-agents/createThread";
import { createRun } from "./ai-agents/createRun";
import { performRun } from "./ai-agents/performRun";
import { log } from "./utils/logger";
import { WalletClient } from "viem";

export interface BeraAgentConfig {
  openAIApiKey: string;
}

export class BeraAgent {
  private openAIClient: OpenAI;
  private assistant: Assistant | null = null;
  private thread: Thread | null = null;
  private walletClient: WalletClient;

  constructor(config: BeraAgentConfig, walletClient: WalletClient) {
    this.openAIClient = new OpenAI({ apiKey: config.openAIApiKey });
    this.walletClient = walletClient;
  }

  async initialize(): Promise<void> {
    this.assistant = await createAssistant(
      this.openAIClient,
      this.walletClient,
    );
    this.thread = await createThread(this.openAIClient);
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.assistant || !this.thread) {
      throw new Error("BeraAgent not initialized. Call initialize() first.");
    }

    await this.openAIClient.beta.threads.messages.create(this.thread.id, {
      role: "user",
      content: message,
    });

    const run = await createRun(
      this.openAIClient,
      this.thread,
      this.assistant.id,
    );
    const result = await performRun(
      run,
      this.openAIClient,
      this.thread,
      this.walletClient,
    );

    if (result?.type === "text") {
      return result.text.value;
    }

    throw new Error("Unexpected response format");
  }

  getAssistant(): Assistant | null {
    return this.assistant;
  }

  getThread(): Thread | null {
    return this.thread;
  }

  getWalletClient(): WalletClient {
    return this.walletClient;
  }
}

// Export individual components for advanced usage
export { createAssistant, createThread, createRun, performRun };
export { log as logger };
