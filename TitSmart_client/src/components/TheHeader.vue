<template>
  <el-header class="app-header">
    <div class="header-container">
      <div class="header-left">
        <div class="logo-box">
          <el-icon class="logo-icon"><Monitor /></el-icon>
        </div>
        <div class="title-group">
          <h1 class="main-title">TitSmart Dashboard</h1>
          <div class="status-badge">
            <span class="status-dot"></span>
            SYSTEM ONLINE
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <el-button-group class="utility-group">
          <el-button class="util-btn" @click="toggleLang">
            {{ locale === 'vi' ? 'VI' : 'EN' }}
          </el-button>
          <el-button class="util-btn" @click="toggleDark()">
            <el-icon>
              <Moon v-if="isDark" />
              <Sunny v-else />
            </el-icon>
          </el-button>
        </el-button-group>
        
        <div class="user-profile">
          <div class="user-info">
            <span class="user-name">Admin User</span>
            <span class="user-role">Super Supervisor</span>
          </div>
          <el-avatar :size="40" icon="UserFilled" class="avatar-styled" />
        </div>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { Moon, Sunny, Monitor } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'

const { locale } = useI18n()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const toggleLang = () => {
  locale.value = locale.value === 'vi' ? 'en' : 'vi'
  localStorage.setItem('lang', locale.value)
}
</script>

<style lang="scss" scoped>
.app-header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  height: 70px;
  padding: 0 32px;
  display: flex;
  align-items: center;
}

.header-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-box {
  width: 40px;
  height: 40px;
  background-color: var(--el-color-primary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.title-group {
  display: flex;
  flex-direction: column;
}

.main-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--el-text-color-primary);
  font-family: 'Manrope', sans-serif;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  color: var(--app-success);
  letter-spacing: 1px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background-color: var(--app-success);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--app-success);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.util-btn {
  background-color: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color);
  font-weight: 700;
  font-size: 12px;
  color: var(--el-text-color-regular);
  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-fill-color);
  }
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 20px;
  border-left: 1px solid var(--el-border-color);
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.user-role {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.avatar-styled {
  border: 2px solid var(--el-border-color);
  background-color: var(--el-fill-color-lighter);
}
</style>
