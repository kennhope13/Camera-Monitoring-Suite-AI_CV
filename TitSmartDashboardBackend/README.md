# Tài liệu Kỹ thuật: Hệ thống Phát hiện Tia lửa Điện Plasma (AI CV)

## 1. Giới thiệu (Introduction)
Module `detect_plasma.py` là một thành phần trong hệ thống giám sát Camera, được thiết kế để phát hiện các hiện tượng phóng điện (plasma arc) hoặc tia lửa điện trong các tủ điện hoặc môi trường công nghiệp. 

Thay vì sử dụng các mô hình học sâu (Deep Learning) nặng nề, module này sử dụng các kỹ thuật **Xử lý ảnh truyền thống (Traditional Computer Vision)** để đảm bảo tốc độ xử lý thời gian thực cao và tiết kiệm tài nguyên CPU.

## 2. Phương pháp Detect (Detection Method)
Hệ thống sử dụng phương pháp **Phân ngưỡng màu sắc và độ sáng (Color & Brightness Thresholding)** trong không gian màu **HSV**.

### Quy trình xử lý (Pipeline):
1. **Gaussian Blur**: Làm mờ khung hình để loại bỏ nhiễu kỹ thuật số từ cảm biến camera.
2. **HSV Conversion**: Chuyển đổi từ hệ màu BGR sang HSV để tách biệt giá trị độ sáng (Value) khỏi màu sắc (Hue).
3. **Thresholding (In-Range)**: 
   - Sử dụng các ngưỡng (thresholds) để lọc ra các pixel có độ sáng cực cao (Value > 200) và độ bão hòa thấp (Saturation < 55).
   - Các vùng này đặc trưng cho ánh sáng chói của tia lửa điện plasma.
4. **Morphological Opening**: Áp dụng phép toán hình thái học để xóa bỏ các điểm sáng nhỏ lẻ (nhiễu) và giữ lại các vùng sáng tập trung.
5. **Pixel Counting**: Đếm số lượng pixel trắng trong Mask. Nếu số lượng pixel vượt qua ngưỡng (ví dụ: > 500 pixel), hệ thống sẽ xác định là có tia lửa điện.

## 3. Thông số kỹ thuật (Parameters)
| Tham số | Giá trị | Giải thích |
|---------|---------|------------|
| `lower_bright` | `[0, 0, 200]` | Ngưỡng dưới (Hue, Sat, Value) |
| `upper_bright` | `[180, 55, 255]` | Ngưỡng trên (Hue, Sat, Value) |
| `alert_cooldown` | `0.2s` | Thời gian nghỉ giữa các lần gửi cảnh báo |
| `plasma_pixel_count` | `> 500` | Diện tích tối thiểu để kích hoạt cảnh báo |

## 4. Ưu và Nhược điểm
* **Ưu điểm**:
    - Tốc độ cực nhanh (Real-time).
    - Không yêu cầu GPU, chạy tốt trên các thiết bị Edge (Raspberry Pi, Mini PC).
    - Dễ dàng điều chỉnh thông số theo môi trường cụ thể.
* **Nhược điểm**:
    - Có thể gây cảnh báo giả (False Positive) nếu có nguồn sáng mạnh khác rọi vào (đèn pin, mặt trời phản chiếu).

## 5. Cấu trúc Cảnh báo (Alert System)
Khi phát hiện vi phạm, hệ thống gửi một POST request đến Backend API (`/notify_alert`) với thông tin:
- Tên cảnh báo: PHÁT HIỆN TIA ĐIỆN PLASMA
- Cường độ: Số lượng pixel phát hiện được.
- Màu sắc hiển thị: Red-alert (Đỏ).

---
*Tài liệu này được biên soạn cho dự án TitSmart Dashboard.*
