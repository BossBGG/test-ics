<script setup lang="ts">
import {ref, h} from 'vue'
import {ColumnDef} from '@tanstack/vue-table'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import DataTableEditor from '@/components/form/DataTableEditor.vue'
import {Options, WorkOrderObj, WorkOrderParticipant} from "~/api/types"
import InputSelect from "~/components/ui/table-editor/InputSelect.vue"
import {Pencil, Save, Trash2} from "lucide-vue-next";
import {fetchWorkerListOptions} from "~/composables/worker_options.js";

interface Props {
  workerListOptions: Options[]
  data: WorkOrderObj
}

const props = defineProps<Props>()
const tableRef = ref<InstanceType<typeof DataTableEditor>>()
const involvedPersonsData = ref<WorkOrderParticipant[]>(props.data?.participants || [])
const isUpdatingFromProps = ref(false)
const workerOptions = ref<Options[]>(props.workerListOptions || [])

const emits = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>()

onMounted(() => {
  tableRef.value?.setData(involvedPersonsData.value)
})

watch(() => involvedPersonsData.value, () => {
  if (!isUpdatingFromProps.value) {
    handleUpdateData()
  }
}, {deep: true})

watch(() => props.data?.participants, () => {
  isUpdatingFromProps.value = true

  if (props.data && props.data.participants) {
    involvedPersonsData.value = props.data.participants || []
  } else {
    involvedPersonsData.value = []
  }

  tableRef.value?.setData(involvedPersonsData.value)

  nextTick(() => {
    isUpdatingFromProps.value = false
  })
})

const handleUpdateData = () => {
  let newData = {
    ...props.data,
    participants: involvedPersonsData.value
  } as WorkOrderObj
  emits('update:data', newData)
}

const columns: ColumnDef<WorkOrderParticipant>[] = [
  {
    accessorKey: "username",
    header: "ผู้ปฏิบัติงาน",
    size: 850,
    cell: ({row, getValue}) => {
      const person = row.original
      const value = getValue() as string

      return person.isUpdate
        ? h(InputSelect, {
          modelValue: findLabelOptions(value),
          options: workerOptions.value,
          placeholder: 'เลือกผู้ปฏิบัติงาน',
          key: `involved_person_${row.index}`,
          onUpdate: (newValue: Options) => {
            updateInvolvedPerson(row.index, 'username', newValue.value)
          },
          onOpen: async () => {
            workerOptions.value = await fetchWorkerListOptions("")
          },
          onChange: async (s: string) => {
            workerOptions.value = await fetchWorkerListOptions(s)
          }
        })
        : h('span', {class: 'involved-person-display'}, findLabelOptions(value) || "")
    }
  },
  {
    id: "actions",
    header: "",
    maxSize: 70,
    cell: ({row}) => {
      const person = row.original

      return h('div', {class: 'flex justify-center items-center space-x-2 gap-4 w-full'}, [
        person.isUpdate
          ? h('button', {
            class: 'involved-person-save-btn cursor-pointer',
            title: 'บันทึก',
            onClick: () => saveInvolvedPerson(row.index)
          }, h(Save, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
          : h('button', {
              class: 'involved-person-edit-btn cursor-pointer',
              title: 'แก้ไข',
              onClick: () => editInvolvedPerson(row.index)
            },
            h(Pencil, {size: 18, class: 'text-[#994C80] cursor-pointer'})),
        h('button', {
          class: 'involved-person-delete-btn cursor-pointer',
          title: 'ลบรายการ',
          onClick: () => removeInvolvedPerson(row.index)
        }, h(Trash2, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
      ])
    }
  }
]

const addInvolvedPerson = () => {
  const currentData = tableRef.value?.getData() || []

  const newPerson: WorkOrderParticipant = {
    username: '',
    isUpdate: true
  }

  involvedPersonsData.value = [...currentData, newPerson]
  tableRef.value?.setData(involvedPersonsData.value)

  setTimeout(() => {
    tableRef.value?.setLastPageIndex()
  }, 200)
}

const removeInvolvedPerson = (index: number) => {
  tableRef.value?.removeData(index)
  involvedPersonsData.value = tableRef.value?.getData() || []
}

const saveInvolvedPerson = (index: number) => {
  const currentData = tableRef.value?.getData() || []
  const person = currentData[index]

  if (person && person.username) {
    tableRef.value?.updateData(index, 'isUpdate', false)
    involvedPersonsData.value = tableRef.value?.getData() || []
  } else {
    alert('กรุณาเลือกผู้ปฏิบัติงาน')
  }
}

const editInvolvedPerson = (index: number) => {
  tableRef.value?.updateData(index, 'isUpdate', true)
  involvedPersonsData.value = tableRef.value?.getData() || []
}

const updateInvolvedPerson = (rowIndex: number, field: keyof WorkOrderParticipant, value: any) => {
  tableRef.value?.updateData(rowIndex, field, value)
  involvedPersonsData.value = tableRef.value?.getData() || []
}

const findLabelOptions = (value: string = "") => {
  return props.workerListOptions?.find((option: Options) => option.value === value)?.label || value
}

const clearAllData = () => {
  tableRef.value?.setData([])
  involvedPersonsData.value = []
}

defineExpose({
  getData: () => involvedPersonsData.value,
  setData: (data: WorkOrderParticipant[]) => {
    involvedPersonsData.value = data
    tableRef.value?.setData(data)
  },
  clearData: clearAllData
})
</script>

<template>
  <CardCollapse title="รายชื่อผู้เกี่ยวข้อง" icon="/assets/images/user.png">
    <div>
      <DataTableEditor
        ref="tableRef"
        :columns="columns"
      />

      <div class="flex justify-end gap-2 mt-2">
        <button
          class="rounded-md flex items-center cursor-pointer p-2 bg-[#9A3E7E] text-white hover:bg-[#8A3570] transition-colors"
          @click="clearAllData"
        >
          <q-icon name="delete_outline" size="sm"/>
          ลบทั้งหมด
        </button>

        <button
          class="rounded-md flex items-center cursor-pointer p-2 bg-[#69306D] text-white hover:bg-[#5a285d] transition-colors"
          @click="addInvolvedPerson"
        >
          <q-icon name="add" size="sm"/>
          เพิ่มรายการ
        </button>
      </div>
    </div>
  </CardCollapse>
</template>
