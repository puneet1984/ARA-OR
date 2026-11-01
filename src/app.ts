import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Increase incoming payload limits for heavy academic research PDFs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// =========================================================================
// 🌐 LAYER 1: OMNIROUTE FRONTEND DASHBOARD & AUTHENTICATION PROXIES
// =========================================================================

// Proxy the administrative UI panel to the public router plane
app.use('/dashboard', createProxyMiddleware({
  target: 'http://127.0.0.1:20129',
  changeOrigin: true,
  ws: true, // Enables live terminal log rendering via WebSockets
  logger: console
}));

// Route standard OAuth identity callback tokens cleanly (Google, GitHub, etc.)
app.use('/callback', createProxyMiddleware({
  target: 'http://127.0.0',
  changeOrigin: true
}));

// =========================================================================
// 🤖 LAYER 2: OPENAI-COMPATIBLE INFERENCE PLANE PROXY (/v1/*)
// =========================================================================

// Expose the core inference gateway directly for Cursor, Cline, or your own scripts
app.use('/v1', createProxyMiddleware({
  target: 'http://127.0.0',
  changeOrigin: true,
  logger: console,
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Automatically attach your secure master token if it isn't passed by the client
      if (!req.headers['authorization'] && process.env.OMNIROUTE_API_KEY) {
        proxyReq.setHeader('Authorization', `Bearer ${process.env.OMNIROUTE_API_KEY}`);
      }
    }
  }
}));

// =========================================================================
// 🔬 LAYER 3: CUSTOM RESEARCH UI & SYSTEM API ENDPOINTS
// =========================================================================

// Framework Health Check for Render's deployment monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Target placeholder for your upcoming academic research data ingestion endpoints
app.post('/api/research/upload', (req, res) => {
  // Your file parsing and PDF extraction logic will live here
  res.status(200).json({ message: "Research ingestion pipeline ready." });
});

// Clean browser landing dashboard for the root domain url
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Research Framework Hub</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .container { background: #1e293b; padding: 3rem; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); text-align: center; max-width: 500px; width: 90%; }
            h1 { color: #38bdf8; margin-top: 0; font-size: 2rem; }
            .status { display: inline-flex; align-items: center; background: #064e3b; color: #34d399; padding: 0.35rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; margin-bottom: 2rem; }
            .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 8px; }
            .grid { display: grid; grid-template-columns: 1fr; gap: 1rem; text-align: left; }
            .card { background: #0f172a; padding: 1.25rem; border-radius: 8px; border: 1px solid #334155; }
            .card-title { font-weight: bold; color: #f1f5f9; margin-bottom: 0.25rem; display: flex; justify-content: space-between; }
            .path { font-family: monospace; color: #f43f5e; font-size: 0.9rem; }
            .desc { color: #94a3b8; font-size: 0.85rem; margin: 0.25rem 0 0 0; }
            .btn { display: inline-block; background: #0284c7; color: white; text-decoration: none; padding: 0.4rem 0.75rem; border-radius: 4px; font-size: 0.8rem; font-weight: 500; }
            .btn:hover { background: #0369a1; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔬 Research Core Ingress</h1>
            <div class="status"><div class="status-dot"></div>Cluster Systems Operational</div>
            <div class="grid">
                <div class="card">
                    <div class="card-title">OmniRoute Dashboard <a href="/dashboard" class="btn">Launch</a></div>
                    <div class="path">/dashboard</div>
                    <p class="desc">Manage AI model providers, view token savings analytics, and view live gateway console traffic logs.</p>
                </div>
                <div class="card">
                    <div class="card-title"><span style="color: #a855f7;">AI Inference Gateway</span></div>
                    <div class="path">/v1/chat/completions</div>
                    <p class="desc">OpenAI-compatible connection point loaded with automatic model fallback cascading rules.</p>
                </div>
                <div class="card">
                    <div class="card-title"><span style="color: #eab308;">Research API Plane</span></div>
                    <div class="path">/api/research/*</div>
                    <p class="desc">Internal data routes powering document extraction and text indexing matrices.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Start the unified server cluster
app.listen(PORT, () => {
  console.log(`[INGRESS] Unified multi-service proxy plane running live on port ${PORT}`);
});
