import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// =========================================================================
// 🔄 SELF-HEALING ERROR HANDLER FOR SLOW COLD STARTS
// =========================================================================
const handleProxyError = (err: any, req: any, res: any) => {
  console.error('[PROXY ERROR] Background gateway warming up or unreachable:', err.message);
  res.status(503).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gateway Warming Up</title>
      <meta http-equiv="refresh" content="5">
    </head>
    <body style="font-family:sans-serif; background:#0f172a; color:white; text-align:center; padding-top:20vh;">
      <h2>⚙️ Background Gateway Initializing</h2>
      <p>OmniRoute is currently compiling its internal database structures.</p>
      <p style="color:#94a3b8; font-size:14px;">This page will automatically refresh every 5 seconds until connected...</p>
      <div style="margin-top:20px; color:#38bdf8;">Please wait...</div>
    </body>
    </html>
  `);
};

// =========================================================================
// 🌐 LAYER 1: MULTI-PATH NEXT.JS FRONTEND DASHBOARD PROXIES
// =========================================================================
app.use('/dashboard', createProxyMiddleware({
  target: 'http://127.0.0.1:20129',
  changeOrigin: true,
  ws: true,
  onError: handleProxyError,
  logger: console
}));

app.use('/_next', createProxyMiddleware({
  target: 'http://127.0.0.1:20129',
  changeOrigin: true,
  onError: (err, req, res) => res.status(200).end() // Prevent asset errors from breaking logs
}));

app.use('/callback', createProxyMiddleware({
  target: 'http://127.0.0',
  changeOrigin: true,
  onError: handleProxyError
}));

// =========================================================================
// 🤖 LAYER 2: OPENAI-COMPATIBLE API BACKEND PROXY (/v1/*)
// =========================================================================
app.use('/v1', createProxyMiddleware({
  target: 'http://127.0.0',
  changeOrigin: true,
  onError: (err, req, res) => res.status(503).json({ error: "Gateway initializing, try again in a few seconds." }),
  logger: console
}));

// =========================================================================
// 🔬 LAYER 3: SYSTEM LANDING & MONITORING PATHS
// =========================================================================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head><title>Research Gateway</title></head>
    <body style="font-family:sans-serif; background:#0f172a; color:white; text-align:center; padding-top:20vh;">
      <h1>🔬 Academic Research Assistant Ingress</h1>
      <p>Proxy Framework Status: <span style="color:#10b981; font-weight:bold;">ONLINE</span></p>
      <a href="/dashboard" style="display:inline-block; background:#0284c7; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; margin-top:20px;">Open OmniRoute Dashboard</a>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`[INGRESS] API Router plane running live on port ${PORT}`);
});
