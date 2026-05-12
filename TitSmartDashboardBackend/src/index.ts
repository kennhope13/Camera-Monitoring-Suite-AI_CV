import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import http from 'http';
import WebSocket from 'ws';
import path from 'path';
import fs from 'fs';

// Load the compiled C++ Addon
const hikvision = require('../build/Release/hikvision.node');

dotenv.config();

// Reset Video Source to Default (Dark Video)
const defaultVideo = "/home/neit/Desktop/Anh_Nhan/datasets/black_test.mp4";
const symlinkPath = "/home/neit/Desktop/Anh_Nhan/datasets/active_test_video.mp4";
try {
  if (!fs.existsSync(symlinkPath)) {
    fs.symlinkSync(defaultVideo, symlinkPath);
  }
} catch (e) {}

const app = express();
const port = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, '../alerts_log.json');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

app.use(cors());
app.use(express.json());

app.post('/notify_alert', (req: Request, res: Response) => {
  const alert = {
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
    date: new Date().toLocaleDateString('vi-VN'),
    ...req.body
  };
  
  console.log('[ALERT RECEIVED]:', alert);

  try {
    let logs = [];
    if (fs.existsSync(LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    }
    logs.unshift(alert);
    if (logs.length > 1000) logs = logs.slice(0, 1000);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.error('Failed to save log:', e);
  }

  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify({ type: 'NEW_ALERT', data: alert }));
  });
  res.status(200).send('OK');
});

app.get('/api/dashboard/logs', (req, res) => {
  try {
    if (fs.existsSync(LOG_FILE)) {
      res.json(JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')));
    } else {
      res.json([]);
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

app.get('/webrtc', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/webrtc.html'));
});

app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API not found' });
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const cleanupSnapshots = () => {
  const snapshotDir = path.join(__dirname, '../public/snapshots');
  if (!fs.existsSync(snapshotDir)) return;
  const now = Date.now();
  const expirationTime = 24 * 60 * 60 * 1000;
  fs.readdir(snapshotDir, (err, files) => {
    if (err) return;
    files.forEach(file => {
      const filePath = path.join(snapshotDir, file);
      fs.stat(filePath, (err, stats) => {
        if (!err && now - stats.mtimeMs > expirationTime) {
          fs.unlink(filePath, () => {});
        }
      });
    });
  });
};

setInterval(cleanupSnapshots, 60 * 60 * 1000);
cleanupSnapshots();

process.on('SIGINT', () => {
  hikvision.cleanupSDK();
  process.exit(0);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
