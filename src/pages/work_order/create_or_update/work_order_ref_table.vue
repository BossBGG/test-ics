<template>
  <DataTable
    ref="service_req_list_ref"
    :columns="columns"
    :table-api="getWorkOrderRefList"
    :table-api-data="memoizedApiData"
    :show-filter="false"
    :show-search="false"
  />
</template>
<script setup lang="ts">
import DataTable from "~/components/form/DataTable.vue";
import {ColumnDef} from "@tanstack/vue-table";
import {ServiceRequest} from "~/api/types";
import {getWorkOrderRefList, WORK_ORDER_STATUS_MAP} from "~/api/work_order_api";
import {Check, Plus} from "lucide-vue-next";

const props = defineProps<{
  modelValue: string | undefined,
  search: string,
  requestCodes: string[]
}>()

const emit = defineEmits<{
  (e: 'update:workOrderRef', value: ServiceRequest): void
}>()

const { search, requestCodes } = toRefs(props)

const memoizedApiData = computed(() => ({
  search: search.value,
  requestCodes: requestCodes.value.toString()
}))

const columns: ColumnDef<ServiceRequest>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({row}) => {
      let isSelected = props.modelValue === row.original.id
      return h("button", {
          class: `${isSelected ? 'bg-[#F9AC12] hover:bg-[#F9AC12]' : 'bg-[#A64682] hover:bg-[#A64682]'} text-white p-2 rounded-full flex align-center cursor-pointer`,
          onClick: () => {
            emit("update:workOrderRef", row.original)
          }
        },
        [
          h(isSelected ? Check : Plus, { size: 18 }),
          h("span", { class: "ml-1" }, "เลือก")
        ]
      )
    },
    maxSize: 80,
    enableSorting: false
  },
  {
    accessorKey: "workOrderNo",
    header: "เลขที่ใบสั่งงานหลัก",
    cell: ({row}) => {
      return h("div", { class: "truncate" }, row.getValue("workOrderNo"))
    },
    maxSize: 135,
  },
  {
    accessorKey: "customerRequestNo",
    header: "เลขที่คำร้อง",
    cell: ({row}) => {
      return h("div", { class: "truncate" },
        h("span", { title: row.getValue("customerRequestNo") }, row.getValue("customerRequestNo") || "-")
      )
    },
    maxSize: 120,
  },
  {
    accessorKey: "customerName",
    header: "ชื่อลูกค้า",
    cell: ({row}) => (
      h("div", { class: "truncate" },
        h("span", { title: row.getValue("customerName") }, row.getValue("customerName") || "-")
      )
    ),
    maxSize: 180
  },
  {
    accessorKey: "status",
    header: "สถานะใบสั่งงาน",
    cell: ({row}) => {
      return h("div",
        h("span", {title: row.getValue("status")}, WORK_ORDER_STATUS_MAP[row.getValue("status") as string] || "-")
      )
    },
    maxSize: 120
  },
  {
    accessorKey: "serviceName",
    header: "ประเภทงานบริการ",
    cell: ({row}) => {
      return h("div", { class: "truncate" },
        h("span", { title: row.getValue('serviceName')}, row.getValue('serviceName') )
      )
    },
    maxSize: 130
  },
  {
    accessorKey: "createdDate",
    header: "วันที่รับคำร้อง",
    cell: ({row}) => {
      return h("div", row.original.createdDate ? thaiFormatDate(new Date(row.original.createdDate.trim()), 'short') : "-")
    },
    maxSize: 100
  }
]
</script>
