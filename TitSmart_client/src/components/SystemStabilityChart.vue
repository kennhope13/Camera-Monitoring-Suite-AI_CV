<template>
  <DashboardCard :title="$t('dashboard.systemStability')">
    <template #header-extra>
      <div class="chart-legend">
        <span class="legend-item"><span class="dot current"></span> {{ $t('common.current') }}</span>
        <span class="legend-item"><span class="dot forecast"></span> {{ $t('common.forecast') }}</span>
      </div>
    </template>
    <v-chart class="chart" :option="chartOption" autoresize />
  </DashboardCard>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import DashboardCard from './DashboardCard.vue'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const props = defineProps({
  seriesData: {
    type: Array,
    required: true,
  }
})

const chartOption = computed(() => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: false,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '', '', '06:00', '', '', '12:00', '', '', '18:00', '', '', '24:00'],
      axisLine: { lineStyle: { color: 'var(--el-border-color)' } },
      axisLabel: { color: 'var(--el-text-color-secondary)' },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    series: props.seriesData,
  }
})
</script>

<style lang="scss" scoped>
.chart {
  height: 250px;
  width: 100%;
}

.chart-legend {
  display: flex;
  align-items: center;
}

@keyframes pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(103, 194, 58, 0); }
  100% { box-shadow: 0 0 0 0 rgba(103, 194, 58, 0); }
}

.legend-item {
  display: flex;
  align-items: center;
  margin-left: 20px;
  font-size: 13px;
  color: #a0a0a0;
  transition: color 0.3s ease;
  cursor: default;

  &:hover {
    color: #fff;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
    &.current {
      background-color: #1890ff; /* Blue */
    }
    &.forecast {
      background-color: #67c23a; /* Green */
      animation: pulse-green 2s infinite;
    }
  }
}
</style>
