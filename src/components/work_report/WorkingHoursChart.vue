<script setup lang="ts">
import { ref, onMounted } from "vue";
import CardWorkingHours from "~/components/ui/card/CardWorkingHours.vue";
import {
  workingHoursChartData,
  workingHoursCards,
} from "~/data/workreportData";

const chartContainer = ref<HTMLElement>();
const showTooltip = ref(false);
const tooltipData = ref({
  month: "",
  peaEmployees: 0,
  peaHours: 0,
  contractors: 0,
  contractorHours: 0,
  averageHours: 0,
  x: 0,
  y: 0,
});

let chart: any = null;

const chartOptions = {
  chart: {
    type: "bar",
    height: 300,
    toolbar: {
      show: false,
    },
    events: {
      click: function (event: any, chartContext: any, config: any) {
        const dataPointIndex = config.dataPointIndex;

        if (dataPointIndex >= 0) {
        
          const monthData = workingHoursChartData.tooltipData[dataPointIndex];
          tooltipData.value = {
            ...monthData,
            x: event.clientX - 125,
            y: event.clientY - 150,
          };
          showTooltip.value = true;
        } else {
     
          showTooltip.value = false;
        }
      },
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      borderRadius: 4,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: workingHoursChartData.categories,
    labels: {
      style: {
        fontSize: "12px",
        fontWeight: 400,
        colors: "#6b7280",
      },
    },
  },
  yaxis: {
    title: {
      text: "",
      style: {
        fontSize: "12px",
        fontWeight: 400,
        color: "#6b7280",
      },
    },
    labels: {
      style: {
        fontSize: "12px",
        fontWeight: 400,
        colors: "#6b7280",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    enabled: false, // Disable default tooltip
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontSize: "12px",
    fontWeight: 400,
    labels: {
      colors: "#6b7280",
    },
    markers: {
      width: 12,
      height: 12,
      radius: 2,
    },
  },
  colors: ["#8b5cf6", "#fbbf24"],
  grid: {
    borderColor: "#f3f4f6",
    strokeDashArray: 3,
  },
};

const initChart = async () => {
  if (!chartContainer.value) return;

  try {
    const ApexCharts = (await import("apexcharts")).default;

    if (chart) {
      chart.destroy();
    }

    chart = new ApexCharts(chartContainer.value, {
      ...chartOptions,
      series: workingHoursChartData.series,
    });

    await chart.render();
  } catch (error) {
    console.error("Error initializing chart:", error);
  }
};

const hideTooltip = () => {
  showTooltip.value = false;
};

// Hide tooltip when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (
    !target.closest(".custom-tooltip") &&
    !target.closest(".apexcharts-canvas")
  ) {
    showTooltip.value = false;
  }
};

onMounted(() => {
  initChart();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="working-hours-chart">
    <div class="chart-header">
      <h3 class="chart-title">จำนวนชั่วโมงปฏิบัติงานรวม</h3>
    </div>

    <!-- Working Hours Cards -->
    <div class="cards-container">
      <CardWorkingHours
        title="พนักงาน PEA"
        :hours="6200"
        backgroundColor="#F1DCEB"
      />

      <CardWorkingHours
        title="ผู้รับจ้าง"
        :hours="6000"
        backgroundColor="#FFF5E6"
      />

      <CardWorkingHours
        title="ชั่วโมง"
        :hours="12200"
        backgroundColor="#A6D5FA"
      />
    </div>

    <div ref="chartContainer" class="chart-container"></div>

    <!-- Custom Tooltip -->
    <div
      v-if="showTooltip"
      class="custom-tooltip"
      :style="{
        left: tooltipData.x + 'px',
        top: tooltipData.y + 'px',
      }"
      @click.stop
    >
      <div class="tooltip-header">
        {{ tooltipData.month }}
      </div>
      <div class="tooltip-content">
        <div class="bg-[#F6F3FF] p-2 rounded-md mb-4">
          <div class="tooltip-row">
            <img
              src="/assets/images/sub-pea-em.png"
              alt=""
              class="w-4 h-5 mr-2"
            />
            <span class="tooltip-label">จำนวนพนักงาน PEA :</span>
            <span class="tooltip-value">{{ tooltipData.peaEmployees }} คน</span>
          </div>
          <div class="tooltip-row">
            <img
              src="/assets/images/sub-hours-em.png"
              alt=""
              class="w-4 h-5 mr-2"
            />
            <span class="tooltip-label">จำนวนชั่วโมง :</span>
            <span class="tooltip-value"
              >{{ tooltipData.peaHours }} ชั่วโมง</span
            >
          </div>
        </div>
        <div class="bg-[#FFF5E6] p-2 rounded-md mb-4">
          <div class="tooltip-row">
            <img
              src="/assets/images/sub-pea-con.png"
              alt=""
              class="w-4 h-5 mr-2"
            />
            <span class="tooltip-label">จำนวนผู้รับจ้าง:</span>
            <span class="tooltip-value">{{ tooltipData.contractors }} คน</span>
          </div>
          <div class="tooltip-row">
            <img
              src="/assets/images/sub-hours-con.png"
              alt=""
              class="w-4 h-5 mr-2"
            />
            <span class="tooltip-label"> จำนวนชั่วโมง :</span>
            <span class="tooltip-value"
              >{{ tooltipData.contractorHours }} ชั่วโมง</span
            >
          </div>
        </div>
        <div class="tooltip-divider"></div>
        <div class="tooltip-row">
          <span class="tooltip-label">ชั่วโมงเฉลี่ย/คน :</span>
          <span class="tooltip-value highlight"
            >~ {{ tooltipData.averageHours }} ชั่วโมง</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.working-hours-chart {
  width: 100%;
  height: 100%;
  position: relative;
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

.cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.chart-container {
  width: 100%;
  height: 300px;
  cursor: pointer;
}

/* Custom Tooltip Styles */
.custom-tooltip {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 0;
  z-index: 1000;
  min-width: 250px;
  font-size: 14px;
}

.tooltip-header {
  background: white;
  color: black;
  padding: 8px 16px;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
  text-align: start;
}

.tooltip-content {
  padding: 12px 16px;
}

.tooltip-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
}

.tooltip-row:last-child {
  margin-bottom: 0;
}

.tooltip-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.pea-icon {
  background: #8b5cf6;
}

.contractor-icon {
  background: #fbbf24;
}

.time-icon {
  background: #6b7280;
}

.tooltip-label {
  flex: 1;
  color: #374151;
}

.tooltip-value {
  font-weight: 600;
  color: #1f2937;
}

.tooltip-value.highlight {
  color: #69306d;
}

.tooltip-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .custom-tooltip {
    min-width: 200px;
    font-size: 12px;
  }

  .tooltip-row {
    font-size: 11px;
  }
}
</style>
