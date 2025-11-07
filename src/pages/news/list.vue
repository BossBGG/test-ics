<!-- src/pages/news/list.vue -->
<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { h, ref } from "vue";
import { Plus } from "lucide-vue-next";
import DataTable from "@/components/form/DataTable.vue";
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import NewsStatusBadge from "~/components/news/NewsStatusBadge.vue";
import {dateFormatBy, dateFormatMonth, getCurrentDateTimeYmd, toTimestamp} from "~/composables/datetime";
import {deleteAnnouncement, getAnnouncementsList, updateAnnouncementStatus} from "~/api/news_api";
import {mapPublishRange, NewsData, NewsDataFilter} from "~/data/newsData";
import {useRouter} from "vue-router";
import {dismissPopup, showConfirm, showError, showProgress, showSuccess} from "~/composables/alert";
import {Toggle} from "~/components/ui/toggle";

const showFilterDialog = ref(false);
const filters = ref<NewsDataFilter>({
  from: "",
  to: "",
  status: "",
});
const router = useRouter()
const news_table_ref = ref()
const update_latest_at = ref<string>(getCurrentDateTimeYmd())

function handleShowFilter() {
  showFilterDialog.value = true;
}

const handleFilterApply = (filter: any) => {
  filters.value = filter
  if(filters.value.from) {
    filters.value.from = dateFormatBy(toTimestamp(filters.value.from), 'YYYY-MM-DD');
  }
  if(filters.value.to) {
    filters.value.to = dateFormatBy(toTimestamp(filters.value.to), 'YYYY-MM-DD');
  }
  showFilterDialog.value = false
}

function handleEdit(id: string) {
  router.push(`/news/${id}`);
}

async function handleDelete(id: string) {
  showConfirm('ต้องการลบประกาศนี้ใช่หรือไม่ ?').then(async (isConfirm) => {
    if(isConfirm) {
      showProgress()
      await deleteAnnouncement(id).then(res => {
        if(res.status === 204) {
          showSuccess('ลบประกาศสำเร็จ').then(res => {
            news_table_ref.value.refresh()
          })
        }else {
          showError('ลบประกาศไม่สำเร็จ')
        }
      })
    }
  })
}

async function handleToggleStatus(item: NewsData) {
  let message = item.isActive ? 'ปิด' : 'เปิด'
  showConfirm(`คุณต้องการ"${message}"ประกาศนี้หรือไม่ ?`).then(async (isConfirm) => {
    if(isConfirm){
      showProgress()
      try {
        if (!item.uuid) {
          return;
        }
        const form = new FormData();
        form.append("IsActive", String(!item.isActive));
        await updateAnnouncementStatus(item.uuid, form).then((res) => {
          if(res.data?.statusCode === 200) {
            showSuccess('อัพเดทสถานะประกาศสำเร็จ').then(res => {
              news_table_ref.value.refresh()
            })
          }else {
            showError('อัพเดทสถานะประกาศไม่สำเร็จ')
          }
        })
      } catch {
        item.isActive = !item.isActive;
        dismissPopup()
      }
    }
  })
}

