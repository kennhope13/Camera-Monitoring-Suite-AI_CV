import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const router = Router();

router.get('/stats', dashboardController.getStats);
router.get('/devices', dashboardController.getDevices);
router.get('/devices/:id', dashboardController.getDeviceById);

// New endpoint to toggle video source
router.post('/toggle-video', (req, res) => {
    const { mode } = req.body;
    const plasmaVideo = "/home/neit/Desktop/Anh_Nhan/datasets/tiadien_nen/2aOboQVBTTIbZ2S0vm9aBOlNATPyY7NBax6eUP0C.mp4";
    const darkVideo = "/home/neit/Desktop/Anh_Nhan/datasets/black_test.mp4";
    
    // Normal Mode = No Plasma (Dark), Test Mode = Simulate Plasma
    const targetPath = mode === 'test' ? plasmaVideo : darkVideo;
    const configFile = process.env.AI_CONFIG_PATH || path.join(__dirname, '../../ai_config.json');
    const symlinkPath = "/home/neit/Desktop/Anh_Nhan/datasets/active_test_video.mp4";
    
    try {
        console.log(`\n🔄 [TOGGLE] Yêu cầu chuyển sang chế độ: ${mode}`);
        
        // 1. Update AI Config
        fs.writeFileSync(configFile, JSON.stringify({ video_path: targetPath }));
        console.log(`📝 Đã cập nhật cấu hình AI: ${targetPath}`);
        
        // 2. Update Symlink
        try {
            if (fs.existsSync(symlinkPath)) fs.unlinkSync(symlinkPath);
        } catch (e) {}
        fs.symlinkSync(targetPath, symlinkPath);
        console.log(`🔗 Đã cập nhật Symlink -> ${targetPath}`);

        // 3. Kill specific ffmpeg process (only for cam2)
        console.log('💥 Đang khởi động lại luồng Cam 2...');
        exec('pkill -9 -f active_test_video.mp4', (err) => {
            setTimeout(() => {
                if (err) {
                    console.warn('⚠️ Không tìm thấy FFmpeg cho Cam 2.');
                } else {
                    console.log('✅ Đã chuyển đổi luồng Cam 2 thành công.');
                }
                res.json({ success: true, mode, path: targetPath });
            }, 500);
        });
    } catch (e: any) {
        console.error("❌ Toggle error:", e);
        res.status(500).json({ success: false, error: e.message });
    }
});

export default router;
