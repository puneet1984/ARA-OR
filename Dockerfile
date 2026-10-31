# === Hardened Production Image ===
# 1. Upgrade to Node 22 to satisfy OmniRoute's dependency requirements
FROM node:22-alpine

# 2. Install Python, make, and g++ so native modules (better-sqlite3) can compile successfully
RUN apk add --no-cache libc6-compat gcompat curl tar git python3 make g++
WORKDIR /app

# 3. Install process orchestrator manager globally
RUN npm install -g pm2

# 4. Extract and mount your workspace applications
COPY package*.json tsconfig.json ecosystem.config.js ./
RUN npm install

# 5. Compile your target code logic
COPY src/ ./src
RUN npm run build

# 6. Prepare workspace data paths and expose ports
RUN mkdir -p /app/data /app/uploads
EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
