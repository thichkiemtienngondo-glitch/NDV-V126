
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import cors from "cors";

const DATA_FILE = path.join(process.cwd(), "data.json");

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    users: [],
    loans: [],
    notifications: [],
    budget: 30000000,
    rankProfit: 0
  }, null, 2));
}

function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return {
      users: [],
      loans: [],
      notifications: [],
      budget: 30000000,
      rankProfit: 0
    };
  }
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/data", (req, res) => {
    res.json(readData());
  });

  app.post("/api/users", (req, res) => {
    const data = readData();
    data.users = req.body;
    writeData(data);
    res.json({ success: true });
  });

  app.post("/api/loans", (req, res) => {
    const data = readData();
    data.loans = req.body;
    writeData(data);
    res.json({ success: true });
  });

  app.post("/api/notifications", (req, res) => {
    const data = readData();
    data.notifications = req.body;
    writeData(data);
    res.json({ success: true });
  });

  app.post("/api/budget", (req, res) => {
    const data = readData();
    data.budget = req.body.budget;
    writeData(data);
    res.json({ success: true });
  });

  app.post("/api/rankProfit", (req, res) => {
    const data = readData();
    data.rankProfit = req.body.rankProfit;
    writeData(data);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
