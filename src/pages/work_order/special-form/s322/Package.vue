<!-- src/components/work_order/Package.vue -->
<script setup lang="ts">
import {ref, computed, watch} from "vue";
import ModalPackageDetail from "~/components/modal/ModalPackageDetail.vue";
import {Options, S322ServiceData, WorkOrderObj} from "~/api/types";

interface Props {
  data: WorkOrderObj;
  showPackageButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showPackageButton: true
});

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

const selectedValue = ref("");
const showPackageDetail = ref<boolean>(false);
const packageOptions = [
  {
    value: "package1",
    label: "Package 1 - ระบบไฟฟ้าแบบครบวงจร (35,000 บาท)",
  },
  {
    value: "package2",
    label: "Package 2 - ระบบไฟฟ้าแบบมาตรฐาน (25,000 บาท)",
  },
  {
    value: "package3",
    label: "Package 3 - ระบบไฟฟ้าแบบพื้นฐาน (20,000 บาท)",
  },
  {
    value: "package4",
    label: "Package 4 - ระบบไฟฟ้าแบบเบื้องต้น (10,000 บาท)",
  },
];

onMounted(() => {
  let serviceSpec = props.data?.serviceSpecificData as S322ServiceData
  if(serviceSpec?.packageId){
    selectedValue.value = serviceSpec.packageId
  }
})

watch(
  () => props.data?.serviceSpecificData,
  (newValue) => {
    let serviceSpec = props.data?.serviceSpecificData as S322ServiceData
    if(serviceSpec?.packageId){
      selectedValue.value = serviceSpec.packageId
    }
  }, {deep: true}
);

// Computed property to get selected label
const selectedLabel = computed(() => {
  const option = packageOptions.find(
    (opt) => opt.value === selectedValue.value
  );
  return option ? option.label : "";
});

const handleValueChange = (opt: Options) => {
  selectedValue.value = opt.label;
  let serviceSpec = props.data?.serviceSpecificData as S322ServiceData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      packageId: opt.value
    }
  } as WorkOrderObj

  emit("update:data", newData);
};

const handlePackageClick = () => {
  showPackageDetail.value = true
};
</script>

<template>
  <div class="package-container">
    <div class="package-form">
      <label class="package-label">Package</label>

      <div class="package-input-row">
        <div class="select-wrapper">
          <q-select
            :model-value="selectedLabel"
            :options="packageOptions"
            outlined
            placeholder="เลือก Package"
            class="package-select"
            @update:model-value="(e) => handleValueChange(e)"
          />
        </div>

        <button
          v-if="showPackageButton"
          @click="handlePackageClick"
          class="package-button"
          type="button"
        >
          <img src="/assets/images/package.png" alt="" class="w-6 h-6">
          Package
        </button>
      </div>


    </div>
  </div>
  <!-- Modal Package Detail -->
  <ModalPackageDetail
    v-model="showPackageDetail"
    @update:model-value="(value) => (showPackageDetail = value)"
  />
</template>

<style scoped>
.package-container {
  padding: 8px 0;
}

.package-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.package-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.package-input-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.select-wrapper {
  flex: 1;
}

.package-select {
  width: 100%;
}

.package-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #69306D;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  height: 55px;
  white-space: nowrap;
  flex-shrink: 0;
}

.package-button:hover {
  background: #5a285d;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(105, 48, 109, 0.3);
}

.package-button:active {
  transform: translateY(0);
}

.package-icon {
  font-size: 18px;
}

.selected-display {
  margin-top: 12px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.selected-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.selected-value {
  font-weight: 500;
  color: #374151;
}


</style>
