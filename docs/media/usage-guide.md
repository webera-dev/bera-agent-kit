# How to Setup Locally

Please follow the steps below to setup **Bera Agent Kit** locally on your machine.

## Step-by-Step Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/bera-agent-kit.git
   ```

2. **Navigate to the Project Directory**
   ```bash
   cd bera-agent-kit
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment Variables**

   Create a `.env` file in the root directory of the project to store your environment variables securely. Example at "[.env.example](../.env.example)"

   RPC addresses are defined at [this](../src/constants/index.ts)

5. **Build the Project**

   Compile the TypeScript code to JavaScript using the build script:
   ```bash
   npm run build
   ```

   This will generate the compiled files in the `dist/` directory.

6. **Generate Documentation (Optional)**

   If you wish to generate the project documentation, use the following command:
   ```bash
   npm run docs
   ```

   The documentation will be available in the `docs/` directory.
