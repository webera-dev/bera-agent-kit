import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads";
/**
 * This function is particularly useful in applications that need to initiate conversations with OpenAI
 * @param client - OpenAI client
 * @param message - Optional message to send to the thread
 * @returns - The created thread
 */

export async function createThread(
  client: OpenAI,
  message?: string,
): Promise<Thread> {
  const thread = await client.beta.threads.create();
  if (message) {
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });
  }

  return thread;
}
