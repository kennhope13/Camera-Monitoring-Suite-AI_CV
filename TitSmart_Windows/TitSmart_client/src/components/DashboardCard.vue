<template>
  <el-card class="dashboard-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <div class="title-wrapper">
          <span class="title-text">{{ title }}</span>
        </div>
        <div class="header-extra">
          <slot name="header-extra"></slot>
        </div>
      </div>
    </template>
    <div class="card-content">
      <slot></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'DashboardCard',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
  
  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    background-color: var(--el-bg-color);
  }
  
  :deep(.el-card__body) {
    padding: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Manrope', sans-serif;
}

.card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
