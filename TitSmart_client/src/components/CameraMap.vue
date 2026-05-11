<template>
  <DashboardCard :title="$t('dashboard.cameraMap')">
    <template #header-extra>
      <el-icon><FullScreen /></el-icon>
    </template>
    <div class="camera-map-container">
      <svg viewBox="0 0 400 300" class="camera-map">
        <!-- Simple representation of the station layout -->
        <rect x="50" y="50" width="300" height="200" fill="var(--el-bg-color-overlay)" stroke="var(--el-border-color)" stroke-width="2" />
        <line x1="100" y1="50" x2="100" y2="250" stroke="var(--el-border-color)" stroke-width="2" />
        <line x1="300" y1="50" x2="300" y2="250" stroke="var(--el-border-color)" stroke-width="2" />

        <!-- Camera Markers -->
        <g v-for="camera in cameras" :key="camera.id" class="camera-marker" @click="selectCamera(camera.id)">
          <circle :cx="camera.x" :cy="camera.y" r="10" fill="var(--el-color-primary)" />
          <text :x="camera.x" :y="camera.y + 5" text-anchor="middle" fill="#fff" font-size="12">{{ camera.id }}</text>
        </g>
      </svg>
      <div class="camera-status">
        <span class="status-dot online"></span>
        <span>{{ $t('common.cameraActive') }}</span>
      </div>
    </div>
  </DashboardCard>
</template>

<script setup>
import DashboardCard from './DashboardCard.vue'
import { FullScreen } from '@element-plus/icons-vue'

defineProps({
  cameras: {
    type: Array,
    required: true,
  },
})

const selectCamera = (id) => {
  console.log(`Camera ${id} selected`)
}
</script>

<style lang="scss" scoped>
.camera-map-container {
  height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
  padding: 10px;
}

.camera-map {
  width: 100%;
  height: calc(100% - 30px);
  .camera-marker {
    cursor: pointer;
    transition: all 0.15s ease-out;
    &:hover circle {
      fill: #00f3ff;
      filter: drop-shadow(0 0 5px #00f3ff);
    }
    &:hover text {
      fill: #000;
      font-weight: bold;
    }
  }
}

@keyframes pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(103, 194, 58, 0); }
  100% { box-shadow: 0 0 0 0 rgba(103, 194, 58, 0); }
}

.camera-status {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 13px;
  color: var(--el-text-color-secondary);

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    &.online {
      background-color: var(--el-color-success);
      animation: pulse-green 2s infinite;
    }
  }
}

.el-icon {
  color: var(--el-text-color-secondary);
}
</style>
