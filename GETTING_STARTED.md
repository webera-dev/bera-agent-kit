# Getting Started

Welcome to the Bera Agent Kit project! Follow the steps below to set up your development environment and start contributing.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Git](https://git-scm.com/) (version 2.20 or higher)
- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

### Step 1: Fork the Repository

1. Navigate to the [Bera Agent Kit repository](https://github.com/Webera-Finance/bera-agent-kit).
2. Click the "Fork" button in the top-right corner to create a copy of the repository under your GitHub account.

### Step 2: Clone Your Fork

Clone the forked repository to your local machine using Git:

```bash
git clone https://github.com/YourUsername/bera-agent-kit.git
```

Replace YourUsername with your actual GitHub username.

### Step 3: Navigate to the Project Directory

```bash
cd bera-agent-kit
```

### Step 4: Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### Step 5: Set Up Environment Variables

Create a .env file in the root directory of the project and add the necessary environment variables. You can use the .env.example file as a reference.

```bash
cp .env.example .env
```

Then, open .env and configure the variables as needed.

### Step 6: Run the Project

Start the development server:

``` bash
npm start
```

The application should now be running at http://localhost:3000.

## Contributing
After setting up the project, you can start contributing by following these steps:

#### Create a Branch

Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
```

#### Make Changes

Implement your changes and ensure the code adheres to the project's coding standards.

#### Commit Your Changes

Commit your changes with a descriptive message:

```bash
git commit -m "Add feature XYZ"
```

#### Push to Your Fork

Push your branch to your forked repository:

```bash
git push origin feature/your-feature-name
```

#### Create a Pull Request

Go to the original repository and create a pull request from your forked repository's branch.

## Troubleshooting
If you encounter any issues while setting up or running the project, please check the following:

- Ensure all prerequisites are installed and updated.
- Verify that your .env file is correctly configured.
- Check the project's Issues page to see if your issue has already been reported.
- Feel free to create a new issue if you need further assistance.

## Thank you for your interest in contributing to the Bera Agent Kit project!
