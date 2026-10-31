# === Unified Node.js Production Build ===
FROM node:20-alpine
RUN apk add --no-cache libc6-compat gcompat curl tar git
WORKDIR /app

# 1. Install PM2 globally to handle process orchestration
RUN npm install -g pm2

# 2. Download the live source archive of OmniRoute directly from its main branch
RUN curl -L -o omniroute.tar.gz "https://github.com" \
    && tar -xzf omniroute.tar.gz --strip-components=1 \
    && rm omniroute.tar.gz

# 3. Clean install OmniRoute dependencies
RUN npm ci --omit=dev || npm install --production

# 4. Copy your custom research ingress code into the workspace
COPY package*.json tsconfig.json ecosystem.config.js ./
RUN npm install
COPY src/ ./src
RUN npm run build

# 5. Establish storage paths and expose default ports
RUN mkdir -p /app/data /app/uploads
EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
