import "dotenv/config";
import OpenAI from "openai";
import readline from "readline";
import { createAssistant } from "./ai-agents/createAssistant";
import { createThread } from "./ai-agents/createThread";
import { createRun } from "./ai-agents/createRun";
import { performRun } from "./ai-agents/performRun";
import { Thread } from "openai/resources/beta/threads";
import { Assistant } from "openai/resources/beta/assistants";
import { log } from "./utils/logger";

// Initialize OpenAI client
const openAIClient = new OpenAI();

// Create a readline interface
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Type-safe promise-based question function
function askQuestion(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Handle chat conversation
async function handleChat(thread: Thread, assistant: Assistant): Promise<void> {
  const rl = createReadlineInterface();
  log.info('Chat started! Type "exit" to end the conversation.');

  try {
    while (true) {
      const userInput = await askQuestion(rl, "\nYou: ");

      if (userInput.trim().toLowerCase() === "exit") {
        log.info("Exiting the chat...");
        break;
      }

      try {
        await openAIClient.beta.threads.messages.create(thread.id, {
          role: "user",
          content: userInput,
        });

        const run = await createRun(openAIClient, thread, assistant.id);
        const result = await performRun(run, openAIClient, thread);

        if (result?.type === "text") {
          log.info("\nBeraBot:", result.text.value);
        }
      } catch (err) {
        log.error(
          "Error during message processing:",
          err instanceof Error ? err.message : "Unknown error",
        );
      }
    }
  } finally {
    rl.close();
  }
}

// Main function to initialize resources and start the chat
async function main(): Promise<void> {
  try {
    log.info("Initializing resources...");
    const assistant = await createAssistant(openAIClient);
    const thread = await createThread(openAIClient);

    await handleChat(thread, assistant);
  } catch (err) {
    log.error(
      "Error initializing chat:",
      err instanceof Error ? err.message : "Unknown error",
    );
    process.exit(1);
  }
}

// Entry point
main().catch((err) => {
  log.error(
    "Unhandled error:",
    err instanceof Error ? err.message : "Unknown error",
  );
  process.exit(1);
});
