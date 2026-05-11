const hikvision = require('./build/Release/hikvision.node');
hikvision.initSDK();

const ip = '192.168.10.152';
const port = 8000;
const user = 'admin';
const pass = 'Demo@2024';

console.log(`Logging in to ${ip}:${port}...`);
const userId = hikvision.login(ip, port, user, pass);

if (userId >= 0) {
    console.log(`Login successful! UserID: ${userId}`);
    console.log('Starting stream on channel 1...');
    
    let packetCount = 0;
    const streamHandle = hikvision.startStream(userId, 1, (type, buffer) => {
        packetCount++;
        if (packetCount % 50 === 0) {
            console.log(`Received ${packetCount} packets. Last packet type: ${type}, size: ${buffer.length} bytes`);
        }
    });

    if (streamHandle >= 0) {
        console.log(`Stream started. Handle: ${streamHandle}`);
        // Run for 3 seconds then stop
        setTimeout(() => {
            console.log(`Stopping stream... Total packets: ${packetCount}`);
            hikvision.stopStream(streamHandle);
            hikvision.logout(userId);
            hikvision.cleanupSDK();
            console.log('Done.');
        }, 3000);
    } else {
        console.log('Failed to start stream. Error:', hikvision.getLastError());
        hikvision.logout(userId);
        hikvision.cleanupSDK();
    }
} else {
    console.log('Login failed. Error:', hikvision.getLastError());
    hikvision.cleanupSDK();
}
