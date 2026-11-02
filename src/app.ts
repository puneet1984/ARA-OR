import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json({ limit: '50mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', runtime: 'node22' });
});

app.get('/api/omniroute-status', async (req, res) => {
  try {
    const response = await fetch('http://127.0.0', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.OMNIROUTE_API_KEY || ''}` }
    });
    
    if (response.ok) {
      res.status(200).json({ status: 'ONLINE', details: 'Gateway proxy fully initialized and accepting requests.' });
    } else {
      res.status(200).json({ status: 'INITIALIZING', details: 'Server online, database sockets are warming up...' });
    }
  } catch (error) {
    res.status(200).json({ status: 'INITIALIZING', details: 'Gateway process starting or unreachable.' });
  }
});

app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Research Assistant Ingress</title>
      <script>
        async function checkStatus() {
          try {
            const res = await fetch('/api/omniroute-status');
            const data = await res.json();
            const badge = document.getElementById('status-badge');
            badge.innerText = data.status;
            if (data.status === 'ONLINE') {
              badge.style.color = '#10b981';
            } else if (data.status === 'INITIALIZING') {
              badge.style.color = '#f59e0b';
            } else {
              badge.style.color = '#ef4444';
            }
            document.getElementById('status-details').innerText = data.details;
          } catch(e) { }
        }
        setInterval(checkStatus, 3000);
        window.onload = checkStatus;
      </script>
    </head>
    <body style="font-family:sans-serif; background:#0f172a; color:white; text-align:center; padding-top:15vh;">
      <h1>🔬 Academic Research Assistant Ingress</h1>
      <div style="background:#1e293b; padding:20px; display:inline-block; border-radius:8px; border:1px solid #334155;">
        <p style="font-size:18px;">OmniRoute Status: <span id="status-badge" style="font-weight:bold; color:#f59e0b;">CHECKING...</span></p>
        <p id="status-details" style="color:#94a3b8; font-size:14px;">Querying internal background services...</p>
      </div>
      <br><br>
      <a href="/dashboard" style="display:inline-block; background:#0284c7; color:white; padding:12px 24px; border-radius:5px; text-decoration:none; font-weight:bold; transition:0.2s;">Open OmniRoute Dashboard</a>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`[INGRESS] Express API tracking engine launched on port ${PORT}`);
});
