<template>
  <div class="sidebar-wrapper">
    <el-menu
      default-active="dashboard"
      class="el-menu-vertical-demo"
    >
      <div class="sidebar-header">
        <span class="logo">GridGuard SCADA</span>
      </div>
      <el-menu-item index="dashboard">
        <el-icon><TrendCharts /></el-icon>
        <span>{{ $t('common.dashboard') }}</span>
      </el-menu-item>
      <el-menu-item index="live-feeds">
        <el-icon><VideoCamera /></el-icon>
        <span>{{ $t('common.liveFeeds') }}</span>
      </el-menu-item>
      <el-menu-item index="analytics">
        <el-icon><DataAnalysis /></el-icon>
        <span>{{ $t('common.analytics') }}</span>
      </el-menu-item>
      <el-menu-item index="station-map">
        <el-icon><Location /></el-icon>
        <span>{{ $t('common.stationMap') }}</span>
      </el-menu-item>
      <el-menu-item index="event-logs">
        <el-icon><Document /></el-icon>
        <span>{{ $t('common.eventLogs') }}</span>
      </el-menu-item>
      <el-menu-item index="settings">
        <el-icon><Setting /></el-icon>
        <span>{{ $t('common.settings') }}</span>
      </el-menu-item>
      <el-menu-item index="support">
        <el-icon><QuestionFilled /></el-icon>
        <span>{{ $t('common.support') }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { TrendCharts, VideoCamera, DataAnalysis, Location, Document, Setting, QuestionFilled } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
  height: 100vh;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  .logo {
    color: var(--el-text-color-primary);
    font-size: 20px;
    font-weight: bold;
  }
}

.el-menu {
  border-right: none;
  background-color: transparent;
}

.el-menu-item {
  color: var(--el-text-color-regular);
  .el-icon {
    margin-right: 10px;
    color: inherit;
  }
  &:hover {
    background-color: var(--el-fill-color-light) !important;
  }
  &.is-active {
    background-color: var(--el-color-primary-light-9) !important;
    color: var(--el-color-primary) !important;
  }
}
</style>
