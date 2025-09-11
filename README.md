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

## Environment Setup

### Creating `.env` File <a id="env-setup"></a>

The `.env` file should be created in the project root directory:
```
gates-gis-chat-app/
├── src/
├── public/
├── .env  👈 Create here
├── package.json
└── ...
```

Choose one of these methods to create your `.env` file:

1. **Using Terminal**:
    ```bash
    touch .env
    ```

2. **Using VS Code**:
    1. Right-click in the Explorer panel
    2. Select "New File"
    3. Name it ".env"

#### Required Environment Variables

Add these variables to your `.env` file:

```ini
# API Keys
VITE_GEMINI_API_KEY=chatgptparin   # Google Gemini API key
VITE_MAPBOX_ACCESS_TOKEN=mamamotoken   # Mapbox access token
```

> **Important**: Contact the development team to get the API keys and other required values

## Getting Started

You can run this project either using Docker (recommended) or manual setup.

### 🐳 Docker Setup (Recommended)

1. Install Docker Desktop for Mac:
    ```bash
    # Using Homebrew
    brew install --cask docker
    ```
    Or download from [Docker Hub](https://docs.docker.com/desktop/install/mac-install/)

2. Clone the repository:
    ```bash
    git clone git@gitlab.com:albert.asti/gates-gis-chat-app.git
    cd gates-gis-chat-app
    ```

3. Start the development server:
    ```bash
    # Start in development mode
    docker compose up dev

    # Or with detached mode
    docker compose up -d dev
    ```

4. Open [http://localhost:3002](http://localhost:3002) in your browser

### 🐳 Docker Commands

```bash
# Start development environment
docker compose up dev

# Stop containers
docker compose down

# View logs
docker compose logs -f dev

# Rebuild container (if dependencies change)
docker compose build --no-cache dev
```

### Manual Local ~~Hell~~ Setup

#### Prerequisites

- Node.js >= 20.x
- pnpm >= 10.x
- macOS, Windows, or Linux

#### Instructions

1. Install `pnpm` if you haven't:
    ```bash
    npm install -g pnpm@latest-10
    ```

2. Clone the repository:
    ```bash
    git clone git@gitlab.com:albert.asti/gates-gis-chat-app.git
    cd gates-gis-chat-app
    ```

3. Install dependencies:
    ```bash
    pnpm install
    ```

4. Start the development server:
    ```bash
    # Default port (5173)
    pnpm dev

    # Or specify a custom port
    pnpm dev --port 3002
    ```

5. Open [http://localhost:3002](http://localhost:3002) in your browser

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