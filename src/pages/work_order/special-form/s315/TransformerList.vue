<!-- src/components/worker/EquipmentInfo.vue -->
<script setup lang="ts">
import {ref, h} from 'vue'
import {ColumnDef} from '@tanstack/vue-table'
import DataTableEditor from '@/components/form/DataTableEditor.vue'
import InputText from '@/components/form/InputText.vue'
import {
  S315ServiceData,
  S315TransformerServiceData,
  WorkOrderObj
} from "~/api/types";
import InputNumber from "~/components/ui/table-editor/InputNumber.vue";
import {Pencil, Save, Trash2} from "lucide-vue-next";

const props = defineProps<{
  data: WorkOrderObj
}>()

const emit = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>()

const tableRef = ref<InstanceType<typeof DataTableEditor>>()
const transformerList = ref<S315TransformerServiceData[]>([])

onMounted(() => {
  handleMapTransformerData()
})

watch(() => props.data?.serviceSpecificData, () => {
  handleMapTransformerData()
}, {deep: true})

const handleMapTransformerData = () => {
  let serviceSpec = props.data?.serviceSpecificData as S315ServiceData
  if(serviceSpec) {
    transformerList.value = serviceSpec.transformers || []
    tableRef.value?.setData(serviceSpec.transformers || [])
  }else {
    tableRef.value?.setData([])
  }
}

const columns: ColumnDef<S315TransformerServiceData>[] = [
  {
    accessorKey: "id",
    header: "ลำดับ",
    maxSize: 5,
    cell: ({row}) => `${row.index + 1}.`
  },
  {
    accessorKey: "transformerCapacity",
    header: "หม้อแปลง",
    cell: ({row, getValue}) => {
      const equipment = row.original
      const value = getValue() as string

      return equipment.isUpdate
        ? h(InputText, {
          initialValue: value,
          placeholder: 'ขนาดหม้อแปลง',
          'onUpdate:modelValue': (newValue: string) => updateTransformer(row.index, 'transformerCapacity', newValue)
        })
        : h('span', {class: 'equipment-display'}, value || 'ยังไม่ได้กรอก')
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
          placeholder: 'จำนวน',
          onUpdate: (newValue: string) => {
            updateTransformer(row.index, 'amount', parseInt(newValue) || 1)
          }
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
            onClick: () => saveTransformer(row.index)
          }, h(Save, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
          : h('button', {
            class: 'action-btn edit-table-btn',
            title: 'แก้ไข',
            onClick: () => editTransformer(row.index)
          }, h(Pencil, { size: 18, class: 'text-[#994C80] cursor-pointer' })),
        h('button', {
          class: 'action-btn delete-table-btn',
          title: 'ลบรายการ',
          onClick: () => removeTransformer(row.index)
        }, h(Trash2, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
      ])
    }
  }
]

watch(() => transformerList.value, (newValue) => {
  let serviceSpec = props.data?.serviceSpecificData as S315ServiceData
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...serviceSpec,
      transformers: newValue
    }
  } as WorkOrderObj

  emit("update:data", newData)
}, { deep: true })

const addTransformer = () => {
  const currentData = tableRef.value?.getData() || []

  const newEquipment = {
    isUpdate: true
  } as S315TransformerServiceData

  tableRef.value?.setData([...currentData, newEquipment])
  setTimeout(() => {
    tableRef.value?.setLastPageIndex()
  }, 200)
}

const removeTransformer = (index: number) => {
  tableRef.value?.removeData(index)
  transformerList.value = tableRef.value?.getData() || []
}

const saveTransformer = (index: number) => {
  const currentData = tableRef.value?.getData() || []
  const transformer: S315TransformerServiceData = currentData ? currentData[index] : null

  if (transformer && transformer.transformerCapacity && transformer.amount > 0) {
    tableRef.value?.updateData(index, 'isUpdate', false)
    transformerList.value= tableRef.value?.getData() || []
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const editTransformer = (index: number) => {
  tableRef.value?.updateData(index, "isUpdate", true);
  transformerList.value = tableRef.value?.getData() || []
}

const updateTransformer = (rowIndex: number, field: keyof S315TransformerServiceData, value: any) => {
  tableRef.value?.updateData(rowIndex, field, value)
  transformerList.value = tableRef.value?.getData() || []
}

const clearAllData = () => {
  tableRef.value?.setData([])
}
</script>

<template>
  <div>
    <div class="pb-4">หม้อแปลง</div>

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

      <button class="action-btn-bottom add-btn-bottom" @click="addTransformer">
        <img src="/assets/images/add-icon.png" alt="" class="w-6 h-6">
        เพิ่มรายการ
      </button>
    </div>
  </div>

</template>

