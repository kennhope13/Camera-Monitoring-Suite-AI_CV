# TitSmart Dashboard - Hướng dẫn cài đặt (New Machine)

Dự án này bao gồm 3 phần chính: **Frontend (Vue.js)**, **Backend (Node.js/Electron)** và **AI Services (Python)**.

## 1. Yêu cầu hệ thống
- **Hệ điều hành**: Linux (Khuyên dùng Ubuntu 20.04+)
- **Node.js**: v16+
- **Python**: 3.8+
- **Công cụ**: FFmpeg, MediaMTX

## 2. Cài đặt các thành phần

### A. Backend & MediaMTX
1. Di chuyển vào thư mục backend:
   ```bash
   cd TitSmartDashboardBackend
   npm install
   ```
2. Đảm bảo file `mediamtx` có quyền thực thi:
   ```bash
   chmod +x mediamtx
   ```

### B. Frontend
1. Di chuyển vào thư mục frontend:
   ```bash
   cd TitSmart_client
   npm install
   ```

### C. AI Services (Python)
1. Cài đặt các thư viện cần thiết:
   ```bash
   pip3 install opencv-python numpy requests
   ```

## 3. Cấu hình đường dẫn (QUAN TRỌNG)
Khi chuyển sang máy mới, bạn cần kiểm tra và cập nhật đường dẫn video trong các file sau nếu thư mục `datasets` của bạn nằm ở vị trí khác:

1. **`TitSmartDashboardBackend/src/routes/dashboard.routes.ts`**:
   - Cập nhật `plasmaVideo` và `darkVideo`.
2. **`TitSmartDashboardBackend/mediamtx.yml`**:
   - Cập nhật đường dẫn file `.mp4` trong các lệnh `ffmpeg`.
3. **`TitSmartDashboardBackend/detect_plasma.py`**:
   - Cập nhật đường dẫn video mặc định trong hàm `get_video_path`.

## 4. Cách chạy hệ thống
1. **Khởi chạy toàn bộ (qua Electron)**:
   ```bash
   cd TitSmartDashboardBackend
   npm start
   ```
2. **Chạy thủ công để Debug**:
   - Chạy MediaMTX: `./mediamtx`
   - Chạy Backend: `npm run dev`
   - Chạy Frontend: `cd TitSmart_client && npm run serve`
   - Chạy AI: `python3 detect_plasma.py`

## 5. Lưu ý về Hikvision SDK
- Thư mục `lib` chứa các file `.so` của Hikvision SDK.
- Nếu gặp lỗi không tìm thấy thư viện, hãy thêm đường dẫn `lib` vào `LD_LIBRARY_PATH`:
  ```bash
  export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$(pwd)/lib
  ```
