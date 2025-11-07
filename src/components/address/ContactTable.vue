<script setup lang="ts">
const requestStore = useRequestStore();
const { request, requests, requestForm } = storeToRefs(requestStore);
const columns = [
  {
    name: "index",
    required: true,
    label: "ลำดับ",
    align: "center",
    field: (row) => row.name,
    format: (val) => `${val}`,
    style: "width:10%",
  },
  {
    name: "date",
    align: "center",
    label: "วันที่ติดต่อ",
    field: "date",
    style: "width:20%",
  },
  {
    name: "detail",
    align: "center",
    label: "รายละเอียด",
    field: "detail",
    style: "width:70%",
  },
];

const rows = [
  {
    index: "1",
    date: "23/11/2556",
    detail: "ไม่มีคนรับสาย",
  },
  {
    index: "2",
    date: "23/11/2556",
    detail: "ปิดเครื่อง",
  },
  {
    index: "3",
    date: "23/11/2556",
    detail: "ไม่มีคนรับสาย",
  },
];
</script>

<template>
  <q-table
    flat
    :rows="rows"
    :columns="columns"
    row-key="index"
    hide-pagination
    :rows-per-page-options="[0]"
    class="table-costom"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="index" :props="props">
          <span class="table-label table-label-nocolor">
            {{ props.row.index }}
          </span>
        </q-td>
        <q-td key="date" :props="props">
          <span class="table-label">
            {{ props.row.date }}
          </span>
        </q-td>
        <q-td key="detail" :props="props">
          <span class="table-label">
            {{ props.row.detail }}
          </span>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
