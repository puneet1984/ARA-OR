# === Streamlined Production Image ===
FROM node:20-alpine
RUN apk add --no-cache libc6-compat gcompat curl tar git
WORKDIR /app

# 1. Install process orchestrator manager globally
RUN npm install -g pm2

# 2. Extract and mount your workspace applications
COPY package*.json tsconfig.json ecosystem.config.js ./
RUN npm install

# 3. Compile your target code logic
COPY src/ ./src
RUN npm run build

# 4. Prepare workspace data paths and expose ports
RUN mkdir -p /app/data /app/uploads
EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
