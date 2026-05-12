# HƯỚNG DẪN CHẠY HỆ THỐNG TITSMART DASHBOARD

Để theo dõi log và quản lý hệ thống tốt nhất, bạn hãy mở **4 cửa sổ Terminal** riêng biệt và chạy các lệnh sau theo thứ tự:

---

### Terminal 1: Máy chủ Video (MediaMTX)
Đây là trái tim của hệ thống video, xử lý luồng cho cả 4 camera.
```bash
cd /home/neit/TitSmartProject/TitSmartDashboardBackend
./mediamtx
```
*Dấu hiệu chạy tốt: Sẽ thấy các dòng log báo "runOnInit command started" cho các cam.*

---

### Terminal 2: Backend Server (Node.js)
Xử lý dữ liệu, API điều khiển và gửi thông báo cảnh báo lên Web.
```bash
cd /home/neit/TitSmartProject/TitSmartDashboardBackend
npm run dev
```
*Dấu hiệu chạy tốt: Báo "Server is running at http://localhost:3000".*

---

### Terminal 3: Dịch vụ AI (Nhận diện sự cố)
Chạy các script AI để phát hiện tia điện, chuột và người để gửi thông báo kèm ảnh snapshot.
```bash
cd /home/neit/TitSmartProject/TitSmartDashboardBackend
python3 detect_plasma.py & python3 detect_rat.py
```
*Dấu hiệu chạy tốt: Báo "AI Analysis Started...". Cảnh báo sẽ tự động gửi lên mỗi khi có sự cố.*

---

### Terminal 4: Frontend Dashboard (Giao diện Web)
Khởi chạy giao diện người dùng trên trình duyệt.
```bash
cd /home/neit/TitSmartProject/TitSmart_client
npm run serve
```
*Dấu hiệu chạy tốt: Báo "App running at: http://localhost:8080/".*

---

## 💡 Lưu ý khi sử dụng:
1. **Thứ tự**: Nên chạy Terminal 1 và 2 trước, sau đó đến Terminal 3 và 4.
2. **Xem Nhật ký**: Bấm nút **"View All Logs"** trên giao diện web để xem lại lịch sử và ảnh snapshot đã chụp.
3. **Ảnh Snapshot**: Được lưu tại thư mục `/home/neit/TitSmartProject/TitSmartDashboardBackend/public/snapshots`.
4. **Dọn dẹp**: Các ảnh snapshot cũ hơn 24h sẽ được Backend tự động xóa để tiết kiệm bộ nhớ.

---
*Chúc bạn vận hành hệ thống thành công!*
