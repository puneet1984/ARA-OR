FROM node:22-alpine
RUN apk add --no-cache libc6-compat gcompat curl tar git python3 make g++ nginx
WORKDIR /app

RUN npm install -g pm2

COPY package*.json tsconfig.json ecosystem.config.js ./
RUN npm install

COPY src/ ./src
RUN npm run build

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/log/nginx /var/lib/nginx /app/data /app/uploads \
    && chown -R nginx:nginx /var/log/nginx /var/lib/nginx

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]
