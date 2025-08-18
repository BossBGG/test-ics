<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface ChartSeries {
  name: string
  data: number[]
}

interface Props {
  series: ChartSeries[]
  categories: string[]
  height?: number
  colors?: string[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 350,
  colors: () => ['#8b5cf6', '#fbbf24'],
  title: ''
})

const chartContainer = ref<HTMLElement>()

let chart: any = null

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: props.height,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 4,
      borderRadiusApplication: 'end'
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: props.categories,
    labels: {
      style: {
        fontSize: '12px',
        fontWeight: 400,
        colors: '#6b7280'
      }
    }
  },
  yaxis: {
    title: {
      text: '',
      style: {
        fontSize: '12px',
        fontWeight: 400,
        color: '#6b7280'
      }
    },
    labels: {
      style: {
        fontSize: '12px',
        fontWeight: 400,
        colors: '#6b7280'
      }
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + " รายการ"
      }
    }
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '12px',
    fontWeight: 400,
    labels: {
      colors: '#6b7280'
    },
    markers: {
      width: 12,
      height: 12,
      radius: 2
    }
  },
  colors: props.colors,
  grid: {
    borderColor: '#f3f4f6',
    strokeDashArray: 3
  }
}))

const initChart = async () => {
  if (!chartContainer.value) return
  
  try {
    const ApexCharts = (await import('apexcharts')).default
    
    if (chart) {
      chart.destroy()
    }

    chart = new ApexCharts(chartContainer.value, {
      ...chartOptions.value,
      series: props.series
    })
    
    await chart.render()
  } catch (error) {
    console.error('Error initializing chart:', error)
  }
}

const updateChart = async () => {
  if (chart) {
    await chart.updateSeries(props.series)
    await chart.updateOptions(chartOptions.value)
  }
}

onMounted(() => {
  initChart()
})

watch(() => props.series, () => {
  updateChart()
}, { deep: true })

watch(() => props.categories, () => {
  initChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<template>
  <div class="column-chart">
    <div v-if="title" class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<style scoped>
.column-chart {
  width: 100%;
  height: 100%;
}

.chart-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.chart-container {
  width: 100%;
}

/* Override ApexCharts styles */
:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.apexcharts-legend) {
  padding: 10px 0 !important;
}

:deep(.apexcharts-legend-series) {
  margin: 0 10px !important;
}
</style>