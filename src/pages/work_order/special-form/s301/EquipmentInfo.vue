<!-- src/components/worker/EquipmentInfo.vue -->
<script setup lang="ts">
import { ref, h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import {Trash2, Save, Pencil} from 'lucide-vue-next'
import DataTableEditor from '~/components/form/DataTableEditor.vue'
import DataTableColumnHeader from '~/components/form/DataTableColumnHeader.vue'
import {Options, S301EquipmentServiceData, S301ServiceData, WorkOrderObj} from "~/api/types";
import QInputMaterial from "~/components/material_equipment_list/QInputMaterial.vue";
import {getMaterialGroupOptions} from "~/api/work_order_api";
import InputSelect from "~/components/ui/table-editor/InputSelect.vue";
import "~/styles/workorder-datatable.css";

const props = defineProps<{
  data: WorkOrderObj
}>()
const emit = defineEmits<{
  "update:data": [value: WorkOrderObj]
}>()
const equipmentData = ref<S301EquipmentServiceData[]>((props.data?.serviceSpecificData as S301ServiceData)?.equipments || [])
const equipmentEditorRef = ref()
const equipmentGroupOptions = ref<Options[]>([]);

onMounted(() => {
  Promise.all([
    fetchMaterialGroup("")
  ]).then(() => {
    handleMapServiceSpecData()
  })
})

watch(() => props.data.serviceSpecificData, () => {
  let serviceSpec = props.data?.serviceSpecificData as S301ServiceData
  if(equipmentData.value?.length === 0 && serviceSpec?.equipments?.length > 0) {
    handleMapServiceSpecData()
  }
}, {deep: true})

const handleMapServiceSpecData = () => {
  if(props.data?.serviceSpecificData) {
    console.log('serviceSpecificData <<<< ', props.data)
    equipmentData.value = (props.data?.serviceSpecificData as S301ServiceData)?.equipments || []
    equipmentData.value = equipmentData.value?.map((eq) => {
      return {
        ...eq,
        equipmentName: findLabelOptions(equipmentGroupOptions.value, eq.equipmentTypeId),
        isUpdate: true
      }
    })
    equipmentEditorRef.value?.setData(equipmentData.value)
  }else {
    equipmentEditorRef.value?.setData([])
  }
}

watch(() => equipmentData.value, () => {
  handleUpdateData()
}, { deep: true})

const handleUpdateData = () => {
  let newData = {
    ...props.data,
    serviceSpecificData: {
      ...props.data?.serviceSpecificData,
      equipments: equipmentData.value
    }
  } as WorkOrderObj

  emit("update:data", newData)
}

const addEquipment = () => {
  const newEquipment = {
    amount: 1,
    isUpdate: true
  } as S301EquipmentServiceData
  equipmentData.value = [...equipmentData.value, newEquipment]
  equipmentEditorRef.value?.setData(equipmentData.value)
  setTimeout(() => {
    equipmentEditorRef.value.setLastPageIndex();
  }, 200)
}

const removeEquipment = (index: number) => {
  equipmentEditorRef.value?.removeData(index)
  equipmentData.value = equipmentEditorRef.value?.getData() || []
}

const saveEquipment = (index: number) => {
  const equipment = equipmentData.value[index]
  if (equipment && equipment.equipmentTypeId && equipment.amount > 0) {
    equipmentEditorRef.value?.updateData(index, "isUpdate", false)
    equipmentData.value = equipmentEditorRef.value?.getData() || []
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const editEquipment = (index: number) => {
  equipmentEditorRef.value?.updateData(index, "isUpdate", true)
  equipmentData.value = equipmentEditorRef.value?.getData() || []
}

const updateEquipment = (index: number, field: keyof S301EquipmentServiceData, opt: Options) => {
  console.log('opt >>> ', opt)
  equipmentEditorRef.value?.updateData(index, field, opt.value)
  equipmentEditorRef.value?.updateData(index, "equipmentName", opt.label)
  equipmentData.value = equipmentEditorRef.value?.getData() || []
}

const clearAllData = () => {
  equipmentData.value = []
  equipmentEditorRef.value?.setData([])
}

const findLabelOptions = (options: Options[], value: string) => {
  return options.find((opt) => opt.value === value)?.label || ""
}

const fetchMaterialGroup = async (search: string) => {
  try {
    let options: Options[] = []
    const res = await getMaterialGroupOptions(search)
    if(res.status === 200 && res.data.data) {
      res.data.data.map((d) => {
        options.push({ value: d.uuid, label: d.name, data: d })
      })
    }
    equipmentGroupOptions.value = options || [];
  }catch (err) {
    console.error(err)
    equipmentGroupOptions.value = []
  }
}

const columns: ColumnDef<S301EquipmentServiceData>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ลำดับ' }),
    cell: ({ row }) => h('div', { class: 'text-center' }, `${row.index + 1}.`),
    maxSize: 40
  },
  {
    accessorKey: 'equipmentTypeId',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'ประเภทอุปกรณ์ไฟฟ้า' }),
    cell: ({ row }) => {
      const equipment = row.original

      if (equipment.isUpdate) {
        return h(InputSelect, {
          modelValue: equipment.equipmentName,
          options: equipmentGroupOptions.value,
          placeholder: 'ประเภทอุปกรณ์ไฟฟ้า',
          key: `${row.index}_material_group`,
          onUpdate: (value: Options) => {
            updateEquipment(row.index, 'equipmentTypeId', value)
          },
          onChange: (s: string) => {
            fetchMaterialGroup(s)
          },
          onOpen: () => {
            fetchMaterialGroup("")
          }
        })
      }
      return h('span', equipment.equipmentName || "")
    },
    maxSize: 200
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'จำนวน' }),
    cell: ({ row }) => {
      const equipment = row.original

      if (equipment.isUpdate) {
        return h(QInputMaterial, {
          modelValue: equipment.amount,
          placeholder: 'จำนวน',
          key: `${row.index}_quantity`,
          onUpdate: (v: string) => {
            equipmentEditorRef.value?.updateData(row.index, "amount", parseInt(v) || 0)
            equipmentData.value = equipmentEditorRef.value?.getData() || []
          }
        })
      }
      return h('div', { class: 'text-center' }, equipment.amount.toString())
    },
    maxSize: 30
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const equipment = row.original
      const index = row.index

      const buttons = []

      if (equipment.isUpdate) {
        buttons.push(
          h('button', {
            class: 'p-2 hover:bg-gray-100 rounded',
            title: 'บันทึก',
            onClick: () => saveEquipment(index)
          }, h(Save, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
        )
      } else {
        buttons.push(
          h('button', {
            class: 'p-2 hover:bg-gray-100 rounded',
            title: 'แก้ไข',
            onClick: () => editEquipment(index)
          }, h(Pencil, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
        )
      }

      buttons.push(
        h('button', {
          class: 'p-2 hover:bg-gray-100 rounded',
          title: 'ลบรายการ',
          onClick: () => removeEquipment(index)
        }, h(Trash2, { size: 18, class: 'text-[#994C80] cursor-pointer' }))
      )

      return h('div', { class: 'flex gap-2 justify-center cursor-pointer' }, buttons)
    },
    maxSize: 20
  }
]
</script>

<template>
  <div>
    <div class="pb-4">ประเภทอุปกรณ์ไฟฟ้า</div>

    <DataTableEditor
      ref="equipmentEditorRef"
      :columns="columns"
    />

      <!-- Bottom Action Buttons -->
      <div class="flex justify-end gap-3 mt-2">
        <button class="rounded-md flex items-center cursor-pointer p-2 bg-[#69306D] text-white" @click="clearAllData">
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

