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
      script: 'npx',
      args: 'omniroute',
      env: {
        PORT: '20128',
        DASHBOARD_PORT: '20129',
        OMNIROUTE_SERVER_HOST: '127.0.0.1',
        DATA_DIR: '/app/data',
        REQUIRE_API_KEY: 'true',
        
        // 🚀 THE FIX: ENABLE DASHBOARD & TRUST NGINX PROXY HEADERS 🚀
        OMNIROUTE_HEADLESS: '0', // Turn OFF headless mode to enable the dashboard UI!
        TRUST_PROXY: 'true',     // Tells OmniRoute to trust Nginx and stop 301 loops
        NODE_ENV: 'production',
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://research-omniroute-service.onrender.com'
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
