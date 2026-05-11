<template>
  <div class="dashboard-root">
    <!-- Màn hình khóa khi đang chuyển đổi video -->
    <div v-if="loadingMode" class="global-loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p>ĐANG CHUYỂN ĐỔI CHẾ ĐỘ VIDEO...</p>
        <span>Hệ thống đang đồng bộ hóa luồng video mới...</span>
      </div>
    </div>
    <el-container class="full-height">
      <el-aside width="260px" class="sidebar-aside">
        <TheSidebar />
      </el-aside>
      
      <el-container direction="vertical">
        <TheHeader />
        
        <el-main class="main-content">
          <div class="dashboard-grid">
            <!-- Main Content Area -->
            <div class="primary-column">
              <!-- Hero Video Player -->
              <div class="hero-video animate-up">
                <div class="hero-header">
                  <div class="hero-title">
                    <span class="active-badge"></span>
                    {{ mainCamera.title }}
                  </div>
                  <div class="hero-stats">
                    <div class="stat-item">
                      <span class="stat-label">MODE:</span>
                      <span class="stat-value">{{ videoMode.toUpperCase() }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="hero-player-container">
                  <WebRTCPlayer 
                    v-if="mainCamera.isWebRTC" 
                    :streamName="mainCamera.streamName" 
                    :key="mainCamera.id + videoMode" 
                  />
                  <img v-else :src="mainCamera.imageSrc" class="hero-fallback" />
                </div>
              </div>

              <!-- Thumbnails Grid -->
              <div class="thumbnail-grid animate-up" style="animation-delay: 0.1s">
                <div 
                  v-for="cam in thumbnailCameras" 
                  :key="cam.id" 
                  class="thumbnail-item"
                  @click="setActiveCamera(cam.id)"
                >
                  <VideoDisplayCard 
                    :title="cam.title" 
                    :temp="cam.temp" 
                    :imageSrc="cam.imageSrc" 
                  />
                </div>
              </div>

              <!-- Chart Section -->
              <div class="chart-section animate-up" style="animation-delay: 0.2s">
                <SystemStabilityChart :series-data="chartSeriesData" />
              </div>
            </div>

            <!-- Side Content Area -->
            <div class="secondary-column animate-up" style="animation-delay: 0.3s">
              <!-- Diagnostics Panel -->
              <transition name="el-zoom-in-top">
                <DashboardCard 
                  v-show="activeCameraId === 'cam2'" 
                  title="System Diagnostics" 
                  class="diagnostics-card"
                >
                  <div class="diagnostics-content">
                    <p class="diag-desc">Select operational mode for electrode detection validation.</p>
                    <div class="diag-actions">
                      <el-button 
                        :type="videoMode === 'normal' ? 'primary' : 'default'" 
                        :loading="loadingMode === 'normal'"
                        size="large"
                        class="diag-btn"
                        @click="toggleVideo('normal')"
                      >
                        NORMAL MODE
                      </el-button>
                      <el-button 
                        :type="videoMode === 'test' ? 'danger' : 'default'" 
                        :loading="loadingMode === 'test'"
                        size="large"
                        class="diag-btn"
                        @click="toggleVideo('test')"
                      >
                        STRESS TEST
                      </el-button>
                    </div>
                  </div>
                </DashboardCard>
              </transition>

              <AlertList :alerts="alerts" />
              
              <div class="map-box">
                <CameraMap :cameras="cameras" />
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
    
    <el-button type="primary" :icon="Plus" circle class="fab-main" />
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
import TheSidebar from '../components/TheSidebar.vue'
import TheHeader from '../components/TheHeader.vue'
import VideoDisplayCard from '../components/VideoDisplayCard.vue'
import DashboardCard from '../components/DashboardCard.vue'
import AlertList from '../components/AlertList.vue'
import SystemStabilityChart from '../components/SystemStabilityChart.vue'
import CameraMap from '../components/CameraMap.vue'
import WebRTCPlayer from '../components/WebRTCPlayer.vue'

export default {
  name: 'TheDashboard',
  components: { 
    TheSidebar, TheHeader, VideoDisplayCard, DashboardCard, 
    AlertList, SystemStabilityChart, CameraMap, WebRTCPlayer 
  },
  data() {
    return {
      Plus, activeCameraId: 'cam1', ws: null, 
      plasmaAlertActive: false, 
      plasmaTimeout: null,
      alarmInterval: null,
      videoMode: 'test',
      loadingMode: null,
      cameraList: [
        { id: 'cam1', title: 'CAM 01: MƯỜNG CÁP', temp: 42, alert: false, isWebRTC: true, streamName: 'cam1', imageSrc: '/src/assets/dashboard-background.jpg' },
        { id: 'cam2', title: 'CAM 02: TỦ ĐIỆN', temp: null, alert: false, isWebRTC: true, streamName: 'cam_tiadien', imageSrc: '/src/assets/dashboard-background.jpg' },
        { id: 'cam3', title: 'CAM 03: GIÁM SÁT SƯ', temp: null, alert: false, isWebRTC: false, imageSrc: '/src/assets/dashboard-background.jpg' }
      ],
      alerts: [
        { id: 1, type: 'red-alert', timestamp: '10:42:15', title: 'HỆ THỐNG SẴN SÀNG', description: 'Đang giám sát tia điện trạm biến áp.', actionText: 'OK' }
      ],
      chartSeriesData: [{ name: 'Ổn định', type: 'line', data: [220, 182, 191, 234, 290, 330, 310] }],
      cameras: [{ id: 1, x: 80, y: 80 }, { id: 2, x: 320, y: 180 }]
    }
  },
  mounted() { this.connectWebSocket(); },
  beforeUnmount() { 
    if (this.ws) this.ws.close();
    if (this.alarmInterval) clearInterval(this.alarmInterval);
  },
  computed: {
    mainCamera() { return this.cameraList.find(c => c.id === this.activeCameraId) || this.cameraList[0]; },
    thumbnailCameras() { return this.cameraList.filter(c => c.id !== this.activeCameraId); }
  },
  methods: {
    handleAlertMessage(message) {
      if (message.type === 'NEW_ALERT') {
        if (!this.plasmaAlertActive) {
            this.plasmaAlertActive = true;
            this.startAlarmCycle();
            this.showGlobalNotification();
        }
        if (this.plasmaTimeout) clearTimeout(this.plasmaTimeout);
        this.plasmaTimeout = setTimeout(() => {
          this.plasmaAlertActive = false;
          this.stopAlarmCycle();
        }, 5000);
        const lastAlert = this.alerts[0];
        if (!lastAlert || (Date.now() - lastAlert.id > 3000)) {
            const newAlert = {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
              ...message.data,
              actionText: 'XỬ LÝ KHẨN CẤP'
            };
            this.alerts.unshift(newAlert);
            if (this.alerts.length > 20) this.alerts.pop();
        }
      }
    },
    startAlarmCycle() {
        if (this.alarmInterval) clearInterval(this.alarmInterval);
        this.playUrgentSound();
        this.alarmInterval = setInterval(() => {
            if (this.plasmaAlertActive) this.playUrgentSound();
        }, 800);
    },
    stopAlarmCycle() {
        if (this.alarmInterval) {
            clearInterval(this.alarmInterval);
            this.alarmInterval = null;
        }
    },
    showGlobalNotification() {
        if (this.$notify) {
          this.$notify({
            title: '!!! NGUY HIỂM: TIA ĐIỆN !!!',
            message: 'Phát hiện phóng điện tại Tủ điện (CAM-02). Yêu cầu kiểm tra ngay!',
            type: 'error',
            duration: 0,
            position: 'top-right'
          });
        }
    },
    connectWebSocket() {
      try {
        const wsUrl = `ws://${window.location.hostname}:3000`;
        this.ws = new WebSocket(wsUrl);
        this.ws.onmessage = (event) => {
          try {
            this.handleAlertMessage(JSON.parse(event.data));
          } catch (e) { console.warn('Invalid WS message'); }
        };
        this.ws.onclose = () => setTimeout(() => this.connectWebSocket(), 3000);
      } catch (e) { console.warn('WS connection failed'); }
    },
    setActiveCamera(id) { this.activeCameraId = id; },
    async toggleVideo(mode) {
      if (this.loadingMode) return;
      this.loadingMode = mode;
      try {
        const hostname = window.location.hostname || 'localhost';
        const url = `http://${hostname}:3000/api/dashboard/toggle-video`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode })
        });
        
        if (res.ok) {
          // Chờ 3 giây để FFmpeg và MediaMTX ổn định luồng mới
          setTimeout(() => {
            this.videoMode = mode;
            this.loadingMode = null;
            this.$message({
              message: `Chế độ đã chuyển sang: ${mode === 'test' ? 'Stress Test' : 'Bình thường'}`,
              type: mode === 'test' ? 'warning' : 'success'
            });
          }, 3000);
        } else {
          this.loadingMode = null;
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
      } catch (e) {
        this.loadingMode = null;
        this.$message.error(`Lỗi chuyển đổi: ${e.message}`);
      }
    },
    playUrgentSound() {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        console.warn('Audio feedback blocked by browser');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-root {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.full-height { height: 100%; }

.sidebar-aside {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
}

.main-content {
  background-color: var(--el-bg-color-page);
  padding: 32px;
  overflow-y: auto;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
  max-width: 1600px;
  margin: 0 auto;
}

.primary-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero-video {
  background-color: var(--el-bg-color);
  border-radius: 16px;
  border: 1px solid var(--el-border-color);
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.hero-header {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.hero-title {
  font-weight: 800;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Manrope', sans-serif;
}

.active-badge {
  width: 10px;
  height: 10px;
  background-color: var(--app-success);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--app-success);
}

.hero-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  font-size: 11px;
  font-weight: 700;
}

.stat-label { color: var(--el-text-color-secondary); margin-right: 4px; }
.stat-value { color: var(--el-color-primary); }

.hero-player-container {
  aspect-ratio: 16 / 9;
  background-color: #000;
  position: relative;
  
  :deep(video) {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.hero-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.thumbnail-item {
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: scale(1.02); }
}

.secondary-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.diagnostics-content {
  padding: 20px;
}

.diag-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
}

.diag-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.diag-btn {
  width: 100%;
  margin: 0 !important;
}

.map-box {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
}

.fab-main {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 64px;
  height: 64px;
  font-size: 28px;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
}
/* Global Loading Overlay */
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00f2ff;
  text-align: center;
}

.loading-content p {
  font-size: 1.5rem;
  letter-spacing: 4px;
  margin: 20px 0 10px;
  text-shadow: 0 0 15px rgba(0, 242, 255, 0.7);
}

.loading-content span {
  opacity: 0.7;
  font-size: 0.9rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 242, 255, 0.1);
  border-left-color: #00f2ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 242, 255, 0.3);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
