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
        <el-button v-if="alert.actionTextKey || alert.actionText" type="text" class="action-button">
          {{ alert.actionTextKey ? $t(alert.actionTextKey) : alert.actionText }}
        </el-button>
      </div>
    </div>
    <div class="alert-footer">
      <el-button type="text" class="view-all-button">{{ $t('common.viewAllLogs') }}</el-button>
    </div>
  </DashboardCard>
</template>

<script setup>
import { defineProps } from 'vue'
import DashboardCard from './DashboardCard.vue'
import { Setting } from '@element-plus/icons-vue'

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
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: var(--el-text-color-primary);
  transition: all 0.15s ease-out;
  cursor: pointer;

  &:hover {
    transform: none;
    background-color: var(--el-fill-color-light);
    box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.05);
  }

  &.red-alert {
    border-left-color: var(--el-color-danger);
    &:hover {
       border-color: var(--el-color-danger);
       border-left-width: 3px;
       box-shadow: 0 0 15px rgba(245, 108, 108, 0.5), inset 0 0 10px rgba(245, 108, 108, 0.2);
    }
  }

  &.blue-alert {
    border-left-color: var(--el-color-primary);
    &:hover {
       border-color: var(--el-color-primary);
       border-left-width: 3px;
       box-shadow: 0 0 15px rgba(24, 144, 255, 0.5), inset 0 0 10px rgba(24, 144, 255, 0.2);
    }
  }
}

.alert-timestamp {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 5px;
}

.alert-title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
}

.alert-description {
  font-size: 13px;
  color: var(--el-text-color-regular);
  margin-bottom: 10px;
}

.action-button {
  color: var(--el-color-primary);
  font-size: 12px;
  padding: 0;
}

.alert-footer {
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid var(--el-border-color);
  margin-top: 10px;
}

.view-all-button {
  color: var(--el-color-primary);
  font-size: 14px;
  font-weight: bold;
}

.el-icon {
  color: var(--el-text-color-secondary);
}
</style>
