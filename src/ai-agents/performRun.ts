import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads";
import { Run } from "openai/resources/beta/threads/runs";
import { handleRunToolCalls } from "./handleRunToolCalls";
import { log } from "../utils/logger";

// Helper function to log with elapsed time
function logWithTime(message: string, startTime: number) {
  const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1); // Calculate elapsed time in seconds
  log.info(`${message} - ${elapsedSeconds}s`);
}

export async function performRun(run: Run, client: OpenAI, thread: Thread) {
  const overallStartTime = Date.now();
  logWithTime(`Performing run ${run.id}`, overallStartTime);

  while (run.status === "requires_action") {
    const startTime = Date.now();
    run = await handleRunToolCalls(run, client, thread);
    logWithTime(`Completed action for run ${run.id}`, startTime);
  }

  if (run.status === "failed") {
    const errorMessage = `I encountered an error: ${run.last_error?.message || "Unknown error"}`;
    log.error(`Run failed: ${run.last_error}`);
    await client.beta.threads.messages.create(thread.id, {
      role: "assistant",
      content: errorMessage,
    });
    logWithTime(`Run ${run.id} failed`, overallStartTime);
    return {
      type: "text",
      text: {
        value: errorMessage,
        annotations: [],
      },
    };
  }

  const messages = await client.beta.threads.messages.list(thread.id);
  const assistantMessage = messages.data.find(
    (message) => message.role === "assistant",
  );

  logWithTime(
    `Assistant message: ${assistantMessage?.content[0]}`,
    overallStartTime,
  );

  return (
    assistantMessage?.content[0] || {
      type: "text",
      text: { value: "No response from assistant", annotations: [] },
    }
  );
}
