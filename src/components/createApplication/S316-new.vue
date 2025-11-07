<script setup lang="ts">
const props = defineProps<['readonly', 'allowUpdateItem']>()

// default allowUpdateItem to true
const readonly = props.values.readonly
const allowUpdateItem = props.values.allowUpdateItem ?? true

interface ElectronicItem {
  id: number
  option_title: string
  quantity: number
}
interface Material { option_title?: string }
const requestStore = useRequestStore()
const { requestServiceForm } = storeToRefs(requestStore)
const serviceItemStore = useServiceItemStore()
const { kwSizes } = storeToRefs(serviceItemStore)

const filterValue = ref('')
const filteredMaterials = computed<Material[]>(() => {
  if (!filterValue.value) {
    return kwSizes.value
  }
  const needle = filterValue.value.toLowerCase()
  return kwSizes.value.filter((option: Material) => {
    const code = option.option_title ? option.option_title.toLowerCase() : ''

    return code.includes(needle)
  })
})

function filterFn(val: string, update: () => void) {
  filterValue.value = val
  update()
}

requestServiceForm.value.days = computed(() =>
  totalDays(
    requestServiceForm.value.rental_startdate,
    requestServiceForm.value.rental_enddate,
  ),
)

onMounted(async () => {
  await serviceItemStore.fetchKwSize()
})

const mockElectronicList = ref<ElectronicItem[]>([{
  id: 1,
  option_title: filteredMaterials.value[0].option_title,
  quantity: 1,
}, {
  id: 2,
  option_title: filteredMaterials.value[1].option_title,
  quantity: 4,
}]) // make reactive

// functions to adjust quantity
function increase(item: ElectronicItem) {
  item.quantity++
}

function decrease(item: ElectronicItem) {
  if (item.quantity > 0) {
    item.quantity--
  }
}

// functions to add/remove items
function addItem() {
  const nextId = mockElectronicList.value.length > 0
    ? Math.max(...mockElectronicList.value.map(i => i.id)) + 1
    : 1
  mockElectronicList.value.push({
    id: nextId,
    option_title: filteredMaterials.value[0]?.option_title || '',
    quantity: 1,
  })
}

function removeItem(index: number) {
  mockElectronicList.value.splice(index, 1)
}
</script>

<template>
  <div>
    <div class="q-pa-sm col-12 col-md-6">
      <FormDatePicker
        v-model="requestServiceForm.rental_startdate" custom-class="q-pa-sm col-12 col-md-4"
        label-text="วันที่เริ่มต้น" :readonly="readonly"
      />

      <FormDatePicker
        v-model="requestServiceForm.rental_enddate" custom-class="q-pa-sm col-12 col-md-4"
        label-text="วันที่สิ้นสุด" :readonly="readonly"
      />

      <div class="q-pa-sm col-12 col-md-4">
        <q-input
          v-model.number="requestServiceForm.days" bg-color="white" color="primary" label-color="grey-14" filled
          label="จำนวนวัน" class="input_filled input_filled_custom" hide-bottom-space
          :rules="[(val) => (val !== null && val !== '') || 'กรุณากรอกจำนวนวัน']" readonly @keypress="allowOnlyNumbers"
        >
          <template #label>
            จำนวนวัน <span class="color_negative">*</span>
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-pa-sm col-12 col-md-6">
      <template v-for="(item, idx) in mockElectronicList" :key="item.id">
        <div class="row q-mb-xs items-center">
          <div>รายการที่ {{ idx + 1 }}</div>
          <q-icon v-if="allowUpdateItem" name="close" color="negative" class="q-ml-sm cursor-pointer" @click="removeItem(idx)" />
        </div>
        <q-select
          v-model="item.option_title" :options="filteredMaterials" hide-dropdown-icon filled
          class="input_filled input_filled_custom" @filter="filterFn"
        />
        <q-input
          v-model.number="item.quantity" bg-color="white" color="primary" label-color="grey-14" filled
          :label="`จำนวน ${item.option_title}`" class="input_filled input_filled_custom" hide-bottom-space
          :readonly="readonly" @keypress="allowOnlyNumbers" @paste="allowOnlyNumbers"
        >
          <template #label>
            จำนวน {{ item.option_title }} <span class="color_negative">*</span>
          </template>
          <template #append>
            <q-icon name="plus" color="secondary" class="cursor-pointer" @click="increase(item)" />
            <q-icon name="remove" color="negative" class="cursor-pointer" @click="decrease(item)" />
          </template>
        </q-input>
      </template>
      <div class="q-pa-sm col-12 col-md-4">
        <q-btn v-if="allowUpdateItem" label="เพิ่มรายการ" color="primary" @click="addItem" />
      </div>
    </div>
  </div>
</template>
