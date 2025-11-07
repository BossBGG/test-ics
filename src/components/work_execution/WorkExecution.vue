<!-- src/components/work_execution/WorkExecution.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import MapDisplay from "~/components/map/MapDisplay.vue";
import { WorkOrderObj } from "~/api/types.js"

interface WorkExecutionData {
  startDateTime: string | Date | undefined | null;
  endDateTime: string | Date | undefined | null;
}

interface Props {
  data: WorkOrderObj;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

const workExecution = ref<WorkExecutionData>({
  startDateTime: props.data?.startWorkDate || "",
  endDateTime: props.data?.endWorkDate || "",
});

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
const latitude = ref(props.data?.latitude || 0);
const longitude = ref(props.data?.longitude || 0);

onMounted(() => {
  getCurrentLocation();
});

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        console.log("Latitude is :", latitude.value)
        console.log("longitude is :", longitude.value)
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

const handleLocationUpdate = (lat: number, lng: number) => {
  latitude.value = lat
  longitude.value = lng
  console.log('Location updated:', { lat, lng })
  let newData = {
    ...props.data,
    latitude: lat,
    longitude: lng,
  };
  emit("update:data", newData)
}

watch(() => workExecution.value, () => {
  let newData = {
    ...props.data,
    startWorkDate: workExecution.value.startDateTime,
    endWorkDate: workExecution.value.endDateTime,
  };

  emit("update:data", newData)
}, {deep: true})
</script>

<template>
  <CardCollapse title="ผลปฏิบัติงาน" icon="/assets/images/calendar.png">
    <div class="py-4">
      <div class="flex flex-wrap mb-6 w-full">
        <!-- Left Section - Date Inputs -->
        <div class="flex flex-col px-2 w-1/2">
          <!-- Date Inputs -->
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >วันที่และเวลาเริ่มปฏิบัติงาน</label
              >
              <FormDateTimePicker v-model="workExecution.startDateTime"
                                  labelText=""
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium text-gray-700"
                >วันที่และเวลาปฏิบัติงานเสร็จ</label
              >
              <FormDateTimePicker v-model="workExecution.endDateTime"
                                  labelText=""
              />
            </div>
          </div>
        </div>

        <!-- Right Section - Map -->
        <div class="flex flex-col px-2 w-1/2">
          <div class="h-full min-h-[300px]">
            <MapDisplay
              :latitude="latitude"
              :longitude="longitude"
              :options="{ showEditable: true }"
              :disabled="false"
              @update:location="handleLocationUpdate"
            />
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
              {{ workExecution.startDateTime || '-' }}
            </span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-gray-600 font-medium">เสร็จงาน:</span>
            <span class="text-sm text-gray-900 font-semibold">
              {{ workExecution.endDateTime || '-' }}
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
