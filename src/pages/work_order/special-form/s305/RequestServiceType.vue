<!-- src/components/work_order/BusinessType.vue -->
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import CardCollapse from "~/components/ui/card/CardCollapse.vue";
import {Options, S305ServiceData, WorkOrderObj} from "~/api/types";
import {getRequestTypesByForm, getServiceTypesByForm} from "~/api/options_api";

interface Props {
  data: WorkOrderObj
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:data": [data: WorkOrderObj];
}>();


const serviceTypesOptions = ref<Options[]>([]);
const requestServiceOptions = ref<Options[]>([]);

const selectedReqService = computed(() => {
  let serviceSpec = props.data?.serviceSpecificData as S305ServiceData
  console.log('serviceSpec >>> ', serviceSpec)
  if(serviceSpec?.requestServiceTypeId){
    console.log('requestServiceOptions.value.find((opt) => opt.value === serviceSpec?.requestServiceTypeId) >>> ', requestServiceOptions.value.find((opt) => opt.value === serviceSpec?.requestServiceTypeId))
    let req = requestServiceOptions.value.find((opt) => opt.value === serviceSpec?.requestServiceTypeId)
    if(req){
      return req.label || ""
    }
  }
})

const selectedService = computed(() => {
  let serviceSpec = props.data?.serviceSpecificData as S305ServiceData
  if(serviceSpec?.requestServiceId){
    return serviceTypesOptions.value.find((opt) => opt.value === serviceSpec?.requestServiceId)?.label || ""
  }
  return ""
})

onMounted(() => {
  Promise.all([
    fetchServiceTypes(),
    fetchRequestServiceTypes()
  ]).then(([]) => {

  })
})

const fetchServiceTypes = async () => {
  try {
    const res = await getServiceTypesByForm('s305')
    if(res.status === 200 && res.data.data){
      serviceTypesOptions.value  = res.data.data.map((item: any) => ({
        value: item.id,
        label: item.optionTitle,
      }))
    }
  } catch (error) {
    serviceTypesOptions.value = []
  }
};

const fetchRequestServiceTypes = async () => {
  try {
    const res = await getRequestTypesByForm('s305')
    if(res.status === 200 && res.data.data){
      requestServiceOptions.value  = res.data.data.map((item: any) => ({
        value: item.id,
        label: item.optionTitle,
      }))
    }
  } catch (error) {
    requestServiceOptions.value = []
  }
};

const handleUpdateData = (key: string, value: string) => {
  console.log('handleUpdateData >>> ', handleUpdateData)
  let serviceSpec = props.data?.serviceSpecificData as S305ServiceData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      [key]: value
    }
  } as WorkOrderObj

  emit('update:data', newData)
}
</script>

<template>
  <div class="pb-4">
    <div class="mb-3">
      <div class="pb-4">ประเภทคำร้อง</div>

      <div>
        <q-select
          v-model="selectedReqService"
          :options="requestServiceOptions"
          outlined
          placeholder="เลือกประเภทธุรกิจ"
          class="business-select"
          @update:model-value="(v: Options) => handleUpdateData('requestServiceTypeId', v.value as string)"
        />
      </div>
    </div>

    <div>
      <div class="pb-4">ประเภทการให้บริการ</div>

      <div>
        <q-select
          :model-value="selectedService"
          :options="serviceTypesOptions"
          outlined
          placeholder="เลือกประเภทธุรกิจ"
          @update:model-value="(v: Options) => handleUpdateData('requestServiceId', v.value as string)"
        />
      </div>
    </div>
  </div>
</template>
