# === Single-Stage Production Image ===
FROM node:20-alpine
RUN apk add --no-cache libc6-compat gcompat curl tar
WORKDIR /app

# 1. Install multi-process engine manager
RUN npm install -g pm2

# 2. Extract OmniRoute binary directly inside the primary target workpath
RUN curl -L -o omniroute.tar.gz "https://github.com" \
    && tar -xzf omniroute.tar.gz \
    && chmod +x omniroute

# 3. Synchronize application package layers and compile code logic
COPY package*.json tsconfig.json ecosystem.config.js ./
RUN npm ci
COPY src/ ./src
RUN npm run build

# 4. Prepare local persistent operational folder volumes
RUN mkdir -p /app/data /app/uploads
EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
