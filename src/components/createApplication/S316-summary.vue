<script setup lang="ts">
const props = defineProps<{ readonly: boolean, allowUpdateItem?: boolean }>()

// default allowUpdateItem to true
const readonly = props.readonly
const allowUpdateItem = props.allowUpdateItem ?? true

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
  <div />
</template>
