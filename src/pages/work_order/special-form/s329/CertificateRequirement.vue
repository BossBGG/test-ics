<!-- src/pages/work_order/special-form/s329/CertificateRequirement.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";
import {getRenewableSources} from "~/api/options_api";
import {OptionApi, Options, S329ServiceData, WorkOrderObj} from "~/api/types";

interface Props {
  data: WorkOrderObj
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj];
}>();

const energyOptions = ref<Options[]>([])
const selectedValue = ref<Options | string>();
onMounted(async () => {
  await getRenewableSources().then((res) => {
    if(res.status === 200 && res.data.data) {
      let options:Options[] = []
      res.data.data.map((d: OptionApi) => (
        options.push({ value: d.id, label: d.optionTitle, data: d })
      ))

      energyOptions.value = options
      if(options.length > 0) {
        let serviceSpec = props.data?.serviceSpecificData as S329ServiceData
        let selected = options.find((o) => o.value === serviceSpec?.renewableSource)
        selectedValue.value = selected || ""
      }
    }else {
      energyOptions.value = []
    }
  })
})

const handleValueChange = (newValue: Options) => {
  selectedValue.value = newValue;
  let serviceSpec = props.data?.serviceSpecificData as S329ServiceData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      renewableSource: newValue.value
    }
  } as WorkOrderObj

  emit("update:data", newData);
};
</script>

<template>
  <div class="s329-certificate-form">
    <div class="s329-form-group">
      <label class="s329-form-label">
        สำรวจความต้องการใบรับรองการผลิตพลังงานหมุนเวียน
      </label>
      <q-select
        :model-value="selectedValue"
        :options="energyOptions"
        outlined
        @update:model-value="handleValueChange"
      />
    </div>
  </div>
</template>

<style scoped>
/* Import s329 styles */
@import "@/styles/s329.css";
</style>
