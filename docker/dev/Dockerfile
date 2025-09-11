FROM node:22-slim

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the code
COPY . .

# Expose port 5173 (Vite's default dev server port)
EXPOSE 5173

# Start development server
CMD ["pnpm", "dev", "--host"]
