<!-- src/components/worker/EquipmentInfo.vue -->
<script setup lang="ts">
import {ref, h} from 'vue'
import {ColumnDef} from '@tanstack/vue-table'
import DataTableEditor from '@/components/form/DataTableEditor.vue'
import InputText from "~/components/ui/table-editor/InputText.vue";
import {
  S314CableServiceData,
  S314ServiceData,
  WorkOrderObj
} from "~/api/types";
import InputNumber from "~/components/ui/table-editor/InputNumber.vue";
import {Pencil, Save, Trash2} from "lucide-vue-next";

const props = defineProps<{
  data: WorkOrderObj
}>()
const tableRef = ref<InstanceType<typeof DataTableEditor>>()
const insulatorData = ref<S314CableServiceData[]>([])
const emit = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>()

onMounted(() => {
  handleMapCableInsulator()
})

watch(() => props.data?.serviceSpecificData, () => {
  let serviceSpec = props.data?.serviceSpecificData as S314ServiceData
  if(serviceSpec.cableInsulators?.length > 0 && insulatorData.value?.length === 0) {
    handleMapCableInsulator()
  }
}, {deep: true})

const handleMapCableInsulator = () => {
  let serviceSpec = props.data?.serviceSpecificData as S314ServiceData
  insulatorData.value = serviceSpec?.cableInsulators || []
  tableRef.value?.setData(serviceSpec?.cableInsulators || [])
}

const columns: ColumnDef<S314CableServiceData>[] = [
  {
    accessorKey: "id",
    header: "ลำดับ",
    maxSize: 5,
    cell: ({row}) => `${row.index + 1}.`
  },
  {
    accessorKey: "cableInsulator",
    header: "ฉนวนครอบสายไฟฟ้า",
    cell: ({row, getValue}) => {
      const equipment = row.original
      const value = getValue() as string

      return equipment.isUpdate
        ? h(InputText, {
          modelValue: value,
          placeholder: 'ฉนวนครอบสายไฟฟ้า',
          key: `cable_insulator_${row.index}`,
          onUpdate: (newValue: string) => updateInsulator(row.index, 'cableInsulator', newValue)
        })
        : h('span', {class: 'equipment-display'}, value || 'ยังไม่ได้เลือก')
    }
  },
  {
    accessorKey: "amount",
    header: "จำนวน",
    size: 120,
    cell: ({row, getValue}) => {
      const equipment = row.original
      const value = getValue() as number

      return equipment.isUpdate
        ? h(InputNumber, {
          modelValue: value,
          key: `amount_${row.index}`,
          onUpdate: (newValue: number) => updateInsulator(row.index, 'amount', newValue || 1)
        })
        : h('span', {class: 'quantity-text'}, value.toString())
    }
  },
  {
    id: "actions",
    header: "",
    maxSize: 5,
    cell: ({row}) => {
      const equipment = row.original

      return h('div', {class: 'action-buttons'}, [
        equipment.isUpdate
          ? h('button', {
            class: 'action-btn save-table-btn',
            title: 'บันทึก',
            onClick: () => saveInsulator(row.index)
          }, h(Save, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
          : h('button', {
            class: 'action-btn edit-table-btn',
            title: 'แก้ไข',
            onClick: () => editInsulator(row.index)
          }, h(Pencil, { size: 18, class: 'text-[#994C80] cursor-pointer' })),
        h('button', {
          class: 'action-btn delete-table-btn',
          title: 'ลบรายการ',
          onClick: () => removeInsulator(row.index)
        }, h(Trash2, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
      ])
    }
  }
]

const addInsulator = () => {
  const currentData = tableRef.value?.getData() || []

  const newEquipment = {
    isUpdate: true
  } as S314CableServiceData

  insulatorData.value = [...currentData, newEquipment]
  tableRef.value?.setData(insulatorData.value)
  tableRef.value?.setLastPageIndex()
}

const removeInsulator = (index: number) => {
  tableRef.value?.removeData(index)
  insulatorData.value = tableRef.value?.getData() || []
}

const saveInsulator = (index: number) => {
  const currentData = tableRef.value?.getData() || []
  const insulator: S314CableServiceData = currentData ? currentData[index] : null

  if (insulator && insulator.cableInsulator && insulator.amount > 0) {
    tableRef.value?.updateData(index, 'isUpdate', false)
    insulatorData.value = tableRef.value?.getData() || []
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const editInsulator = (index: number) => {
  tableRef.value?.updateData(index, "isUpdate", true);
  insulatorData.value = tableRef.value?.getData() || [];
}

const updateInsulator = (rowIndex: number, field: keyof S314CableServiceData, value: any) => {
  tableRef.value?.updateData(rowIndex, field, value)
  insulatorData.value = tableRef.value?.getData() || []
}

watch(() => insulatorData.value, (newVal) => {
  let serviceSpec = props.data?.serviceSpecificData as S314ServiceData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      cableInsulators: newVal
    }
  } as WorkOrderObj

  emit('update:data', newData)
}, {deep: true})

const clearAllData = () => {
  tableRef.value?.setData([])
  insulatorData.value = []
}
</script>

<template>
  <div>
    <div class="pb-4">ฉนวนครอบสายไฟฟ้า</div>

    <DataTableEditor
      ref="tableRef"
      :columns="columns"
    />

    <!-- Bottom Action Buttons -->
    <div class="equipment-actions">
      <button class="action-btn-bottom clear-btn" @click="clearAllData">
        <img src="/assets/images/delete-icon.png" alt="" class="icon">
        ลบทั้งหมด
      </button>

      <button class="action-btn-bottom add-btn-bottom" @click="addInsulator">
        <img src="/assets/images/add-icon.png" alt="" class="w-6 h-6">
        เพิ่มรายการ
      </button>
    </div>
  </div>

</template>

