module.exports = {
  apps: [
    {
      name: 'omniroute-gateway',
      script: 'npx',
      // Explicitly tell npx to call the package bin runner execution layer
      args: 'omniroute',
      env: {
        // Enforce the dual-port mapping architecture required by Render
        PORT: '20128',
        DASHBOARD_PORT: '20129',
        OMNIROUTE_SERVER_HOST: '127.0.0.1',
        DATA_DIR: '/app/data',
        REQUIRE_API_KEY: 'true'
      },
      restart_delay: 3000,
      autorestart: true
    },
    {
      name: 'research-ingress-api',
      script: 'dist/app.js',
      env: {
        PORT: '3000',
        OMNIROUTE_URL: 'http://127.0.0',
        OMNIROUTE_API_KEY: process.env.OMNIROUTE_API_KEY
      },
      autorestart: true
    }
  ]
};
