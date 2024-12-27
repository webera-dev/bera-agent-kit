import { createAssistant } from "./ai-agents/createAssistant";
import OpenAI from "openai";
import "dotenv/config";
import { createThread } from "./ai-agents/createThread";
import { performRun } from "./ai-agents/performRun";
import { createRun } from "./ai-agents/createRun";

async function main() {
    const openAIClient = new OpenAI();
    // const message = "Hello, I'm a user message";
    const message = "Hello, Can you transfer token 0x556b758AcCe5c4F2E1B57821E2dd797711E790F4 to 0x3D3666fe91F74D6a049C3b72078b3c109242017A with amount 1";
    // const message = "Hello, Can you get the balance of my wallet? My wallet is 0xFedf0c0A4DA605D3DC84e6872C428F1524a24809";
    const assistant = await createAssistant(openAIClient);
    const thread = await createThread(openAIClient, message);
    const run = await createRun(openAIClient, thread, assistant.id);
    const result = await performRun(run, openAIClient, thread);

    console.log(result);

}

main();
