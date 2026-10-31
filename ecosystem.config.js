module.exports = {
  apps: [
    {
      name: 'omniroute-gateway',
      script: '/app/omniroute',
      env: {
        OMNIROUTE_PORT: '20128',
        OMNIROUTE_DATA_DIR: '/app/data'
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
