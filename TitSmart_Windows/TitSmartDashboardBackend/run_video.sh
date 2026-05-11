#!/bin/bash
VIDEO_PATH="/home/neit/Desktop/Anh_Nhan/datasets/active_test_video.mp4"
RTSP_URL="rtsp://localhost:8554/cam_tiadien"

echo "Persistent Video Script Started"

while true; do
    # Kiểm tra xem file video có tồn tại không
    if [ -f "$VIDEO_PATH" ]; then
        echo "Starting FFmpeg for $VIDEO_PATH"
        ffmpeg -re -stream_loop -1 -fflags +genpts -i "$VIDEO_PATH" \
               -c:v libx264 -preset ultrafast -bf 0 -tune zerolatency \
               -vf "scale=1280:720,format=yuv420p" -r 25 -g 25 \
               -an -f rtsp -rtsp_transport tcp "$RTSP_URL"
    else
        echo "Video file not found at $VIDEO_PATH, waiting..."
        sleep 2
    fi
    echo "FFmpeg exited. Restarting..."
    sleep 0.5
done
