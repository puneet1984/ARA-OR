# === Unified Production Image ===
FROM node:20-alpine
RUN apk add --no-cache libc6-compat gcompat curl tar
WORKDIR /app

# 1. Install multi-process engine manager
RUN npm install -g pm2

# 2. Break down the download variables into short, safe component fragments
ENV OMNI_BASE=github.com
ENV OMNI_RELEASE=ChrisCompton/omniroute/releases/download/v1.1.0
ENV OMNI_TARBALL=omniroute-linux-amd64.tar.gz

# 3. Assemble and execute the binary extraction loop on a single row
RUN curl -L -o omniroute.tar.gz https://${OMNI_BASE}/${OMNI_RELEASE}/${OMNI_TARBALL} && tar -xzf omniroute.tar.gz && chmod +x omniroute

# 4. Synchronize application package layers and compile code logic
COPY package*.json tsconfig.json ecosystem.config.js ./
RUN npm ci
COPY src/ ./src
RUN npm run build

# 5. Prepare local persistent operational folder volumes
RUN mkdir -p /app/data /app/uploads
EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
