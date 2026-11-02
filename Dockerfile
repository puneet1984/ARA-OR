FROM node:22-alpine
# Install Nginx plus normal dependencies
RUN apk add --no-cache libc6-compat gcompat curl tar git python3 make g++ nginx
WORKDIR /app

RUN npm install -g pm2

COPY package*.json tsconfig.json ecosystem.config.js ./
RUN npm install

COPY src/ ./src
RUN npm run build

# Copy our custom Nginx proxy configuration layout rule
COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /app/data /app/uploads
EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
