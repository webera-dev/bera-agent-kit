# Bera Agent Kit 🐻🚀

Open-source agent kit for interacting with Berachain protocols using AI and blockchain technologies.

## 🌟 Features

- 🤖 AI-powered blockchain interaction
- 🔗 Seamless integration with Berachain
- 💻 TypeScript support
- 🛠️ Multiple blockchain tools and utilities

## 📦 Installation

```bash
npm install bera-agent-kit
```

## 🚀 Quick Start

```typescript
import { BeraAgent } from 'bera-agent-kit';
import { createViemWalletClient } from 'bera-agent-kit/utils/createViemWalletClient';

async function main() {
  // Create wallet client
  const walletClient = createViemWalletClient();

  // Initialize BeraAgent
  const agent = new BeraAgent(
    { openAIApiKey: process.env.OPENAI_API_KEY },
    walletClient
  );

  // Initialize and interact
  await agent.initialize();
  const response = await agent.sendMessage('Check my wallet balance');
  console.log(response);
}
```

## 🔧 Prerequisites

- Node.js 18+
- OpenAI API Key
- Berachain Wallet

## 📚 Documentation

Full documentation available in the [docs](./docs) directory.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT License

## 🐞 Issues

Report issues on our [GitHub Issues](https://github.com/Webera-Finance/bera-agent-kit/issues)