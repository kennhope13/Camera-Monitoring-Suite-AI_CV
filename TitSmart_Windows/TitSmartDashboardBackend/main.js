const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let backendProcess;
let aiProcess;
let mediamtxProcess;

const isWin = process.platform === 'win32';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "TitSmart Dashboard AI",
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

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

  const rootPath = app.isPackaged ? path.join(process.resourcesPath, '..') : __dirname;

  // 1. Writable Config Path
  const writableConfigPath = app.isPackaged 
    ? path.join(app.getPath('temp'), 'titsmart_ai_config.json') 
    : path.join(rootPath, 'ai_config.json');
  
  if (app.isPackaged && !fs.existsSync(writableConfigPath)) {
    const originalConfig = path.join(rootPath, 'ai_config.json');
    if (fs.existsSync(originalConfig)) {
      fs.copyFileSync(originalConfig, writableConfigPath);
    }
  }

  // 2. Start MediaMTX
  const mediamtxExe = isWin ? 'mediamtx.exe' : 'mediamtx';
  const mediamtxPath = path.join(rootPath, mediamtxExe);
  mediamtxProcess = spawn(mediamtxPath, [], { cwd: rootPath });

  // 3. Start AI Module (detect_plasma)
  const aiExe = isWin ? 'detect_plasma.exe' : 'detect_plasma';
  const aiPath = path.join(rootPath, aiExe);
  if (fs.existsSync(aiPath)) {
    aiProcess = spawn(aiPath, [], { 
      cwd: rootPath,
      env: { ...process.env, AI_CONFIG_PATH: writableConfigPath }
    });
  }

  // 4. Start Backend (Node.js)
  const backendEntry = path.join(rootPath, 'build-js/index.js');
  const libPath = path.join(rootPath, 'lib');

  const env = { 
    ...process.env, 
    NODE_ENV: 'production',
    AI_CONFIG_PATH: writableConfigPath
  };

  if (isWin) {
    env.PATH = `${libPath};${process.env.PATH || ''}`;
  } else {
    env.LD_LIBRARY_PATH = `${libPath}:${process.env.LD_LIBRARY_PATH || ''}`;
  }

  backendProcess = spawn('node', [backendEntry], { 
    cwd: rootPath,
    env: env
  });

  backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));
}

app.on('ready', () => {
  startServices();
  createWindow();
});

app.on('window-all-closed', function () {
  if (backendProcess) backendProcess.kill();
  if (aiProcess) aiProcess.kill();
  if (mediamtxProcess) mediamtxProcess.kill();
  app.quit();
});
