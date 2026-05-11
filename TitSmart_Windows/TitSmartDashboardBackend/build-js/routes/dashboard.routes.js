"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController = __importStar(require("../controllers/dashboard.controller"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const router = (0, express_1.Router)();
router.get('/stats', dashboardController.getStats);
router.get('/devices', dashboardController.getDevices);
router.get('/devices/:id', dashboardController.getDeviceById);
// New endpoint to toggle video source
router.post('/toggle-video', (req, res) => {
    const { mode } = req.body;
    const normalPath = "/home/neit/Desktop/Anh_Nhan/datasets/tiadien_nen/2aOboQVBTTIbZ2S0vm9aBOlNATPyY7NBax6eUP0C.mp4";
    const testPath = "/home/neit/Desktop/Anh_Nhan/datasets/black_test.mp4";
    const targetPath = mode === 'test' ? testPath : normalPath;
    const configFile = process.env.AI_CONFIG_PATH || path_1.default.join(__dirname, '../../ai_config.json');
    const symlinkPath = "/home/neit/Desktop/Anh_Nhan/datasets/active_test_video.mp4";
    try {
        console.log(`\n🔄 [TOGGLE] Yêu cầu chuyển sang chế độ: ${mode}`);
        // 1. Update AI Config
        fs_1.default.writeFileSync(configFile, JSON.stringify({ video_path: targetPath }));
        console.log(`📝 Đã cập nhật cấu hình AI: ${targetPath}`);
        // 2. Update Symlink
        // Robustly remove old symlink if it exists (even if broken)
        try {
            if (fs_1.default.existsSync(symlinkPath))
                fs_1.default.unlinkSync(symlinkPath);
        }
        catch (e) { }
        fs_1.default.symlinkSync(targetPath, symlinkPath);
        console.log(`🔗 Đã cập nhật Symlink -> ${targetPath}`);
        // 3. Kill ffmpeg
        console.log('💥 Đang ép FFmpeg khởi động lại...');
        (0, child_process_1.exec)('pkill -9 -f ffmpeg', (err) => {
            // Đợi một chút để FFmpeg mới thực sự bắt đầu trước khi báo thành công
            setTimeout(() => {
                if (err) {
                    console.warn('⚠️ Không tìm thấy FFmpeg, có thể nó chưa chạy.');
                }
                else {
                    console.log('✅ FFmpeg đã khởi động lại xong.');
                }
                res.json({ success: true, mode, path: targetPath });
            }, 500);
        });
    }
    catch (e) {
        console.error("❌ Toggle error:", e);
        res.status(500).json({ success: false, error: e.message });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map