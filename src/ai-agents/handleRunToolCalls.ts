import OpenAI from "openai";
import { Run } from "openai/resources/beta/threads/runs";
import { Thread } from "openai/resources/beta/threads";
import { tools } from "../tools/allTools";

export async function handleRunToolCalls(
  run: Run,
  client: OpenAI,
  thread: Thread,
): Promise<Run> {
  console.log(`[INFO] Handling tool calls for run ${run.id}`);

  const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls;
  if (!toolCalls || toolCalls.length === 0) return run;

  const toolOutputs: OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[] =
    [];

  // Use Promise.allSettled to handle all tool calls concurrently while capturing failures
  const results = await Promise.allSettled(
    toolCalls.map(async (tool) => {
      const toolConfig = tools[tool.function.name];
      if (!toolConfig) {
        console.error(`[ERROR] Tool ${tool.function.name} not found`);
        return null;
      }

      console.log(`[INFO] Executing: ${tool.function.name}`);
      try {
        const args = JSON.parse(tool.function.arguments);
        const output = await toolConfig.handler(args);
        return {
          tool_call_id: tool.id,
          output: String(output),
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          tool_call_id: tool.id,
          output: `Error: ${errorMessage}`,
        };
      }
    }),
  );

  // Filter and collect only successful tool outputs
  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      toolOutputs.push(result.value);
    } else if (result.status === "rejected") {
      console.error(`[ERROR] Tool call failed: ${result.reason}`);
    }
  }

  if (toolOutputs.length === 0) {
    console.log(`[INFO] No valid tool outputs to submit for run ${run.id}`);
    return run;
  }

  console.log(
    `[INFO] Submitting ${toolOutputs.length} tool outputs for run ${run.id}`,
  );
  return client.beta.threads.runs.submitToolOutputsAndPoll(thread.id, run.id, {
    tool_outputs: toolOutputs,
  });
}
