# **GATES GIS Chat App**

<p>
  <img src="https://img.shields.io/badge/docker-latest-blue.svg" />
  <img src="https://img.shields.io/badge/npm-22.x-cc3534.svg" />
  <img src="https://img.shields.io/badge/pnpm-10.x-f9ad00.svg" />
</p>

<a name="contents"></a>

## Table of Contents

- [Main Features](#main-features)
- [Getting Started (Development)](#getting-started)
- [Deployment](#deployment)

<a name="main-features"></a>

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

<a name="getting-started"></a>

## Getting Started (Development)

### Clone the Repository
```bash
git clone git@gitlab.com:albert.asti/gates-gis-chat-app.git
```
> Your ssh public key in `/.ssh` folder is required

### Set Up Dev Environment

#### Using VS Code
1. Open VS Code.
2. Click **File** > **Open Folder...** (or use `Cmd+O` / `Ctrl+O`).
3. Select the `gates-gis-chat-app` project folder and click **Open**.
4. (Optional) If prompted, install recommended extensions for best development experience.

#### Creating `.env` File

The `.env` file should be created in the project root directory:
```
gates-gis-chat-app/
├── public/
├── src/
├── .env  👈 Create here
├── package.json
└── ...
```

Choose one of these methods to create the `.env` file:

1. **Using Terminal**:
    ```bash
    touch .env
    ```

2. **Using VS Code**:
    1. Right-click in the Explorer panel
    2. Select "New File"
    3. Name it ".env"

#### Required Environment Variables

Add these variables to the `.env` file:

```ini
VITE_GEMINI_API_KEY=chatgptparin        # Google Gemini API key
VITE_MAPBOX_ACCESS_TOKEN=mamamotoken    # Mapbox access token
```

> **Note**: Contact the development team to get the API keys and other required values

### Run Locally

You can run this project either using Docker or manual setup.

#### Docker Setup *`(Recommended)`*

1. Install Docker:
    - [Docker CLI for Mac](https://dev.to/dutchskull/setting-up-dynamic-environment-variables-with-vite-and-docker-5cmj)

2. From the project's root folder, start the development server:
- in development mode
    ```bash
    docker compose up dev
    ```
- or with detached mode
    ```bash
    docker compose up -d dev
    ```
3. Open [http://localhost:3002](http://localhost:3002) in the browser

##### Docker Commands
- Stop containers
    ```bash
    docker compose down dev
    ```

- View logs
    ```bash
    docker compose logs -f
    ```

- Rebuild container (if dependencies change)
    ```bash
    docker compose build --no-cache
    ```

- Clear docker caches
    ```bash
    docker system df
    ```


#### Manual Local ~~Hell~~ Setup

##### Prerequisites

- Node.js >= 20.x
- pnpm >= 10.x
- macOS, Windows, or Linux

##### Instructions

1. Install `pnpm` if you haven't:
    ```bash
    npm install -g pnpm@latest-10
    ```

2. Go to the project's root folder.

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

5. Open [http://localhost:3002](http://localhost:3002) in the browser

    > **Note**: The default port is 5173, but you can change it using the `--port` flag or by setting `VITE_PORT` in the `.env` file:
    ```bash
    # in .env file
    VITE_PORT=3002
    ```

##### Available Scripts
- Development server (default port 5173)
    ```bash
    pnpm dev
    ```

- Development server (custom port)
    ```bash
    pnpm dev --port 3002
    ```

- Type checking
    ```bash
    pnpm type-check
    ```

- Run tests
    ```bash
    pnpm test
    ```

- Build for production
    ```bash
    pnpm build
    ```

- Preview production build
    ```bash
    pnpm preview
    ```

##### Troubleshooting

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

<a name="deployment"></a>

## Deployment
Coming soon...
