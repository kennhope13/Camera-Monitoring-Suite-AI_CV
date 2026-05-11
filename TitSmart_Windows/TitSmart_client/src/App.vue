<template>
  <div id="app">
    <el-config-provider :locale="elLocale">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import en from 'element-plus/dist/locale/en.mjs'
import vi from 'element-plus/dist/locale/vi.mjs'

const { locale } = useI18n()

const elLocale = computed(() => {
  return locale.value === 'vi' ? vi : en
})
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@400;600;700;800&display=swap');

:root {
  --app-primary: #6366f1; // Indigo
  --app-primary-light: #818cf8;
  --app-success: #10b981; // Emerald
  --app-danger: #ef4444; // Rose
  --app-warning: #f59e0b; // Amber
  --video-bg: #000000;
  
  // Light Mode Defaults
  --el-color-primary: #6366f1;
  --el-bg-color-page: #f8fafc;
  --el-bg-color: #ffffff;
  --el-border-color: #e2e8f0;
  --el-text-color-primary: #0f172a;
  --el-text-color-regular: #475569;
  --el-text-color-secondary: #64748b;
  
  --card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --card-shadow-hover: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  background-color: var(--el-bg-color-page);
}

html.dark {
  --el-bg-color-page: #020617; // Deep Slate
  --el-bg-color: #0f172a;
  --el-border-color: #1e293b;
  --el-text-color-primary: #f8fafc;
  --el-text-color-regular: #cbd5e1;
  --el-text-color-secondary: #94a3b8;
  
  --card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
  --card-shadow-hover: 0 20px 25px -5px rgb(0 0 0 / 0.4);
}

// Global Customizations
.el-card {
  border-radius: 12px !important;
  border: 1px solid var(--el-border-color) !important;
  box-shadow: var(--card-shadow) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  
  &:hover {
    box-shadow: var(--card-shadow-hover) !important;
  }
}

.el-button--primary {
  background-image: linear-gradient(to right, #6366f1, #4f46e5);
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.39);
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 10px;
}

// Animation
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-up {
  animation: slideUp 0.5s ease-out forwards;
}

* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
</style>
