<!-- src/components/material_equipment_list/ResponsiblePersonComponent.vue -->
<script setup lang="ts">
import {ref, h, onMounted} from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import DataTableEditor from '~/components/form/DataTableEditor.vue'
import type {ColumnDef} from '@tanstack/vue-table'
import InputSelect from "~/components/ui/table-editor/InputSelect.vue";
import {Options, ResponsiblePersonObj, WorkOrderAssignee, WorkOrderObj} from "~/api/types";

interface Props {
  options?: {
    isReadOnly?: boolean
    showAddButton?: boolean
    showDeleteAllButton?: boolean
    showActionColumn?: boolean
  }
  data: WorkOrderObj,
  workerListOptions: Options[]
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    isReadOnly: false,
    showAddButton: true,
    showDeleteAllButton: true,
    showActionColumn: true,
  }),
  modelValue: () => [],
})

const emit = defineEmits<{
  'update:data': [value: WorkOrderObj]
}>()

// Reactive data
const responsiblePersonData = ref<WorkOrderAssignee[]>([{isUpdate: true} as WorkOrderAssignee])
const tableRef = ref<InstanceType<typeof DataTableEditor>>()
const responsiblePersonOptions = ref<Options[]>([])
// Computed properties
const {isReadOnly, showAddButton, showDeleteAllButton, showActionColumn} = props.options

onMounted(() => {
  if (props.data?.assignees?.length > 0) {
    let options: Options[] = []
    props.data.assignees.map((assignee: WorkOrderAssignee) => {
      options.push({
        label: assignee.name,
        value: assignee.username
      })
      responsiblePersonOptions.value = options

      if (assignee.isEquipmentResponsible) {
        let opt = props.workerListOptions.find((opt: Options) => opt.value == assignee.username)
        responsiblePersonData.value = [{
          ...assignee,
          name: opt?.label || assignee.username,
          isUpdate: !isReadOnly
        }]
      }

      setTimeout(() => {
        initializeTable()
      }, 200)
    })
  }else {
    responsiblePersonOptions.value = []
    initializeTable()
  }
})

// Define columns using hyperscript
const columns: ColumnDef<WorkOrderAssignee>[] = [
  {
    accessorKey: 'id',
    header: 'ลำดับ',
    maxSize: 15,
    cell: ({row}) => h('div', {class: 'text-center font-semibold'}, `${row.index + 1}.`)
  },
  {
    accessorKey: 'username',
    header: 'พนักงานรับผิดชอบเบิก/คืนวัสดุอุปกรณ์',
    cell: ({row}) => {
      const person = row.original
      if (person.isUpdate && !isReadOnly) {
        return h(InputSelect, {
          modelValue: person.name,
          options: responsiblePersonOptions.value,
          placeholder: 'เลือกพนักงาน',
          key: `username_${row.index}`,
          onUpdate: (selection: Options) => {
            tableRef.value?.updateData(row.index, 'name', selection.label || "")
            let assignees = props.data.assignees;
            assignees.map((assignee: WorkOrderAssignee) => {
              assignee.isEquipmentResponsible = assignee.username === selection.value
            })
            responsiblePersonData.value = assignees

            emit('update:data', {...props.data, assignees: assignees})
          }
        })
      }
      return h('span', {class: 'responsible-display'}, person.name || "-")
    }
  }
]

// Initialize table data
const initializeTable = () => {
  if (tableRef.value) {
    tableRef.value.setData(responsiblePersonData.value)
  }
}

</script>

<template>
  <CardCollapse title="ผู้รับผิดชอบเบิก/คืนวัสดุอุปกรณ์">
    <DataTableEditor
      ref="tableRef"
      :columns="columns"
      :show-pagination="false"
    />
  </CardCollapse>
</template>
