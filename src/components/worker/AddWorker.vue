<!-- src/components/worker/AddWorker.vue -->
<script setup lang="ts">
import {ref, h} from 'vue'
import {ColumnDef} from '@tanstack/vue-table'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import DataTableEditor from '@/components/form/DataTableEditor.vue'
import {Options, WorkOrderAssignee, WorkOrderObj} from "~/api/types"
import InputSelect from "~/components/ui/table-editor/InputSelect.vue";
import InputNumber from "~/components/ui/table-editor/InputNumber.vue";
import {getActivityTypes, getMainWorkCenters} from "~/api/options_api";
import FormDateTimePicker from "~/components/form/FormDateTimePicker.vue";
import {fetchWorkerListOptions} from "~/composables/worker_options";
import {Pencil, Save, Trash2} from "lucide-vue-next";

interface Props {
  data: WorkOrderObj,
  workerListOptions: Options[]
}
const props = defineProps<Props>()
const tableRef = ref<InstanceType<typeof DataTableEditor>>()
const workerData = ref<WorkOrderAssignee[]>(props.data?.assignees || [])
const eventOptions = ref<Options[]>([])
const mainWorkCenterOptions = ref<Options[]>([])
const workerOptions = ref<Options[]>(props.workerListOptions || [])
const groupWorkerOptions = [
  {label: "พนักงาน PEA", value: "peaUser"},
  {label: "Vendor", value: "vendorUser"},
]

const emits = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>()

watch(() => workerData.value, () => {
  emits('update:data', {
    ...props.data,
    assignees: workerData.value
  })
}, {deep: true})

onMounted(() => {
  Promise.all([
    fetchEventOptions(),
    fetchMainWorkCenterOptions()
  ]).then(([]) => {
    workerData.value = workerData.value?.map((d: WorkOrderAssignee) => {
      return {
        ...d,
        groupId: groupWorkerOptions.find((opt) => opt.value === d.userType)?.label || d.userType,
        name: props.workerListOptions.find((opt) => opt.value === d.username)?.label || d.username,
        workCenter: mainWorkCenterOptions.value.find((opt) => opt.value === d.workCenterId)?.label || d.workCenterId,
        activityName: eventOptions.value.find((opt) => opt.value === d.workActivityTypeId)?.label || d.workActivityTypeId,
      }
    })
    tableRef.value?.setData(workerData.value)
  })
})

const fetchEventOptions = async (search = "") => {
  const res = await getActivityTypes(search)
  if (res.status === 200 && res.data.data) {
    let options: Options[] = []
    res.data.data.map((d) => {
      options.push({ value: d.id.toString(), label: `${d.lstar} - ${d.ktext}`, data: d})
    })
    eventOptions.value = options
  }else {
    eventOptions.value = []
  }
}

const fetchMainWorkCenterOptions = async (search = "") => {
  const res = await getMainWorkCenters(search)
  if(res.status === 200 && res.data.data) {
    let options: Options[] = []
    res.data.data.map(d => {
      options.push({ value: d.code, label: d.code, data: d })
    })
    mainWorkCenterOptions.value = options
  }else {
    mainWorkCenterOptions.value = []
  }
}

