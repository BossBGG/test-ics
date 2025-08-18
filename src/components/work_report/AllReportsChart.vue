<script setup lang="ts">
import ColumnChart from '~/components/ui/graph/ColumnChart.vue'
import { allReportsChartData } from '~/data/workreportData'
</script>

<template>
  <div class="all-reports-chart">
    <ColumnChart
      :series="allReportsChartData.series"
      :categories="allReportsChartData.categories"
      :height="350"
      :colors="['#c084fc', '#8b5cf6']"
      title="รายงานทั้งหมด"
    />
  </div>
</template>

<style scoped>
.all-reports-chart {
  width: 100%;
  height: 100%;
}
</style>