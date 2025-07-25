<!-- src/pages/news/list.vue -->
<template>
  <content-container
    :breadcrumbs="[{ text: 'จัดการและรายงาน (Y3)' }, { text: 'จัดการประกาศ' }]"
    :last_update="'2025-06-19 10:00:00'"
  >
    <data-table 
      :columns="columns" 
      :data="filteredData"
      @show-filter="handleShowFilter"
    >
      <template v-slot:createButton>
        <div class="flex justify-end mb-3">
          <RouterLink class="create-button" to="/news/create">
            <Plus class="w-4 h-4" /> สร้างประกาศ
          </RouterLink>
        </div>
      </template>
    </data-table>

    <!-- Filter Dialog -->
    <FilterDialog
      v-model="showFilterDialog"
      @apply-filters="handleApplyFilters"
    />
  </content-container>
</template>

<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { h, ref, computed } from "vue";
import { Edit, Trash2, Plus, Filter } from "lucide-vue-next";
import DataTable from "@/components/form/DataTable.vue";
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import FilterDialog from "~/components/dialog/FilterDialog.vue";
import NewsStatusBadge from "~/components/news/NewsStatusBadge.vue";
import { mockNewsData, type NewsData } from "~/data/newsData";
import { Switch } from "~/components/ui/switch";

const showFilterDialog = ref(false);
const currentFilters = ref({
  startDate: "",
  endDate: "",
  status: "",
});

// Remove pagination logic - ใช้ pagination เดิมใน DataTable
const filteredData = computed(() => {
  let data = [...mockNewsData];

  if (currentFilters.value.status) {
    data = data.filter((item) => item.status === currentFilters.value.status);
  }

  // Add date filtering logic here if needed

  return data;
});

const handleApplyFilters = (filters: any) => {
  currentFilters.value = { ...filters };
};

const handleShowFilter = () => {
  showFilterDialog.value = true;
};

const handleEdit = (id: number) => {
  // Navigate to edit page
  console.log("Edit news:", id);
};

const handleDelete = (id: number) => {
  // Show delete confirmation
  console.log("Delete news:", id);
};

const columns: ColumnDef<NewsData>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "ลำดับ",
      });
    },
    cell: ({ row }) => h("div", { class: "text-center" }, row.getValue("id")),
    enableSorting: true,
  },
  {
    accessorKey: "image",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "ภาพปก",
      });
    },
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string;
      return h("div", { class: "flex justify-center" }, [
        imageUrl
          ? h("img", {
              src: imageUrl,
              alt: "ภาพปก",
              class: "w-12 h-8 object-cover rounded",
              onError: (e) => {
                
                e.target.style.display = "none";
                e.target.parentNode.innerHTML = `
             <div class="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
               <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
               </svg>
             </div>
           `;
              },
            })
          : h(
              "div",
              {
                class:
                  "w-12 h-8 bg-gray-200 rounded flex items-center justify-center",
              },
              [
                h(
                  "svg",
                  {
                    class: "w-6 h-6 text-gray-400",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                  },
                  [
                    h("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z",
                    }),
                  ]
                ),
              ]
            ),
      ]);
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "หัวข้อ",
      });
    },
    cell: ({ row }) =>
      h("div", { class: "font-medium" }, row.getValue("title")),
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "รายละเอียด",
      });
    },
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return h("div", { class: "max-w-xs truncate" }, description);
    },
    enableSorting: false,
  },
  {
    accessorKey: "publish_date",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "วันที่เผยแพร่",
      });
    },
    cell: ({ row }) =>
      h("div", { class: "text-sm" }, row.getValue("publish_date")),
    enableSorting: true,
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "ปิด/เปิด",
      });
    },
    cell: ({ row }) => {
      return h("div", { class: "flex justify-center" }, [
        h(Switch, {
          // modelValue: row.getValue('is_active'),
          "onUpdate:modelValue": (value) => {},
        }),
      ]);
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "สถานะ",
      });
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return h("div", { class: "flex justify-center" }, [
        h(NewsStatusBadge, { status }),
      ]);
    },
    enableSorting: true,
  },
  {
    accessorKey: "created_date",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "วันที่สร้าง",
      });
    },
    cell: ({ row }) =>
      h("div", { class: "text-sm" }, row.getValue("created_date")),
    enableSorting: true,
  },
  {
    accessorKey: "created_by",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "ผู้สร้างประกาศ",
      });
    },
    cell: ({ row }) =>
      h("div", { class: "text-sm" }, row.getValue("created_by")),
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => h("div", { class: "text-center w-full" }, ""),
    cell: ({ row }) => {
      const newsId = row.getValue("id") as number;
      return h(
        "div",
        {
          class:
            "flex flex-row items-center justify-center space-x-1 min-w-[80px]",
        },
        [
          h(
            "button",
            {
              class: "p-1 hover:opacity-80 transition-opacity",
              onClick: () => handleEdit(newsId),
              title: "แก้ไข",
            },
            [
              h("img", {
                src: "/assets/images/edit-button.png",
                alt: "แก้ไข",
                class: "w-8 h-8",
              }),
            ]
          ),
          h(
            "button",
            {
              class: "p-1 hover:opacity-80 transition-opacity",
              onClick: () => handleDelete(newsId),
              title: "ลบ",
            },
            [
              h("img", {
                src: "/assets/images/delete-button.png",
                alt: "ลบ",
                class: "w-8 h-8",
              }),
            ]
          ),
        ]
      );
    },
    enableSorting: false,
  },
];
</script>

<style scoped>
.create-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #69306d;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  gap: 8px;
}

.create-button:hover {
  opacity: 0.9;
  color: #ffffff;
  text-decoration: none;
}

.create-button:active {
  background-color: #5c0f88;
}
</style>