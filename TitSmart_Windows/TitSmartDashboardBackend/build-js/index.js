"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const path_1 = __importDefault(require("path"));
// Load the compiled C++ Addon
const hikvision = require('../build/Release/hikvision.node');
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
// Reset Video Source to Default (Dark Video) ONLY if it doesn't exist (e.g. first run)
const defaultVideo = "/home/neit/Desktop/Anh_Nhan/datasets/black_test.mp4";
const symlinkPath = "/home/neit/Desktop/Anh_Nhan/datasets/active_test_video.mp4";
try {
    if (!fs_1.default.existsSync(symlinkPath)) {
        fs_1.default.symlinkSync(defaultVideo, symlinkPath);
        console.log('✅ Initial video source set to default (Dark Video).');
    }
    else {
        console.log('ℹ️ Video source already exists, skipping reset to preserve current mode.');
    }
}
catch (e) {
    console.warn('⚠️ Could not check/reset default video:', e);
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Create HTTP Server to attach both Express and WebSocket
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
// Keep track of connected clients
const clients = new Set();
wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to WebSocket (total:', clients.size, ')');
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected from WebSocket');
    });
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ROOT LEVEL ENDPOINT - NO PREFIX
app.post('/notify_alert', (req, res) => {
    const alert = req.body;
    console.log('[ALERT RECEIVED]:', alert);
    clients.forEach(client => {
        if (client.readyState === ws_1.default.OPEN)
            client.send(JSON.stringify({ type: 'NEW_ALERT', data: alert }));
    });
    res.status(200).send('OK');
});
app.get('/notify_alert', (req, res) => {
    res.send('ALERT ENDPOINT IS ALIVE');
});
// Serve a simple HTML file for testing the WebRTC stream
console.log('Skipping Hikvision SDK initialization for debugging...');
// const isInit = hikvision.initSDK();
// console.log('SDK Init Result:', isInit);
// Serve a simple HTML file for testing the WebRTC stream
app.get('/webrtc', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/webrtc.html'));
});
// 1. Các API và tệp tĩnh phải được ưu tiên trước
app.use('/api', routes_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// 2. Mọi yêu cầu khác mới trả về index.html (cho Vue Router)
app.use((req, res, next) => {
    // Nếu là yêu cầu API mà không khớp ở trên thì trả về 404, không trả về index.html
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API not found' });
    }
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
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
//# sourceMappingURL=index.js.map