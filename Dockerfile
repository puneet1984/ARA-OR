# === Stage 1: Pull pre-built production structures from official image ===
FROM diegosouzapw/omniroute:latest AS omniroute-prebuilt

# === Stage 2: Main Operational Runtime Stage ===
FROM node:22-alpine
RUN apk add --no-cache libc6-compat gcompat curl tar git nginx
WORKDIR /app

# 1. Install process orchestrator manager globally
RUN npm install -g pm2

# 2. Synchronize your custom repository specifications
COPY package*.json tsconfig.json ecosystem.config.js ./
RUN npm install

# 3. Compile your custom TypeScript Express API logic
COPY src/ ./src
RUN npm run build

# 4. Extract the pre-compiled OmniRoute core from Stage 1 into an interior tracking folder
COPY --from=omniroute-prebuilt /app /app/omniroute-core

# 5. Connect your custom high-performance Nginx rules
COPY nginx.conf /etc/nginx/nginx.conf

# 6. Initialize folder architectures for unattached Nginx background logging
RUN mkdir -p /var/log/nginx /var/lib/nginx /app/data /app/uploads \
    && chown -R nginx:nginx /var/log/nginx /var/lib/nginx

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
