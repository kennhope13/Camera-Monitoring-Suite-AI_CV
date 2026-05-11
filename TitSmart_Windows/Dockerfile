# Sử dụng Ubuntu làm nền tảng (giống với môi trường bạn đang chạy)
FROM ubuntu:22.04

# Tránh các câu hỏi tương tác khi cài đặt
ENV DEBIAN_FRONTEND=noninteractive

# 1. Cài đặt các thành phần hệ thống cơ bản
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    python3 \
    python3-pip \
    ffmpeg \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 2. Cài đặt Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# 3. Thiết lập thư mục làm việc
WORKDIR /app

# 4. Copy mã nguồn Backend và Frontend đã build
COPY TitSmartDashboardBackend /app/backend
COPY TitSmart_client/dist /app/backend/public

# 5. Cài đặt thư viện Python cho AI
RUN pip3 install opencv-python-headless numpy requests

# 6. Thiết lập biến môi trường cho Hikvision SDK
# Copy thư mục lib của SDK vào hệ thống
COPY lib /app/lib
ENV LD_LIBRARY_PATH=/app/lib:/app/backend/lib:$LD_LIBRARY_PATH

# 7. Cài đặt dependencies cho Backend
WORKDIR /app/backend
RUN npm install --production

# 8. Mở các cổng cần thiết
# 3000: Backend API
# 8554: RTSP
# 8888: HLS/WebRTC
# 8889: WHEP (WebRTC)
EXPOSE 3000 8554 8888 8889

# 9. Lệnh khởi động: Chạy đồng thời các dịch vụ
# Chúng ta sẽ sử dụng một script khởi động đơn giản
RUN echo '#!/bin/bash\n\
./mediamtx > mediamtx.log 2>&1 &\n\
nohup python3 detect_plasma.py > detect_plasma.log 2>&1 &\n\
node build/src/index.ts\n\
' > start.sh && chmod +x start.sh

CMD ["./start.sh"]
