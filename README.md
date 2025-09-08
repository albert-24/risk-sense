# GATES GIS Chat App

## Main Features

- **GIS-Powered Chat Assistant**
  - Ask questions about Philippine geography topics
  - Currently using Gemini API (temporary integration)
  - Geographical context-aware responses

- **Interactive Map Layers**
  - Toggle visibility of different map layers
  - Layer popup with detailed information

- **Smart Redirection (Powered by GATES AI)**
  - Intelligent query analysis by GATES AI
  - Automatic redirection to GATES Admin Dashboard when relevant

## Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm >= 10.x
- macOS, Windows, or Linux

### Manual Local Setup

1. Install `pnpm` if you haven't:
    ```bash
    npm install -g pnpm@latest-10
    ```

2. Clone the repository:
    ```bash
    git clone git@gitlab.com:albert.asti/gates-gis-chat-app.git
    cd map-chat
    ```

3. Install dependencies:
    ```bash
    pnpm install
    ```

4. Set up environment variables:
    ```bash
    cp .env
    ```
    > **Important**: Contact the development team to get the required environment values

5. Start the development server:
    ```bash
    # Default port (5173)
    pnpm dev

    # Or specify a custom port
    pnpm dev --port 3002
    ```

6. Open [http://localhost:3002](http://localhost:3002) in your browser

    > **Note**: The default port is 5173, but you can change it using the `--port` flag or by setting `VITE_PORT` in your `.env` file:
    ```bash
    # in .env file
    VITE_PORT=3002
    ```

### Available Scripts

```bash
# Development server (default port 5173)
pnpm dev

# Development server (custom port)
pnpm dev --port 3002

# Type checking
pnpm type-check

# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Troubleshooting

If you encounter any issues:

1. Clear dependencies and reinstall:
    ```bash
    rm -rf node_modules
    pnpm install
    ```

2. Clear TypeScript build cache:
    ```bash
    pnpm exec tsc --clean
    ```

3. Verify Node.js version:
    ```bash
    node --version
    ```