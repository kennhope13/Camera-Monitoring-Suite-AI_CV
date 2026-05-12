import time
import requests
import os
import cv2

# NOTIFY_URL for backend
NOTIFY_URL = "http://localhost:3000/notify_alert"
SNAPSHOT_DIR = os.path.join(os.path.dirname(__file__), "public/snapshots")

def send_alert(cam_id, title, description, video_path):
    timestamp = int(time.time())
    snapshot_filename = f"{cam_id}_{timestamp}.jpg"
    snapshot_path = os.path.join(SNAPSHOT_DIR, snapshot_filename)
    
    # Try to capture a frame from the video for the snapshot
    try:
        cap = cv2.VideoCapture(video_path)
        ret, frame = cap.read()
        if ret:
            cv2.imwrite(snapshot_path, frame)
        cap.release()
    except:
        pass
    
    payload = {
        "title": title,
        "description": description,
        "type": "red-alert" if "CẢNH BÁO" in title else "system-login",
        "camId": cam_id,
        "imageUrl": f"/snapshots/{snapshot_filename}"
    }
    try:
        requests.post(NOTIFY_URL, json=payload, timeout=0.5)
    except:
        pass

def run_simulation():
    print("AI Visual Alert Simulation Started")
    rat_video = "/home/neit/Desktop/Anh_Nhan/divat_ir.v1i.yolo26/divat_1_night_ir_final.mp4"
    person_video = "/home/neit/Desktop/Anh_Nhan/datasets/result_detect_compressed.mp4"
    
    while True:
        # Cam 3 Rat Alert
        send_alert(
            "cam3", 
            "CẢNH BÁO: PHÁT HIỆN CHUỘT", 
            "Vị trí: Tủ điện 2 (CAM-03). Phát hiện sinh vật xâm nhập.",
            rat_video
        )
        time.sleep(20) # Slower alerts to avoid clutter
        
        # Cam 4 Personnel Alert
        send_alert(
            "cam4", 
            "THÔNG BÁO: NGƯỜI CÓ CHỨC VỤ", 
            "Vị trí: Cổng trạm (CAM-04). Kỹ sư trưởng đang làm việc.",
            person_video
        )
        time.sleep(20)

if __name__ == "__main__":
    run_simulation()
