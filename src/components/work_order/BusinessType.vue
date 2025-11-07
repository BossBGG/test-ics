<!-- src/components/work_order/BusinessType.vue -->
<script setup lang="ts">
import { ref } from "vue";
import {getBusinessTypes} from "~/api/options_api";
import {BusinessTypeData, BusinessTypeOption, Options, WorkOrderObj} from "~/api/types";

interface Props {
  data: WorkOrderObj
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>();

const businessOptions = ref<Options[]>([]);
const selectedValue = ref<string>("");

const selectedLabel = computed(() => {
  const option = businessOptions.value.find(
    (opt) => (opt.value as string).toLowerCase() == selectedValue.value.toLowerCase()
  );

  return option ? option.label : "";
});

onMounted(async () => {
  await getBusinessTypes().then((res) => {
    if(res.status === 200 && res.data.data){
      businessOptions.value = res.data.data.map((item: BusinessTypeOption) => ({
        value: item.id,
        label: item.name,
      }));
    }
  });

  handleMapBusinessData()
})

watch(() => props.data?.serviceSpecificData, (newVal) => {
  handleMapBusinessData()
})

const handleMapBusinessData = () => {
  let serviceSpec = props.data?.serviceSpecificData as BusinessTypeData
  if(serviceSpec?.businessTypeId) {
    selectedValue.value = serviceSpec.businessTypeId
  }else {
    let firstVal = businessOptions.value[0].value as string || ""
    selectedValue.value = firstVal
    handleUpdateData(firstVal as string)
  }
}

const handleValueChange = (opt: Options) => {
  selectedValue.value = opt.value as string;
  handleUpdateData(opt.value as string)
};

const handleUpdateData = (value: string) => {
  let serviceSpec = props.data?.serviceSpecificData as BusinessTypeData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      businessTypeId: value.toString()
    }
  } as WorkOrderObj

  emit("update:data", newData);
};
</script>

<template>
  <div class="pb-4">
    <div>
      <div class="pb-4">ประเภทธุรกิจ</div>

      <div>
        <q-select
          v-model="selectedLabel"
          :options="businessOptions"
          outlined
          placeholder="เลือกประเภทธุรกิจ"
          class="business-select"
          @update:model-value="handleValueChange"
        />
      </div>
    </div>
  </div>
</template>
