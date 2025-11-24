# Contributing to ModbusX

Thank you for your interest in contributing to ModbusX! This document outlines the guidelines and best practices for contributing to the project. By following these guidelines, you help ensure a smooth and efficient development process.

---

## Getting Started

### Cloning the Repository

1. Fork the repository on GitHub.
2. Clone your forked repository:
   ```bash
   git clone https://github.com/KonorOko/modbusx.git
   ```
3. Navigate to the project directory:
   ```bash
   cd modbusx
   ```

### Setting Up the Development Environment

1. Install dependencies using `pnpm`:
   ```bash
   pnpm install
   ```
2. Ensure you have the following installed:

   - **Node.js**: v16 or later
   - **Rust**: Stable version (install via [rustup](https://rustup.rs/))
   - **Tauri prerequisites**: Follow the [Tauri setup guide](https://tauri.app/v1/guides/getting-started/prerequisites).

3. Run the development server:
   ```bash
   pnpm tauri dev
   ```

---

## Project Structure

The project is divided into two main parts:

### 1. **Frontend (`src`)**

- Built with React and TypeScript.
- Contains UI components, hooks, layouts, and routes.
- Key directories:
  - `src/components`: Reusable UI components.
  - `src/hooks`: Custom React hooks.
  - `src/routes`: Application routes.
  - `src/windows`: Page-specific components.

### 2. **Backend (`src-tauri`)**

- Built with Rust and Tauri.
- Manages Modbus connections and system-level operations.
- Key files:
  - `src-tauri/src/main.rs`: Entry point for the Tauri backend.
  - `src-tauri/tauri.conf.json`: Tauri configuration file.

---

## Code Conventions

### General Guidelines

- Follow the existing code style and structure.
- Use **Prettier** and **ESLint** for consistent formatting:
  ```bash
  pnpm lint
  pnpm format
  ```

### Commit Messages

- Use the following format for commit messages:
  ```
  <type>(<scope>): <description>
  ```
  Examples:
  - `feat: add new button component`
  - `fix: resolve TCP connection timeout issue`

### Branch Naming

- Use descriptive branch names:
  ```
  <type>/<short-description>
  ```
  Examples:
  - `feature/add-settings-page`
  - `bugfix/fix-connection-error`

---

## How to Contribute

### Submitting Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit them.
3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a pull request (PR) to the `main` branch.

### Pull Request Guidelines

- Ensure your PR description includes:
  - A summary of the changes.
  - Any relevant issue numbers (e.g., `Closes #123`).
- Keep PRs focused and small. Large PRs are harder to review.

---

## Running CI Locally

To ensure your changes pass the CI checks, run the following commands locally:

1. **Linting**:
   ```bash
   pnpm lint
   ```
2. **Type Checking**:
   ```bash
   pnpm type-check
   ```
3. **Build**:
   ```bash
   pnpm build
   ```

---

## Creating a Release

1. Update the version in `package.json` and `src-tauri/Cargo.toml` following [Semantic Versioning](https://semver.org/).
2. Commit the version bump:
   ```bash
   git commit -m "chore: bump version to vX.Y.Z"
   ```
3. Create a new tag:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
4. GitHub Actions will automatically generate binaries and publish them to the [Releases](https://github.com/KonorOko/modbusx/releases) page.

---

## Need Help?

If you have any questions or need assistance, feel free to open a discussion in the [Discussions](https://github.com/KonorOko/modbusx/discussions) section or reach out via an issue.

Thank you for contributing to ModbusX!
