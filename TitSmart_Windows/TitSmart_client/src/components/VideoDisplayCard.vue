<template>
  <DashboardCard :title="title">
    <template #header-extra>
      <div class="video-meta">
        <span class="status-indicator online"></span>
        <span class="meta-text">LIVE</span>
      </div>
    </template>
    <div class="video-wrapper">
      <img v-if="imageSrc" :src="imageSrc" alt="Video Feed" class="video-feed" />
      <div v-else class="video-placeholder">
        <el-icon><VideoCamera /></el-icon>
        <span class="placeholder-text">NO SIGNAL</span>
      </div>

      <div class="video-overlays">
        <div v-if="temp" class="data-tag temp">
          <el-icon><Thermometer /></el-icon>
          {{ temp }}°C
        </div>
        <div v-if="alert" class="data-tag alert">
          ALARM ACTIVE
        </div>
      </div>
      
      <div class="video-footer">
        <span class="camera-id">CAM-ID: {{ title.split(':')[0] }}</span>
        <span class="timestamp">{{ currentTimestamp }}</span>
      </div>
    </div>
  </DashboardCard>
</template>

<script>
import DashboardCard from './DashboardCard.vue'
import { VideoCamera, Thermometer } from '@element-plus/icons-vue'

export default {
  name: 'VideoDisplayCard',
  components: {
    DashboardCard,
    VideoCamera,
    Thermometer
  },
  props: {
    title: { type: String, required: true },
    temp: { type: Number, default: null },
    alert: { type: Boolean, default: false },
    imageSrc: { type: String, default: null }
  },
  data() {
    return {
      currentTimestamp: new Date().toLocaleTimeString()
    }
  },
  mounted() {
    setInterval(() => {
      this.currentTimestamp = new Date().toLocaleTimeString()
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
.video-wrapper {
  position: relative;
  height: 200px;
  background-color: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #475569;
  font-size: 32px;
  .placeholder-text {
    font-size: 10px;
    font-weight: 800;
    margin-top: 8px;
    letter-spacing: 2px;
  }
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  &.online {
    background-color: var(--app-success);
    box-shadow: 0 0 8px var(--app-success);
  }
}

.meta-text {
  font-size: 10px;
  font-weight: 800;
  color: var(--el-text-color-secondary);
}

.video-overlays {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-tag {
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &.alert {
    background-color: var(--app-danger);
    animation: flash 1s infinite;
  }
}

@keyframes flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.video-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 10px;
  font-weight: 600;
  font-family: monospace;
}
</style>
