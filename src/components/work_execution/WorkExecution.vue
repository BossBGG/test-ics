<!-- src/components/work_execution/WorkExecution.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";

interface WorkExecutionData {
  startDateTime: string;
  endDateTime: string;
}

interface Props {
  data?: WorkExecutionData;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkExecutionData];
}>();

const workExecution = ref<WorkExecutionData>({
  startDateTime: props.data?.startDateTime || "",
  endDateTime: props.data?.endDateTime || "",
});

const updateField = (field: keyof WorkExecutionData, value: string) => {
  workExecution.value[field] = value;
  emit("update:data", { ...workExecution.value });
};

// Format datetime for display
const formatDateTime = (datetime: string) => {
  if (!datetime) return "ยังไม่ระบุ";
  const date = new Date(datetime);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Check if any date is selected for summary section
const hasAnyDate = computed(() => {
  return workExecution.value.startDateTime || workExecution.value.endDateTime;
});

// Mock coordinates for map display
const latitude = ref(18.74499);
const longitude = ref(99.126769);

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};
</script>

<template>
  <CardCollapse title="ผลปฏิบัติงาน" icon="/assets/images/calendar.png">
    <div class="py-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Left Section - Date Inputs -->
        <div class="flex flex-col gap-4">
          <!-- Date Inputs -->
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >วันที่และเวลาเริ่มปฏิบัติงาน</label
              >
              <q-input
                :model-value="workExecution.startDateTime"
                type="datetime-local"
                outlined
                placeholder="เลือกวันที่และเวลา"
                class="datetime-input w-full"
                @update:model-value="
                  (value) => updateField('startDateTime', value)
                "
              >
              </q-input>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >วันที่และเวลาปฏิบัติงานเสร็จ</label
              >
              <q-input
                :model-value="workExecution.endDateTime"
                type="datetime-local"
                outlined
                placeholder="เลือกวันที่และเวลา"
                class="datetime-input w-full"
                @update:model-value="
                  (value) => updateField('endDateTime', value)
                "
              >
              </q-input>
            </div>
          </div>
        </div>

        <!-- Right Section - Map -->
        <div class="flex flex-col">
          <div class="h-full min-h-[300px]">
            <div class="mb-3">
              <button
                class="flex items-center justify-center gap-2 w-full bg-[#994C80] text-white font-medium py-3 px-5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                @click="getCurrentLocation"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />
                </svg>
                ตรวจสอบ/แก้ไขตำแหน่ง
              </button>
            </div>

            <!-- Placeholder Map -->
            <div
              class="flex-1 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center min-h-[250px]"
            >
              <div class="text-center text-gray-500">
                <q-icon name="map" size="48px" class="text-gray-400" />
                <p class="text-base mt-2 mb-1 text-gray-700">
                  แผนที่แสดงตำแหน่งปฏิบัติงาน
                </p>
                <p class="text-sm text-gray-500 m-0">
                  พิกัด: {{ latitude.toFixed(6) }}, {{ longitude.toFixed(6) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div
        v-if="hasAnyDate"
        class="p-5 bg-gray-50 rounded-lg border border-gray-200"
      >
        <h4 class="text-base font-semibold text-gray-700 mb-4">
          สรุปข้อมูลการปฏิบัติงาน
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-sm text-gray-600 font-medium">เริ่มงาน:</span>
            <span class="text-sm text-gray-900 font-semibold">
              {{ formatDateTime(workExecution.startDateTime) }}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-gray-600 font-medium">เสร็จงาน:</span>
            <span class="text-sm text-gray-900 font-semibold">
              {{ formatDateTime(workExecution.endDateTime) }}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-gray-600 font-medium">พิกัด:</span>
            <span class="text-sm text-gray-900 font-semibold">
              {{ latitude.toFixed(6) }}, {{ longitude.toFixed(6) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </CardCollapse>
</template>

<style scoped>
/* Quasar Input Overrides */
:deep(.datetime-input .q-field--outlined .q-field__control) {
  border-radius: 8px;
  border-color: #d1d5db;
  min-height: 48px;
}

:deep(.datetime-input .q-field--outlined .q-field__control:hover) {
  border-color: #69306d;
}

:deep(.datetime-input .q-field--outlined.q-field--focused .q-field__control) {
  border-color: #69306d;
  box-shadow: 0 0 0 2px rgba(105, 48, 109, 0.1);
}

:deep(.datetime-input .q-field__inner) {
  padding: 12px 16px;
  font-size: 14px;
}

:deep(.datetime-input .q-field__control-container) {
  padding-top: 0;
}
</style>
