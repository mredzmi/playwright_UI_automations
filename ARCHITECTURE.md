# Generic UI Test Framework with AI Self-Healing & BDD

## Architecture Diagram

```mermaid
graph TD
    A[Feature File (.feature)] -->|Uses| B[Step Definitions]
    B -->|Calls| C[Page Objects (POM)]
    C -->|Inherits| D[Base Page]
    D -->|Wraps| E[Playwright Actions]
    D -->|On Failure| F[AI Healer]
    F -->|Analyzes DOM| G[Current Page HTML]
    F -->|Returns| H[Healed Selector]
    H -->|Retry| E
```

## Components

1.  **BDD Layer (Cucumber)**
    *   **Feature Files**: Define scenarios in Gherkin (Given/When/Then).
    *   **Step Definitions**: Map Gherkin steps to TypeScript code.
    *   **Hooks**: Manage Browser/Context lifecycle (setup/teardown).

2.  **Page Object Model (POM)**
    *   **BasePage**: The core wrapper. It intercepts Playwright actions. If an action fails (e.g., element not found), it delegates to the `AIHealer`.
    *   **Concrete Pages** (e.g., `LoginPage`): Define specific locators and business logic methods (e.g., `login()`).

3.  **AI Healer (Self-Healing)**
    *   **AIHealer**: A utility that takes a failed selector and the current page DOM (via Cheerio).
    *   **Logic**: It parses the DOM to find elements that "look like" the missing element (matching text, similar attributes, nearby labels) and returns a new selector.
    *   **Recovery**: The BasePage uses the new selector to retry the action seamlessly.

4.  **Core Technologies**
    *   **TypeScript**: Type safety.
    *   **Playwright**: Browser automation.
    *   **Cucumber**: BDD runner.
    *   **Cheerio**: Fast HTML parsing for the healer.
