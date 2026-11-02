module.exports = {
  apps: [
    {
      name: 'nginx-reverse-proxy',
      script: 'nginx',
      args: '-g "daemon off;"',
      autorestart: true
    },
    {
      name: 'omniroute-gateway',
      script: 'node',
      args: '/app/omniroute-core/dist/server.js',
      env: {
        PORT: '20128',
        DASHBOARD_PORT: '20129',
        OMNIROUTE_SERVER_HOST: '127.0.0.1',
        DATA_DIR: '/app/data',
        REQUIRE_API_KEY: 'true',
        OMNIROUTE_HEADLESS: '0', 
        TRUST_PROXY: 'true',     
        NODE_ENV: 'production',
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://onrender.com'
      },
      restart_delay: 3000,
      autorestart: true
    },
    {
      name: 'research-ingress-api',
      script: 'dist/app.js',
      env: {
        PORT: '4000', 
        OMNIROUTE_URL: 'http://127.0.0',
        OMNIROUTE_API_KEY: process.env.OMNIROUTE_API_KEY
      },
      autorestart: true
    }
  ]
};