// Add format function for datetime display
const formatDateTime = (datetime: string) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const columns: ColumnDef<WorkOrderAssignee>[] = [
  {
    accessorKey: "id",
    header: "ลำดับ",
    size: 80,
    cell: ({row}) => `${row.index + 1}.`
  },
  {
    accessorKey: "userType",
    header: "กลุ่มผู้ปฏิบัติงาน",
    minSize: 180,
    cell: ({row}) => {
      const worker = row.original

      return worker.isUpdate
        ? h(InputSelect, {
          modelValue: worker.groupId,
          options: groupWorkerOptions,
          placeholder: 'เลือกกลุ่มผู้ปฏิบัติงาน',
          key: `group_worker_${row.index}`,
          onUpdate: (newValue: Options) => {
            updateWorker(row.index, 'userType', newValue)
          }
        })
        : h('span', {class: 'worker-display'}, worker.groupId || worker.userType)
    }
  },
  {
    accessorKey: "username",
    header: "ผู้ปฏิบัติงาน",
    minSize: 180,
    cell: ({row, getValue}) => {
      const worker = row.original

      return worker.isUpdate
        ? h(InputSelect, {
          modelValue: worker.name,
          options: workerOptions.value,
          placeholder: 'เลือกผู้ปฏิบัติงาน',
          key: `worker_${row.index}`,
          onUpdate: (newValue: Options) => {
            updateWorker(row.index, 'username', newValue)
          },
          onOpen: async () => {
            workerOptions.value = await fetchWorkerListOptions("")
          },
          onChange: async (s: string) => {
            workerOptions.value = await fetchWorkerListOptions(s)
          }
        })
        : h('span', {class: 'worker-display'}, worker.name || 'ยังไม่ได้เลือก')
    }
  },
  {
    accessorKey: "workCenterId",
    header: "ศูนย์งานหลัก",
    minSize: 140,
    cell: ({row}) => {
      const worker = row.original

      return worker.isUpdate
        ? h(InputSelect, {
          modelValue: worker.workCenter,
          options: mainWorkCenterOptions.value,
          placeholder: 'ศูนย์งานหลัก',
          key: `cost_center_${row.index}`,
          onUpdate: (newValue: Options) => {
            updateWorker(row.index, 'workCenterId', newValue)
          },
          onOpen: () => {
            fetchMainWorkCenterOptions("")
          },
          onChange: (s: string) => {
            fetchMainWorkCenterOptions(s)
          }
        })
        : h('span', {class: 'worker-display'}, worker.workCenter || 'ยังไม่ได้กรอก')
    }
  },
  {
    accessorKey: "workActivityTypeId",
    header: "กิจกรรม",
    minSize: 180,
    cell: ({row}) => {
      const worker = row.original

      return worker.isUpdate
        ? h(InputSelect, {
          modelValue: worker.activityName,
          options: eventOptions.value,
          placeholder: 'เลือกกิจกรรม',
          key: `activity_${row.index}`,
          onUpdate: (newValue: Options) => {
            updateWorker(row.index, 'workActivityTypeId', newValue)
          },
          onOpen: () => {
            fetchEventOptions("")
          },
          onChange: (s: string) => {
            fetchEventOptions(s)
          }
        })
        : h('span', {class: 'worker-display'}, worker.activityName || 'ยังไม่ได้เลือก')
    }
  },
  {
    accessorKey: "workHours",
    header: "ชั่วโมง/งาน",
    size: 120,
    cell: ({row, getValue}) => {
      const worker = row.original
      const value = getValue() as number

      return worker.isUpdate
        ? h(InputNumber, {
          modelValue: value,
          placeholder: 'ชั่วโมง',
          key: `work-hours-${row.index}`,
          onUpdate: (newValue: number) => {
            updateWorker(row.index, 'workHours', newValue || 1)
          }
        })
        : h('span', {class: 'worker-quantity-text'}, value.toString())
    }
  },
  {
    accessorKey: "unit",
    header: "หน่วย",
    size: 120,
    cell: ({row}) => {
      return h('span', {class: 'worker-display'}, row.original.unit || row.original.workUnit || '')
    }
  },
  /*{
    accessorKey: "startDateTime",
    header: "วันที่และเวลาเริ่มต้น",
    minSize: 250,
    cell: ({row, getValue}) => {
      const worker = row.original
      const value = getValue() as string

      // 'onUpdate:modelValue': (newValue: string) => updateWorker(row.index, 'startDateTime', newValue)
      return worker.isUpdate
        ? h(FormDateTimePicker, {
          modelValue: value,
          type: 'datetime-local',
          outlined: true,
          class: 'worker-datetime-input',
          'onUpdate:modelValue': (newValue: string) => updateWorker(row.index, 'startDateTime', newValue)
        })
        : h('span', {class: 'worker-display text-sm'}, value ? formatDateTime(value) : 'ยังไม่ได้กำหนด')
    }
  },*/
  {
    id: "actions",
    header: "",
    size: 140,
    cell: ({row}) => {
      const worker = row.original

      return h('div', {class: 'flex justify-center items-center space-x-2 gap-4 w-[80px]'}, [
        worker.isUpdate
          ? h('button', {
            class: 'worker-save-btn',
            title: 'บันทึก',
            onClick: () => saveWorker(row.index)
          }, h(Save, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
          : h('button', {
            class: 'worker-edit-btn',
            title: 'แก้ไข',
            onClick: () => editWorker(row.index)
          }, h(Pencil, { size: 18, class: 'text-[#994C80] cursor-pointer' })),
        h('button', {
          class: 'worker-delete-btn',
          title: 'ลบรายการ',
          onClick: () => removeWorker(row.index)
        }, h(Trash2, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
      ])
    }
  }
]

const addWorker = () => {
  const currentData = tableRef.value?.getData() || []

  const newWorker = {
    isUpdate: true
  } as WorkOrderAssignee

  workerData.value = [...currentData, newWorker]
  tableRef.value?.setData(workerData.value)
  setTimeout(() => {
    tableRef.value?.setLastPageIndex()
  }, 200)
}

const removeWorker = (index: number) => {
  tableRef.value?.removeData(index)
  workerData.value = tableRef.value?.getData() || []
}

const saveWorker = (index: number) => {
  const currentData = tableRef.value?.getData() || []
  const worker: WorkOrderAssignee = currentData ? currentData[index] : null
  console.log('worker >>> ', worker)
  if (worker && worker.userType && worker.workCenterId && worker.username && worker.workActivityTypeId && worker.workHours > 0 && (worker.unit || worker.workUnit)/* && worker.startDateTime*/) {
    tableRef.value?.updateData(index, 'isUpdate', false)
    workerData.value = tableRef.value?.getData() || []
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const editWorker = (index: number) => {
  tableRef.value?.updateData(index, 'isUpdate', true)
  workerData.value = tableRef.value?.getData() || []
}

const updateWorker = (rowIndex: number, field: keyof WorkOrderAssignee, value: any) => {
  console.log('startDateTime >>> ', value)
  console.log('startDateTime new Date >>> ', new Date(value))
  switch (field) {
    case "userType":
      tableRef.value?.updateData(rowIndex, field, value.value)
      tableRef.value?.updateData(rowIndex, 'groupId', value.label)
      let unit = value.value === "peaUser" ? "H" : "Z05"
      tableRef.value?.updateData(rowIndex, 'unit', unit)
      break;
    case "username":
      tableRef.value?.updateData(rowIndex, field, value.value)
      tableRef.value?.updateData(rowIndex, 'name', value.label)
      break;
    case "workCenterId":
      tableRef.value?.updateData(rowIndex, field, value.value)
      tableRef.value?.updateData(rowIndex, "workCenter", value.label)
      break;
    case "workActivityTypeId":
      tableRef.value?.updateData(rowIndex, field, value.value)
      tableRef.value?.updateData(rowIndex, "activityName", value.label)
      break;
    default:
      tableRef.value?.updateData(rowIndex, field, value)
      break;
  }
  workerData.value = tableRef.value?.getData() || []
}

const clearAllData = () => {
  tableRef.value?.setData([])
}
</script>

<template>
  <CardCollapse title="รายชื่อผู้ปฎิบัติงาน" icon="/assets/images/user.png">
    <div>
      <DataTableEditor
        ref="tableRef"
        :columns="columns"
      />

      <!-- Bottom Action Buttons -->
      <div class="flex justify-end gap-2 mt-2">
        <button class="rounded-md flex items-center cursor-pointer p-2 bg-[#9A3E7E] text-white" @click="clearAllData">
          <q-icon name="delete_outline" size="sm"/>
          ลบทั้งหมด
        </button>

        <button class="rounded-md flex items-center cursor-pointer p-2 bg-[#69306D] text-white" @click="addWorker">
          <q-icon name="add" size="sm"/>
          เพิ่มรายการ
        </button>
      </div>
    </div>
  </CardCollapse>
</template>
