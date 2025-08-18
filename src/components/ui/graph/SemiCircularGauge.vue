

<script setup lang="ts">

interface Props {
  total: number;
  completed: number;
}

const props = withDefaults(defineProps<Props>(), {
  total: 120,
  completed: 80,
})

const chartContainer = ref<HTMLElement>()

let chart:any = null

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.completed / props.total) * 100)
})


const chartOptions = computed(() => ({
  chart: {
              type: 'radialBar',
              height: 180,
              offsetY: -20,
              sparkline: {
                enabled: true
              }
            },
            plotOptions: {
              radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                  background: "#CD9EBE",
                  strokeWidth: '97%',
                  margin: 5, 
                  dropShadow: {
                    enabled: false,
                  }
                },
                dataLabels: {
                  name: {
                    show: false
                  },
                  value: {
                    offsetY: 0,
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#1f2937',
                    formatter: function () {
                      return props.total.toString()
                    }
                  }
                }
              }
            },
            fill: {
              type: 'solid',
              colors: ['#9A3E7E']
            },
            stroke: {
              lineCap: 'round'
            },
            labels: ['Progress'],
}))

const initChart = async () => {
  if (!chartContainer.value) return

  try {
    // Dynamic import of ApexCharts
    const ApexCharts = (await import('apexcharts')).default
  
    if (chart) {
      chart.destroy()
    }

    chart = new ApexCharts(chartContainer.value, {
      ...chartOptions.value,
      series: [percentage.value],
    })

    await chart.render()
  } catch (error) {
    console.error('Error inittializing chart: ', error)
  }
}

const updateChart = async () => {
  if (chart) {
    await chart.updateSeries([percentage.value])
    await chart.updateOptions(chartOptions.value)
  }
}

onMounted(() => {
  initChart()
})


watch(() => [props.total, props.completed], () => {
  updateChart()
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<template>
  <div class="semi-circular-gauge">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<style scoped>
.semi-circular-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.chart-container {
  width: 150px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Override ApexCharts styles */
:deep(.apexcharts-canvas) {
  margin: 0 auto;
}

:deep(.apexcharts-datalabel-value) {
  font-family: inherit !important;
}
</style>

