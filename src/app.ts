import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// =========================================================================
// 🌐 LAYER 1: MULTI-PATH NEXT.JS FRONTEND DASHBOARD PROXIES
// =========================================================================

// Catch-all route to handle the main UI dashboard layout smoothly
app.use('/dashboard', createProxyMiddleware({
  target: 'http://127.0.0.1:20129',
  changeOrigin: true,
  ws: true, // Vital to handle real-time metric streams over WebSockets!
  logger: console
}));

// CRITICAL: Intercept and route static Next.js scripts, themes, and hydration bundles
app.use('/_next', createProxyMiddleware({
  target: 'http://127.0.0.1:20129',
  changeOrigin: true
}));

// Route standard OAuth authentication hooks (Google, GitHub, etc.)
app.use('/callback', createProxyMiddleware({
  target: 'http://127.0.0',
  changeOrigin: true
}));

// =========================================================================
// 🤖 LAYER 2: OPENAI-COMPATIBLE API BACKEND PROXY (/v1/*)
// =========================================================================
app.use('/v1', createProxyMiddleware({
  target: 'http://127.0.0',
  changeOrigin: true,
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
