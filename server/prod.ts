// Production server: serves the built site from dist/ plus the /api routes.
// Run `npm run build` first, then `npm start`.
import path from 'node:path';
import express from 'express';
import { createServer } from './index';

const app = createServer();
const distDir = path.join(process.cwd(), 'dist');

app.use(express.static(distDir));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distDir, 'index.html'));
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Agrovista running on http://localhost:${port}`);
});