const columns: ColumnDef<NewsData>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ลำดับ",
      });
    },
    cell: ({ row, table }) => {
      let pageIndex = table.getState().pagination.pageIndex;
      let pageSize = table.getState().pagination.pageSize;
      return h("div", { class: "text-center" }, (pageIndex * pageSize) + (row.index + 1))
    },
    meta: {
      getRowClass: (row: any) =>
        row.original.status === 3 ? 'expired-row' : '',
    },
    enableSorting: false,
    size: 45,
    minSize: 45,
    maxSize: 45,
  },
  {
    accessorKey: "image",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ภาพปก",
      });
    },
    cell: ({ row }) => {
      const imageUrl = row.original.coverImageFile?.url || ''
      return h("div", { class: "flex justify-center" }, [
        imageUrl
          ? h("img", {
              src: imageUrl,
              alt: "ภาพปก",
              class: "w-12 h-8 object-cover rounded",
            })
          : h("div", { class: "w-12 h-8 rounded bg-gray-200" }),
      ]);
    },
    enableSorting: false,
    size: 55,
    minSize: 55,
    maxSize: 55
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "หัวข้อ",
      });
    },
    cell: ({ row }) =>
      h("div", { class: "font-medium truncate" }, row.getValue("title")),
    enableSorting: true,
    size: 90,
    minSize: 90,
    maxSize: 90
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "รายละเอียด",
      });
    },
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return h("div", { class: "max-w-xs truncate" }, description);
    },
    enableSorting: false,
    size: 200,
    minSize: 200,
    maxSize: 200
  },
  {
    accessorKey: "publish_date",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "วันที่เผยแพร่",
      });
    },
    cell: ({ row }) =>
      h("div", { class: "text-sm truncate" }, mapPublishRange(row.original.publishDateStart, row.original.publishDateEnd)),
    enableSorting: true,
    size: 130,
    minSize: 130,
    maxSize: 130
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ปิด/เปิด",
      });
    },
    cell: ({ row }) => {
      const item = row.original as NewsData;
      if(!item.isSchedulePublish && parseInt(item.status) !== 0) {
        return h("div", { class: "flex justify-center" }, [
          h(Toggle, {
            modelValue: item.isActive,
            "onUpdate": (value: boolean) => {
              handleToggleStatus(item);
            }
          }),
        ]);
      }else {
        return ''
      }
    },
    enableSorting: true,
    size: 75,
    minSize: 75,
    maxSize: 75
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "สถานะ",
      });
    },
    cell: ({ row }) => {
      let status = row.getValue("status") as number;
      let statusStr: string = status.toString()
      return h("div", { class: "flex justify-center" }, [
        h(NewsStatusBadge, { status: statusStr }),
      ]);
    },
    enableSorting: true,
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "วันที่สร้าง",
      });
    },
    cell: ({ row }) => h("div", { class: "text-sm" }, thaiFormatDate(new Date(row.original.createdAt), "short")),
    enableSorting: true,
    size: 90,
    minSize: 90,
    maxSize: 90,
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ผู้สร้างประกาศ",
      });
    },
    cell: ({ row }) =>
      h("div", { class: "text-sm" }, row.getValue("createdBy")),
    enableSorting: false,
    size: 75,
    minSize: 75,
    maxSize: 75,
  },
  {
    id: "actions",
    header: () => h("div", { class: "text-center w-full" }, ""),
    cell: ({ row }) => {
      const newsId = row.original.uuid;
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
              class: "p-1 hover:opacity-80 transition-opacity cursor-pointer",
              onClick: () => handleEdit(newsId),
              title: "แก้ไข",
            },
            [
              h("img", {
                src: "/assets/images/edit-button.png",
                alt: "แก้ไข",
                class: "w-8 h-8",
              }),
            ],
          ),
          h(
            "button",
            {
              class: "p-1 hover:opacity-80 transition-opacity cursor-pointer",
              onClick: () => handleDelete(newsId),
              title: "ลบ",
            },
            [
              h("img", {
                src: "/assets/images/delete-button.png",
                alt: "ลบ",
                class: "w-8 h-8",
              }),
            ],
          ),
        ],
      );
    },
    enableSorting: false,
    size: 60,
    minSize: 60,
    maxSize: 60,
  },
];

</script>

<template>
  <ContentContainer
    :breadcrumbs="[{ text: 'จัดการและรายงาน (Y3)' }, { text: 'จัดการประกาศ' }]"
    :last_update="update_latest_at"
  >
    <div class="mb-3 flex justify-end">
      <RouterLink class="create-button" to="/news/create">
        <Plus class="h-4 w-4" /> สร้างประกาศ
      </RouterLink>
    </div>

    <DataTable
      :columns="columns"
      :show-pagination="true"
      :show-size-per-page="false"
      @show-filter="handleShowFilter"
      :tableApi="getAnnouncementsList"
      :tableApiData="filters"
      ref="news_table_ref"
      @update-latest-at="(val: string) => update_latest_at = val"
    />

    <!-- Filter Dialog -->
    <FilterDialog
      v-model="showFilterDialog"
      @apply-filters="handleFilterApply"
    />
  </ContentContainer>
</template>

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
