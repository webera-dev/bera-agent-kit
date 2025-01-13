# bera-agent-kit
Open-source agent kit for interacting with Berachain protocols

## Installation

```bash
npm install bera-agent-kit
```

## Quick Start

```typescript
import { BeraAgent } from 'bera-agent-kit';

async function main() {
  const agent = new BeraAgent({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Initialize the agent
  await agent.initialize();

  // Send a message and get a response
  const response = await agent.sendMessage('What can you help me with on Berachain?');
  console.log(response);
}
```

## Features

- Easy-to-use API for interacting with Berachain protocols
- Built-in OpenAI integration for intelligent responses
- Support for common operations like staking, borrowing, and swapping
- TypeScript support out of the box

## Environment Variables

Create a `.env` file in your project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Advanced Usage

See the [examples](./examples) directory for more usage examples.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute.

## Documentation

For detailed API documentation and guides, see our [documentation](./docs).

## License

MIT