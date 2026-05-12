<template>
  <DashboardCard :title="$t('dashboard.alertList')">
    <template #header-extra>
      <el-icon><Setting /></el-icon>
    </template>
    <div class="alert-list">
      <div v-for="alert in alerts" :key="alert.id" class="alert-item" :class="alert.type">
        <div class="alert-timestamp">{{ alert.timestamp }}</div>
        <div class="alert-title">{{ alert.titleKey ? $t(alert.titleKey) : (alert.title || '') }}</div>
        <div class="alert-description" v-html="alert.descKey ? $t(alert.descKey) : (alert.description || '')"></div>
        
        <!-- Snapshot Image Display -->
        <div v-if="alert.imageUrl" class="alert-snapshot">
          <el-image 
            :src="'http://localhost:3000' + alert.imageUrl" 
            :preview-src-list="['http://localhost:3000' + alert.imageUrl]"
            fit="cover"
            class="snapshot-img"
            :preview-teleported="true"
          />
        </div>

        <el-button v-if="alert.actionTextKey || alert.actionText" type="text" class="action-button">
          {{ alert.actionTextKey ? $t(alert.actionTextKey) : alert.actionText }}
        </el-button>
      </div>
    </div>
    <div class="alert-footer">
      <el-button type="text" class="view-all-button" @click="emit('view-all')">{{ $t('common.viewAllLogs') }}</el-button>
    </div>
  </DashboardCard>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import DashboardCard from './DashboardCard.vue'
import { Setting } from '@element-plus/icons-vue'

const emit = defineEmits(['view-all'])

defineProps({
  alerts: {
    type: Array,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.alert-list {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.alert-item {
  background-color: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-left-width: 3px;
  border-left-color: transparent;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  color: var(--el-text-color-primary);
  transition: all 0.15s ease-out;
  cursor: pointer;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  &.red-alert {
    border-left-color: var(--el-color-danger);
    background: linear-gradient(90deg, rgba(245, 108, 108, 0.05) 0%, transparent 100%);
  }

  &.system-login {
    border-left-color: var(--el-color-success);
  }
}

.alert-snapshot {
  margin: 10px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  
  .snapshot-img {
    width: 100%;
    height: 120px;
    display: block;
    transition: transform 0.3s;
    
    &:hover {
      transform: scale(1.05);
    }
  }
}

.alert-timestamp {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.alert-title {
  font-weight: 800;
  margin-bottom: 4px;
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.alert-description {
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
  line-height: 1.4;
}

.action-button {
  color: var(--el-color-primary);
  font-size: 11px;
  padding: 0;
  font-weight: bold;
}

.alert-footer {
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid var(--el-border-color);
  margin-top: 10px;
}

.view-all-button {
  color: var(--el-color-primary);
  font-size: 13px;
  font-weight: bold;
}
</style>
