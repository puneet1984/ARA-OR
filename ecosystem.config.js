module.exports = {
  apps: [
    {
      name: 'omniroute-gateway',
      // Execute the module runner command path directly
      script: 'npx',
      args: 'omniroute',
      env: {
        PORT: '20128',
        DATA_DIR: '/app/data'
      },
      restart_delay: 3000,
      autorestart: true
    },
    {
      name: 'research-ingress-api',
      script: 'dist/app.js',
      env: {
        PORT: '3000',
        OMNIROUTE_URL: 'http://127.0.0'
      },
      autorestart: true
    }
  ]
};
