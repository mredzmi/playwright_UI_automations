# AI Self-Healing UI Test Framework

A generic UI test framework built with **TypeScript**, **Playwright**, and **Cucumber (BDD)**. It features an **AI-powered self-healing mechanism** that automatically recovers from broken selectors during test execution.

## Features

*   **BDD Support**: Write tests in Gherkin syntax (Given/When/Then).
*   **AI Self-Healing**: Automatically attempts to find and interact with elements if the original selector fails, using DOM analysis.
*   **Page Object Model (POM)**: Organized and maintainable code structure.
*   **Video Recording**: Automatically records test sessions for debugging and observation.

## Prerequisites

*   Node.js (v14 or higher recommended)
*   npm

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install Playwright browsers:**
    ```bash
    npx playwright install
    ```
    If you are on Linux and encounter missing dependencies, you may also need:
    ```bash
    npx playwright install-deps
    ```

## Running Tests

To run the full test suite:

```bash
npm test
```

This command executes `cucumber-js` to run all feature files found in the `features/` directory.

## Project Structure

*   `features/`: Contains Gherkin `.feature` files defining test scenarios.
*   `steps/`: TypeScript step definitions mapping Gherkin steps to code.
*   `pages/`: Page Object classes encapsulating page-specific logic and locators.
*   `support/`: Cucumber hooks (setup/teardown) and world configuration.
*   `utils/`: Utility classes, including the `AIHealer`.
*   `videos/`: Directory where test run recordings are saved.

## How It Works

### AI Self-Healing
If a selector fails (e.g., an ID changes), the framework intercepts the error. The `AIHealer` analyzes the current page DOM to find the most likely candidate for the element based on text content, attributes, and structure. If a match is found, the action is retried automatically.

### Video Recording
Video recording is enabled by default in `support/hooks.ts`. Videos are saved to the `videos/` directory after each test run. Note that this directory is git-ignored to prevent bloating the repository.
