module.exports = {
  apps: [
    {
      name: 'omniroute-gateway',
      script: 'npx',
      args: 'omniroute',
      env: {
        // Run the background proxy listener on port 20128 internally
        PORT: '20128',
        // Push the administrative UI panel out to port 20129
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
        // Binds your public app to port 3000 so Render can hand off traffic smoothly
        PORT: '3000',
        OMNIROUTE_URL: 'http://127.0.0',
        OMNIROUTE_API_KEY: process.env.OMNIROUTE_API_KEY
      },
      autorestart: true
    }
  ]
};
