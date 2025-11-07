<!-- src/components/work_order/VoltageLevel.vue -->
<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue"
import {S308ServiceData, WorkOrderObj} from "~/api/types";

interface Props {
  data: WorkOrderObj
}

const props = defineProps<Props>()
const transformerCapacityKw = ref<string>("")

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>()

onMounted(() => {
  handleMapData()
})

watch(() => props.data?.serviceSpecificData, () => {
  handleMapData()
}, {deep: true})

const handleMapData = () => {
  let serviceSpec = props.data?.serviceSpecificData as S308ServiceData
  transformerCapacityKw.value = serviceSpec?.transformerCapacityKw?.toString() || "0"
}

const handleValueChange = (newValue: string | number | null) => {
  let serviceSpec = props.data?.serviceSpecificData as S308ServiceData
  transformerCapacityKw.value = newValue as string
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      transformerCapacityKw: newValue ? parseFloat(newValue as string) : ""
    }
  } as WorkOrderObj

  emit('update:data', newData)
}
</script>

<template>
  <div class="pb-4">
    <div>
      <div class="pb-4">ระดับแรงดันไฟฟ้า</div>

      <div class="flex flex-row gap-4 ">
        <q-input
          v-model="transformerCapacityKw"
          outlined
          placeholder="กรอกระดับแรงดันไฟฟ้า"
          class="form-input w-[85%]"
          @update:model-value="handleValueChange"
        />

        <div class="bg-[#EDEDED] w-[180px] justify-center text-start items-center p-4 rounded-md">
          kw
        </div>
      </div>
    </div>
  </div>
</template>
