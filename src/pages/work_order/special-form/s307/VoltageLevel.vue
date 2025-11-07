<!-- src/components/work_order/BusinessType.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {getTransformerVoltagesByForm} from "~/api/options_api";
import {Options, S307ServiceData, WorkOrderObj} from "~/api/types";

interface Props {
  data?: WorkOrderObj;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

const selectedValue = ref(props.data?.serviceSpecificData?.voltageId || "");
const voltageOptions = ref<Options[]>([])

onMounted(async () => {
  await getTransformerVoltagesByForm('s307').then((res) => {
    if(res.status === 200 && res.data.data) {
      voltageOptions.value = res.data.data.map((d) => {
        return {value: d.id, label: d.optionTitle, data: d}
      })
    }else {
      voltageOptions.value = []
    }
  })
})

// Watch for prop changes
watch(
  () => props.data?.serviceSpecificData?.voltageId,
  (newValue) => {
    selectedValue.value = newValue || "";
  }, {deep: true}
);

const selectedLabel = computed(() => {
  const option = voltageOptions.value.find(
    (opt) => opt.value === selectedValue.value
  );
  return option ? option.label : "";
});

const handleValueChange = (option: Options) => {
  selectedValue.value = option.value as string;
  let serviceSpec = props.data?.serviceSpecificData as S307ServiceData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      voltageId: option.value as string,
    }
  } as WorkOrderObj
  emit("update:data", newData);
};
</script>

<template>
  <div class="pb-4">
    <div >
      <div class="pb-4">ระดับแรงดันไฟฟ้า</div>

      <div>
        <q-select
          :model-value="selectedLabel"
          :options="voltageOptions"
          outlined
          placeholder="เลือกระดับแรงดันไฟฟ้า"
          @update:model-value="handleValueChange"
        />
      </div>
    </div>
  </div>
</template>
