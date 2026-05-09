import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import http from 'http';
import WebSocket from 'ws';
import path from 'path';

// Load the compiled C++ Addon
const hikvision = require('../build/Release/hikvision.node');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP Server to attach both Express and WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Initialize Hikvision SDK once on startup
console.log('Initializing Hikvision SDK (reserved for future use)...');
const isInit = hikvision.initSDK();
console.log('SDK Init Result:', isInit);

// Serve a simple HTML file for testing the WebRTC stream
app.get('/webrtc', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/webrtc.html'));
});

// Main API routes
app.use('/api', apiRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'TitSmartDashboard Backend is running!' });
});

// We have removed the custom WebSocket stream handler.
// Video streaming is now handled externally via MediaMTX (RTSP -> WebRTC)
// which provides ultra-low latency.

// Cleanup SDK on exit
process.on('SIGINT', () => {
  console.log('Cleaning up SDK...');
  hikvision.cleanupSDK();
  process.exit(0);
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
