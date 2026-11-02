module.exports = {
  apps: [
    {
      name: 'nginx-reverse-proxy',
      script: 'nginx',
      // Run Nginx in the foreground so PM2 can trace its logs cleanly
      args: '-g "daemon off;"',
      autorestart: true
    },
    {
      name: 'omniroute-gateway',
      script: 'npx',
      args: 'omniroute',
      env: {
        PORT: '20128',
        DASHBOARD_PORT: '20129',
        OMNIROUTE_SERVER_HOST: '127.0.0.1',
        DATA_DIR: '/app/data',
        REQUIRE_API_KEY: 'true',
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://onrender.com'
      },
      restart_delay: 3000,
      autorestart: true
    },
    {
      name: 'research-ingress-api',
      script: 'dist/app.js',
      env: {
        PORT: '4000', // Moved internally to 4000 behind Nginx
        OMNIROUTE_URL: 'http://127.0.0',
        OMNIROUTE_API_KEY: process.env.OMNIROUTE_API_KEY
      },
      autorestart: true
    }
  ]
};
