# === Stage 1: Fetch OmniRoute release binary ===
FROM alpine:3.19 AS gateway-fetcher
RUN apk add --no-cache curl tar
WORKDIR /fetch
RUN curl -L -o omniroute.tar.gz "https://github.com" \
    && tar -xzf omniroute.tar.gz \
    && mv omniroute /fetch/omniroute

# === Stage 2: Core Execution Runtime Stage ===
FROM node:20-alpine
RUN apk add --no-cache libc6-compat gcompat
WORKDIR /app

# Install global process manager
RUN npm install -g pm2

# Copy architecture configurations
COPY package*.json tsconfig.json ecosystem.config.js ./
RUN npm ci

# Copy application layers and compile to JavaScript
COPY src/ ./src
RUN npm run build

# Pull binary executable from Stage 1
COPY --from=gateway-fetcher /fetch/omniroute /app/omniroute
RUN chmod +x /app/omniroute

# Prepare application data directories
RUN mkdir -p /app/data /app/uploads

# Expose Render default deployment target port
EXPOSE 3000

# Start multi-process manager
CMD ["pm2-runtime", "ecosystem.config.js"]
