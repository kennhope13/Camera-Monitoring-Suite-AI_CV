import cv2
import numpy as np
import time
import os
import requests
import json

# NOTIFY_URL for backend
NOTIFY_URL = "http://localhost:3000/notify_alert"
CONFIG_FILE = os.environ.get("AI_CONFIG_PATH", os.path.join(os.path.dirname(__file__), "ai_config.json"))
SNAPSHOT_DIR = os.path.join(os.path.dirname(__file__), "public/snapshots")

if not os.path.exists(SNAPSHOT_DIR):
    os.makedirs(SNAPSHOT_DIR, exist_ok=True)

def get_video_path():
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r') as f:
                config = json.load(f)
                return config.get("video_path", "/home/neit/Desktop/Anh_Nhan/datasets/tiadien_nen/2aOboQVBTTIbZ2S0vm9aBOlNATPyY7NBax6eUP0C.mp4")
    except:
        pass
    return "/home/neit/Desktop/Anh_Nhan/datasets/tiadien_nen/2aOboQVBTTIbZ2S0vm9aBOlNATPyY7NBax6eUP0C.mp4"

def send_alert(intensity, frame):
    timestamp = int(time.time())
    snapshot_filename = f"plasma_{timestamp}.jpg"
    snapshot_path = os.path.join(SNAPSHOT_DIR, snapshot_filename)
    
    # Save the frame
    cv2.imwrite(snapshot_path, frame)
    
    payload = {
        "title": "NGUY HIỂM: TIA ĐIỆN PLASMA",
        "description": f"Phát hiện phóng điện tại Tủ điện 1 (CAM-02). Cường độ: {intensity}px.",
        "type": "red-alert",
        "camId": "cam2",
        "imageUrl": f"/snapshots/{snapshot_filename}"
    }
    try:
        requests.post(NOTIFY_URL, json=payload, timeout=0.5)
    except:
        pass

def detect_plasma():
    current_video = get_video_path()
    cap = cv2.VideoCapture(current_video)
    
    print(f"AI Plasma Analysis Started: {current_video}")
    
    lower_bright = np.array([0, 0, 200])
    upper_bright = np.array([180, 55, 255])
    
    last_alert_time = 0
    alert_cooldown = 2.0 # Wait 2 seconds between alerts to avoid flooding
    
    while True:
        new_video = get_video_path()
        if new_video != current_video:
            cap.release()
            current_video = new_video
            cap = cv2.VideoCapture(current_video)

        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        blurred = cv2.GaussianBlur(frame, (5, 5), 0)
        hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, lower_bright, upper_bright)
        
        plasma_pixel_count = cv2.countNonZero(mask)
        
        if plasma_pixel_count > 500:
            current_time = time.time()
            if current_time - last_alert_time > alert_cooldown:
                send_alert(plasma_pixel_count, frame)
                last_alert_time = current_time
        
        time.sleep(0.01)

    cap.release()

if __name__ == "__main__":
    detect_plasma()
