import { createAssistant } from "./ai-agents/createAssistant";
import OpenAI from "openai";
import "dotenv/config";
import { createThread } from "./ai-agents/createThread";
import { performRun } from "./ai-agents/performRun";
import { createRun } from "./ai-agents/createRun";

async function main() {
    const openAIClient = new OpenAI();
    // const message = "Hello, I'm a user message";
    const message = "Hello, Can you get the balance of my wallet? My wallet is 0x8239FBb3e3D0C2cDFd7888D8aF7701240Ac4DcA4";
    // const message = "Hello, Can you get the balance of my wallet? My wallet is 0xA06cE1d73009d0BC044728358f6Bb913A80e3309";
    const assistant = await createAssistant(openAIClient);
    const thread = await createThread(openAIClient, message);
    const run = await createRun(openAIClient, thread, assistant.id);
    const result = await performRun(run, openAIClient, thread);

    console.log(result);

}

main();
