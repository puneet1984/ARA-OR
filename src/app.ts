import express from 'express';
import multer from 'multer';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import pdfParse from 'pdf-parse';

const app = express();
const upload = multer({ dest: '/tmp/' });

app.use(express.json());

// 1. Dynamic Reverse Proxy Endpoint for External Apps targeting OmniRoute
app.use('/omniroute-api', createProxyMiddleware({
  target: 'http://127.0.0.1:20128',
  changeOrigin: true,
  pathRewrite: {
    '^/omniroute-api': '', // Normalizes paths cleanly for OmniRoute routing paths
  },
}));

// 2. Health check route to ensure Render sleeping logic resets seamlessly
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// 3. Document Processing Ingress Endpoint
app.post('/api/v1/process-pdf', upload.single('file'), async (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const parsedData = await pdfParse(dataBuffer);
    
    // Clean storage footprint immediately after data transformation
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      documentName: req.file.originalname,
      extractedCharacters: parsedData.text.length
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Unified production cluster running on port ${PORT}`));
