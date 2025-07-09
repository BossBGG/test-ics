<template>
  <content-container
      :breadcrumbs="[{ text: 'จัดการและรายงาน (Y3)' },{text: 'จัดการประกาศ'}]"
      :last_update="'2025-06-19 10:00:00'"
  >

    <data-table
        :columns="columns"
        :data="data"
        :create-button="{label: 'test',route: '/news/create'}"
    >
      <template v-slot:createButton>
        <div class="flex justify-end mb-3">
          <RouterLink
              class="create-button"
              size="md"
              to="/news/create"
          >
            <Plus /> สร้างประกาศ
          </RouterLink>
        </div>
      </template>
    </data-table>
  </content-container>
</template>
<script setup lang="ts">
import type {ColumnDef, Header} from "@tanstack/vue-table";
import {h} from "vue";
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import { Plus } from 'lucide-vue-next'

export interface Payment {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com',
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com',
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com',
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com',
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com',
  },
]
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
            column: column,
            title: 'Status'
      })
    },
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('status')),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: 'Email'
      })
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
  },
]
</script>
