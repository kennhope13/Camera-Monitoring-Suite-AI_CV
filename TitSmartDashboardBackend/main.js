const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let backendProcess;
let aiProcess;
let mediamtxProcess;

function createWindow() {
  const rootPath = app.isPackaged ? path.join(process.resourcesPath, '..') : __dirname;
  const iconPath = path.join(rootPath, 'build/icon.png');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "TitSmart Dashboard AI",
    icon: iconPath,
    show: true, // Ép hiện cửa sổ ngay
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Đợi Backend khởi động (tăng lên 7 giây cho chắc)
  setTimeout(() => {
    console.log("Loading Dashboard UI...");
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.show();
  }, 7000);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startServices() {
  console.log("Starting TitSmart Services...");

  // Trên Linux AppImage, extraFiles nằm ở thư mục gốc của mount point (cạnh execPath)
  // process.resourcesPath thường là /tmp/.mount_XXX/resources
  const rootPath = app.isPackaged ? path.join(process.resourcesPath, '..') : __dirname;

  // 1. Writable Config Path (Dùng /tmp để có quyền ghi khi chạy AppImage)
  const writableConfigPath = app.isPackaged ? '/tmp/titsmart_ai_config.json' : path.join(rootPath, 'ai_config.json');
  
  // Copy config gốc ra /tmp nếu chưa có (chỉ khi đóng gói)
  if (app.isPackaged && !fs.existsSync(writableConfigPath)) {
    const originalConfig = path.join(rootPath, 'ai_config.json');
    if (fs.existsSync(originalConfig)) {
      fs.copyFileSync(originalConfig, writableConfigPath);
    }
  }

  // 2. Start MediaMTX
  const mediamtxPath = path.join(rootPath, 'mediamtx');
  mediamtxProcess = spawn(mediamtxPath, [], { cwd: rootPath });

  // 3. Start AI Module (detect_plasma)
  const aiPath = path.join(rootPath, 'detect_plasma');
  if (fs.existsSync(aiPath)) {
    aiProcess = spawn(aiPath, [], { 
      cwd: rootPath,
      env: { ...process.env, AI_CONFIG_PATH: writableConfigPath }
    });
  }

  // 4. Start Backend (Node.js)
  const backendEntry = path.join(rootPath, 'build/index.js');
  const libPath = path.join(rootPath, 'lib');

  backendProcess = spawn('node', [backendEntry], { 
    cwd: rootPath,
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      LD_LIBRARY_PATH: `${libPath}:${process.env.LD_LIBRARY_PATH || ''}`,
      AI_CONFIG_PATH: writableConfigPath
    }
  });

  backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));
}

app.on('ready', () => {
  startServices();
  createWindow();
});

app.on('window-all-closed', function () {
  // Khi đóng App thì tắt sạch các dịch vụ chạy ngầm
  if (backendProcess) backendProcess.kill();
  if (aiProcess) aiProcess.kill();
  if (mediamtxProcess) mediamtxProcess.kill();
  app.quit();
});
