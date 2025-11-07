<!-- src/components/work_order/MeterElectricalEquipment.vue -->
<script setup lang="ts">
import {ref, h} from "vue";
import {ColumnDef} from '@tanstack/vue-table'
import DataTableEditor from '@/components/form/DataTableEditor.vue'
import InputSelect from '@/components/ui/table-editor/InputSelect.vue'
import {Options, S318EquipmentServiceData, S318ServiceData, WorkOrderObj} from "~/api/types";
import {getMeterEquipmentOptions} from "~/api/work_order_api";
import InputNumber from "~/components/ui/table-editor/InputNumber.vue";
import {Pencil, Save, Trash2} from "lucide-vue-next";

const props = defineProps<{
  data: WorkOrderObj
}>()
const emit = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>()
const tableRef = ref<InstanceType<typeof DataTableEditor>>()
const electricalEquipment = ref<S318EquipmentServiceData[]>([]);
const equipmentTypeOptions = ref<Options[]>([])

onMounted(async () => {
  await fetchEquipmentOptions()
  await handleMapEquipment()
})

watch(() => props.data?.serviceSpecificData, () => {
  let serviceSpec = props.data?.serviceSpecificData as S318ServiceData
  if(electricalEquipment.value.length === 0 && serviceSpec?.equipments?.length > 0) {
    handleMapEquipment()
  }
}, { deep: true })

const handleMapEquipment = () => {
  let serviceSpec = props.data?.serviceSpecificData as S318ServiceData
  if(serviceSpec?.equipments) {
    electricalEquipment.value = serviceSpec.equipments.map((eq) => {
      return {
        ...eq,
        equipment: equipmentTypeOptions.value.find((opt) => opt.value == eq.equipmentId)?.label || eq.equipmentId,
        isUpdate: true
      }
    })
    tableRef.value?.setData(electricalEquipment.value)
  }else {
    tableRef.value?.setData([])
  }
}

watch(() => electricalEquipment.value, () => {
  let serviceSpec = props.data?.serviceSpecificData as S318ServiceData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      equipments: electricalEquipment.value
    }
  }

  emit("update:data", newData)
}, {deep: true})

const fetchEquipmentOptions = async (search: string = "") => {
  const res = await getMeterEquipmentOptions(search, "s318")
  if (res.status === 200 && res.data.data) {
    let options: Options[] = []
    res.data.data.map((d) => {
      options.push({ value: d.id, label: d.optionTitle, data: d})
    })
    equipmentTypeOptions.value = options
  }else {
    equipmentTypeOptions.value = []
  }
}

const columns: ColumnDef<S318EquipmentServiceData>[] = [
  {
    accessorKey: "id",
    header: "ลำดับ",
    maxSize: 5,
    cell: ({row}) => row.index + 1
  },
  {
    accessorKey: "equipment",
    header: "มิเตอร์/อุปกรณ์ไฟฟ้า",
    cell: ({row, getValue}) => {
      const equipment = row.original
      const value = getValue() as string

      return equipment.isUpdate
        ? h(InputSelect, {
          modelValue: value,
          options: equipmentTypeOptions.value,
          placeholder: 'เลือกมิเตอร์/อุปกรณ์ไฟฟ้า',
          key: `equipment_${row.index}`,
          onUpdate: (selection: Options) => {
            updateEquipment(row.index, 'equipment', selection)
          },
          onOpen: () => {
            fetchEquipmentOptions("")
          },
          onChange: (s: string) => {
            fetchEquipmentOptions(s)
          }
        })
        : h('span', {class: 'equipment-display'}, value || 'ยังไม่ได้เลือก')
    }
  },
  {
    accessorKey: "capacity",
    header: "ขนาด",
    cell: ({row, getValue}) => {
      const equipment = row.original
      const value = getValue() as number

      return equipment.isUpdate
        ? h(InputNumber, {
          modelValue: value,
          placeholder: 'ระบุขนาด',
          key: `capacity_${row.index}`,
          onUpdate: (newValue: string) => {
            updateEquipment(row.index, 'capacity', parseInt(newValue) || 0)
          }
        })
        : h('span', {class: 'equipment-display'}, value || 'ยังไม่ได้กรอก')
    }
  },
  {
    accessorKey: "amount",
    header: "จำนวน",
    cell: ({row, getValue}) => {
      const equipment = row.original
      const value = getValue() as number

      return equipment.isUpdate
        ? h(InputNumber, {
          modelValue: value,
          placeholder: 'ระบุจำนวน',
          key: `amount_${row.index}`,
          onUpdate: (newValue: string) => {
            updateEquipment(row.index, 'amount', parseInt(newValue) || 0)
          }
        })
        : h('span', {class: 'equipment-display'}, value || 'ยังไม่ได้กรอก')
    }
  },
  {
    id: "actions",
    header: "",
    maxSize: 40,
    cell: ({row}) => {
      const equipment = row.original

      return h('div', {class: 'flex items-center'}, [
        equipment.isUpdate
          ? h('button', {
            class: 'action-btn save-table-btn',
            title: 'บันทึก',
            onClick: () => saveEquipment(row.index)
          }, h(Save, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
          : h('button', {
            class: 'action-btn edit-table-btn',
            title: 'แก้ไข',
            onClick: () => editEquipment(row.index)
          },h(Pencil, { size: 18, class: 'text-[#994C80] cursor-pointer' })),
        h('button', {
          class: 'action-btn delete-table-btn',
          title: 'ลบรายการ',
          onClick: () => removeEquipment(row.index)
        }, h(Trash2, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
      ])
    }
  }
]

const addEquipment = () => {
  const currentData = tableRef.value?.getData() || []
  const newEquipment = {
    isUpdate: true
  } as S318EquipmentServiceData

  electricalEquipment.value = [...currentData, newEquipment]
  tableRef.value?.setData(electricalEquipment.value)
  setTimeout(() => {
    tableRef.value?.setLastPageIndex()
  }, 200)
};

const removeEquipment = (index: number) => {
  tableRef.value?.removeData(index)
  electricalEquipment.value = tableRef.value?.getData() || []
};

const saveEquipment = (index: number) => {
  const currentData = tableRef.value?.getData() || []
  const equipment = currentData ? currentData[index] : null

  if (equipment && equipment.equipment && equipment.capacity && equipment.amount) {
    tableRef.value?.updateData(index, 'isUpdate', false)
    electricalEquipment.value = tableRef.value?.getData() || []
  } else {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน")
  }
};

const editEquipment = (index: number) => {
  tableRef.value?.updateData(index, 'isUpdate', true)
  electricalEquipment.value = tableRef.value?.getData() || []
};

const updateEquipment = (rowIndex: number, field: keyof S318EquipmentServiceData, value: Options | number) => {
  if(field === 'equipment') {
    let item = value as Options
    tableRef.value?.updateData(rowIndex, "equipmentId", item.value)
    tableRef.value?.updateData(rowIndex, field, item.label)
  }else {
    tableRef.value?.updateData(rowIndex, field, value)
  }
  electricalEquipment.value = tableRef.value?.getData() || []
};

const clearAllData = () => {
  tableRef.value?.setData([])
};
</script>

<template>
  <div class="pb-4">มิเตอร์/อุปกรณ์ไฟฟ้า</div>

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

      <button class="rounded-md flex items-center cursor-pointer p-2 bg-[#69306D] text-white" @click="addEquipment">
        <q-icon name="add" size="sm"/>
        เพิ่มรายการ
      </button>
    </div>
  </div>
</template>
