# HƯỚNG DẪN CHẠY HỆ THỐNG TITSMART DASHBOARD (5 TERMINAL)

Để kiểm soát tối đa và theo dõi log chi tiết từng phần, bạn hãy mở **5 cửa sổ Terminal** và chạy các lệnh sau:

---

### Terminal 1: Máy chủ Video (MediaMTX)
```bash
cd /home/neit/TitSmartProject/TitSmartDashboardBackend
./mediamtx
```

### Terminal 2: Backend Server (Node.js)
```bash
cd /home/neit/TitSmartProject/TitSmartDashboardBackend
npm run dev
```

### Terminal 3: AI Nhận diện Tia điện (Plasma)
```bash
cd /home/neit/TitSmartProject/TitSmartDashboardBackend
python3 detect_plasma.py
```

### Terminal 4: AI Nhận diện Chuột & Người
```bash
cd /home/neit/TitSmartProject/TitSmartDashboardBackend
python3 detect_rat.py
```

### Terminal 5: Frontend Dashboard (Giao diện Web)
```bash
cd /home/neit/TitSmartProject/TitSmart_client
npm run serve
```

---

## 🛑 Cách dừng hệ thống an toàn
- Tại mỗi Terminal, bạn chỉ cần nhấn **`Ctrl + C`** để dừng dịch vụ đó.
- **Lưu ý riêng cho Terminal 3/4 (Video Vòng lặp)**: Nếu nhấn `Ctrl + C` mà nó vẫn tự động Restart, hãy dùng lệnh sau để ngắt hẳn vòng lặp:
  ```bash
  pkill -f run_video.sh
  ```
- Nếu muốn chắc chắn mọi thứ đã dừng hẳn (không chạy ngầm), hãy chạy file:
  ```bash
  cd /home/neit/TitSmartProject
  ./stop_all.sh
  ```

## 💡 Lưu ý:
- Ảnh snapshot được lưu tại: `TitSmartDashboardBackend/public/snapshots`
- Nhật ký lịch sử lưu tại: `TitSmartDashboardBackend/alerts_log.json`
