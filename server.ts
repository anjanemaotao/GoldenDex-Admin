import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock data endpoints for the dashboard
  app.get("/api/dashboard/stats", (req, res) => {
    res.json({
      active60s: 1284 + Math.floor(Math.random() * 100),
      active24h: 45829 + Math.floor(Math.random() * 500),
      totalUsers: 892102 + Math.floor(Math.random() * 10),
      vaultTvl: 124.5 + (Math.random() * 2 - 1),
      oi: 452.1 + (Math.random() * 5 - 2.5),
      oiCount: 42910 + Math.floor(Math.random() * 50),
      oiUsers: 18521 + Math.floor(Math.random() * 20),
      insurance: 12.8 + (Math.random() * 0.1 - 0.05),
    });
  });

  app.get("/api/system/health", (req, res) => {
    res.json({
      insRatio: (10.2 + (Math.random() * 0.4 - 0.2)).toFixed(1) + "%",
      avgMr: (34.5 + (Math.random() * 2 - 1)).toFixed(1) + "%",
      liqRate: (0.12 + (Math.random() * 0.02 - 0.01)).toFixed(2) + "%",
      vaultDep: (1.2 + (Math.random() * 0.2 - 0.1)).toFixed(1) + "%",
      withCount: 124 + Math.floor(Math.random() * 10),
      matchingLat: (45 + Math.floor(Math.random() * 10)) + "ms",
      apiDelay: (1.1 + (Math.random() * 0.2 - 0.1)).toFixed(1) + "s",
      priceDev: (0.15 + (Math.random() * 0.05 - 0.025)).toFixed(2) + "%",
      newUsers24h: 1284 + Math.floor(Math.random() * 100),
      vol24h: "$" + (45.2 + (Math.random() * 2 - 1)).toFixed(1) + "M",
      fees24h: "$" + (22.5 + (Math.random() * 1 - 0.5)).toFixed(1) + "K",
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
