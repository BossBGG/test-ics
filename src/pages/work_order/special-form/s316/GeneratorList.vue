<!-- src/pages/work_order/special-form/s316/GeneratorList.vue -->
<script setup lang="ts">
import {ref} from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import "@/styles/generator-list.css";

interface Generator {
  id: number;
  type: string;
  power: string;
  location: string;
  distance: string;
  phone: string;
  status: "available" | "unavailable";
}

// Service date data
const serviceData = ref({
  dateRange: null as { from: string; to: string } | null,
  timeRange: {from: null as string | null, to: null as string | null},
});

// Refs for popup control
const datePopupRef = ref();
const timePopupRef = ref();

// Computed properties for display
const dateRangeDisplay = computed(() => {
  if (!serviceData.value.dateRange) return "";
  const {from, to} = serviceData.value.dateRange;
  if (from && to) {
    const fromDate = new Date(from).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const toDate = new Date(to).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${fromDate} - ${toDate}`;
  } else if (from) {
    return new Date(from).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return "";
});

const timeRangeDisplay = computed(() => {
  if (!serviceData.value.timeRange.from && !serviceData.value.timeRange.to)
    return "";
  const {from, to} = serviceData.value.timeRange;
  if (from && to) {
    return `${from} - ${to}`;
  } else if (from) {
    return from;
  }
  return "";
});

// Mock data ตามรูป design
const generators = ref<Generator[]>([
  {
    id: 1,
    type: "เครื่อง 300kW",
    power: "รายการที่ 1",
    location: "กฟฟ.สามพราน",
    distance: "ระยะทาง : 20กม.",
    phone: "02-683-1129",
  },
  {
    id: 2,
    type: "เครื่อง 300kW",
    power: "รายการที่ 1",
    location: "กฟฟ.สามพราน",
    distance: "ระยะทาง : 20กม.",
    phone: "02-683-1129",
  },
  {
    id: 3,
    type: "เครื่อง 500kW",
    power: "รายการที่ 1",
    location: "กฟฟ.สามพราน",
    distance: "ระยะทาง : 20กม.",
    phone: "02-683-1129",
  },
]);

const clearAllData = () => {
  console.log("Clear all data");
};

const addGenerator = () => {
  console.log("Add generator");
};

const selectGenerator = (generator: Generator) => {
  console.log("Select generator:", generator);
};

const removeGenerator = (id: number) => {
  console.log("Remove generator:", id);
};

const copyPhone = (phone: string) => {
  navigator.clipboard.writeText(phone);
  console.log("Copied phone:", phone);
};

const contactGenerator = (generator: Generator) => {
  console.log("Contact generator:", generator);
};

// Methods for handling popup close
const cancelDateSelection = () => {
  // Reset to previous value or clear
  console.log("Date selection cancelled");
  datePopupRef.value?.hide();
};

const confirmDateSelection = () => {
  console.log("Date selection confirmed:", serviceData.value.dateRange);
  datePopupRef.value?.hide();
};

const cancelTimeSelection = () => {
  // Reset to previous value or clear
  console.log("Time selection cancelled");
  timePopupRef.value?.hide();
};

const confirmTimeSelection = () => {
  console.log("Time selection confirmed:", serviceData.value.timeRange);
  timePopupRef.value?.hide();
};
</script>

<template>
  <div class="pb-4">เครื่องกำเนิดไฟฟ้า</div>

  <div class="generator-list-container">
    <div class="flex flex-row">
      <div>
        <!-- Date Section -->
        <div class="date-section">
          <h4 class="generator-section-title">วันที่ขอรับบริการ</h4>

          <div class="date-inputs">
            <!-- Service Date Range -->
            <div class="date-input-group">
              <q-input
                :model-value="dateRangeDisplay"
                outlined
                readonly
                placeholder="วันที่เริ่มต้น - สิ้นสุดการเช่า"
                class="date-range-input"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="datePopupRef"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="serviceData.dateRange"
                        range
                        mask="YYYY-MM-DD"
                        today-btn
                        flat
                        square
                      >
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn
                            label="ยกเลิก"
                            color="primary"
                            flat
                            @click="cancelDateSelection"
                          />
                          <q-btn
                            label="ตกลง"
                            color="primary"
                            flat
                            @click="confirmDateSelection"
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- Time Range -->

            <div class="time-input-group">
              <h4 class="generator-section-title">
                ประมาณเวลาที่เริ่มต้น-สิ้นสุดที่ต้องการใช้งาน
              </h4>
              <q-input
                :model-value="timeRangeDisplay"
                outlined
                readonly
                placeholder="เลือกช่วงเวลา"
                class="time-range-input"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      ref="timePopupRef"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <div class="time-picker-container">
                        <div class="time-picker-header">
                          เลือกเวลาเริ่มต้น - สิ้นสุด
                        </div>

                        <div class="time-picker-content">
                          <div class="time-input-section">
                            <label>เวลาเริ่มต้น</label>
                            <q-time
                              v-model="serviceData.timeRange.from"
                              mask="HH:mm"
                              format24h
                              flat
                            />
                          </div>

                          <div class="time-separator">-</div>

                          <div class="time-input-section">
                            <label>เวลาสิ้นสุด</label>
                            <q-time
                              v-model="serviceData.timeRange.to"
                              mask="HH:mm"
                              format24h
                              flat
                            />
                          </div>
                        </div>

                        <div class="time-picker-actions">
                          <q-btn
                            label="ยกเลิก"
                            color="primary"
                            flat
                            @click="cancelTimeSelection"
                          />
                          <q-btn
                            label="ตกลง"
                            color="primary"
                            flat
                            @click="confirmTimeSelection"
                          />
                        </div>
                      </div>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>

      <div>
        <!-- Generator Section -->
        <div class="generator-section bg-[#f8f9fa] w-[950px] ">
          <div class="generator-cards">
            <div
              v-for="generator in generators"
              :key="generator.id"
              class="generator-card"
            >
              <!-- Header -->
              <div class="card-header">
                <div class="header-content">
                  <div class="generator-type">
                    {{ generator.type }} : {{ generator.power }}
                  </div>
                  <button
                    class="remove-btn"
                    @click="removeGenerator(generator.id)"
                    title="ลบรายการ"
                  >
                    <q-icon name="close"/>
                  </button>
                </div>
              </div>

              <!-- Card Body -->
              <div class="card-body">
                <!-- Location and Contact Row -->
                <div class="info-row">
                  <!-- Location with Select Button -->
                  <div class="location-section">
                    <div class="field-label">การไฟฟ้าเจ้าของเครื่อง</div>
                    <div class="location-content">
                      <div class="location-details">
                        <div class="location-name">
                          {{ generator.location }}
                        </div>
                      </div>

                      <div class="location-distance">
                        {{ generator.distance }}
                      </div>

                      <button
                        class="select-btn"
                        @click="selectGenerator(generator)"
                      >
                        <img src="/assets/images/generator-select-icon.png" alt="" class="w-6 h-6">
                        เลือก
                      </button>
                    </div>
                  </div>

                  <!-- Phone Contact -->
                  <div class="contact-section">
                    <div class="field-label">
                      เบอร์ติดต่อการไฟฟ้าเจ้าของเครื่อง
                    </div>
                    <div class="contact-content">
                      <div class="phone-display">{{ generator.phone }}</div>

                      <div class="contact-actions">
                        <button
                          class="copy-btn"
                          @click="copyPhone(generator.phone)"
                          title="คัดลอก"
                        >
                          <q-icon name="content_copy"/>
                          คัดลอก
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Buttons -->
    <div class="bottom-actions">
      <button class="generator-action-btn-bottom generator-clear-btn" @click="clearAllData">
        <img src="/assets/images/delete-icon.png" alt="" class="icon"/>
        ลบทั้งหมด
      </button>

      <button class="generator-action-btn-bottom generator-add-btn-bottom" @click="addGenerator">
        <img src="/assets/images/add-icon.png" alt="" class="w-6 h-6"/>
        เพิ่มรายการ
      </button>
    </div>
  </div>

</template>
