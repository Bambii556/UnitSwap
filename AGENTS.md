
# Agent Instructions for UnitSwap Repository

This document provides guidelines for AI coding agents operating within the UnitSwap repository. Adhering to these instructions ensures consistency, maintainability, and efficiency in code development.

## 1. Build, Lint, and Test Commands

**Linting:**
- To lint the codebase, run:
  ```bash
  npm run lint
  ```

**Testing:**
- **Running All Tests:** While no specific test command is listed in `package.json`, common commands like `npm test` or `npx jest` are likely candidates. If Jest is used, you can run all tests with:
  ```bash
  npm test
  # or
  npx jest
  ```
- **Running a Single Test:** To run a specific test file (assuming Jest or a similar framework), use the following pattern:
  ```bash
  npm test -- <path/to/test/file.test.ts>
  # or
  npx jest <path/to/test/file.test.ts>
  ```
  Replace `<path/to/test/file.test.ts>` with the actual path to the test file. Adjust the command if a different testing framework is in use.

**Building:**
- There are no explicit build commands in the `package.json` scripts. For Expo projects, related commands like `expo build` might be relevant for creating production builds, but are not directly configured here.

## 2. Code Style Guidelines

**Language:**
- **TypeScript:** The project primarily uses TypeScript, emphasizing static typing for improved code quality and maintainability.

**Formatting:**
- **Indentation:** Consistent use of 2 spaces for indentation.
- **Line Endings:** LF (Line Feed).
- **Code Formatting Tools:** ESLint and Prettier are likely configured (indicated by `eslint.config.js`, `prettier-plugin-tailwindcss`, and `eslint-config-expo` in `package.json`). Ensure code adheres to the established formatting rules.

**Imports:**
- **Path Aliases:** Use path aliases for imports, for example:
  ```typescript
  import { cleanInput } from "@/utils/number-format";
  ```
  These aliases are typically configured in `tsconfig.json` or `jsconfig.json`.
- **Order:** Imports are generally grouped (e.g., third-party, local modules) and sorted alphabetically within groups, though specific project conventions may vary.

**Naming Conventions:**
- **Variables & Functions:** CamelCase (e.g., `cleanInput`, `rawValueRef`).
- **Components:** PascalCase (e.g., `NumberInput`, `SettingsPage`).
- **Constants:** SCREAMING_SNAKE_CASE for global constants (e.g., `MAX_RETRIES`), or PascalCase for enum-like constants within modules.

**Types:**
- Define explicit types for function parameters, return values, and component props whenever possible.
- Use interfaces or types for complex object structures.

**Error Handling:**
- **Basic Checks:** Implement checks for invalid inputs, potential `null` or `undefined` values, and `NaN` results where applicable.
- **Throwing Errors:** Use `throw new Error("Descriptive message")` for critical failures.
- **Catching Errors:** Use `try...catch` blocks for operations that might fail (e.g., network requests, file I/O, complex calculations).

**Modularity & Structure:**
- Organize code into logical modules and components.
- Favor small, focused functions and components.
- Utilize hooks for reusable component logic.

## 3. Cursor and Copilot Specific Rules

- No specific Cursor (`.cursor/rules/` or `.cursorrules`) or Copilot (`.github/copilot-instructions.md`) configuration files were found in the repository root or their expected subdirectories at the time of analysis. Agents should operate based on general best practices and the project-specific guidelines above.
