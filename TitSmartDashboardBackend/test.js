const hikvision = require('./build/Release/hikvision.node');
hikvision.initSDK();

const cams = [
  { ip: '192.168.10.152', port: 8000, user: 'admin', pass: 'Demo@2024' },
  { ip: '192.168.10.153', port: 554, user: 'tladmin', pass: 'Ab@12345' },
  { ip: '192.168.1.103', port: 8000, user: 'admin', pass: 'Demo@2024' }
];

for (const cam of cams) {
  const userId = hikvision.login(cam.ip, cam.port, cam.user, cam.pass);
  console.log(`Login to ${cam.ip}:${cam.port} -> userId: ${userId}, error: ${hikvision.getLastError()}`);
  if (userId >= 0) hikvision.logout(userId);
}

hikvision.cleanupSDK();
