<!-- src/pages/news/list.vue -->
<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { computed, h, onMounted, ref } from "vue";
import axios from "axios";
import { Plus } from "lucide-vue-next";
import DataTable from "@/components/form/DataTable.vue";
import DataTableColumnHeader from "~/components/form/DataTableColumnHeader.vue";
import ContentContainer from "~/layouts/ContentContainer.vue";
import FilterDialog from "~/components/dialog/FilterDialog.vue";
import NewsStatusBadge from "~/components/news/NewsStatusBadge.vue";
import { Switch } from "~/components/ui/switch";
import { dateFormatMonth } from "~/composables/datetime";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/$/, "");

interface NewsData {
  id: number;
  uuid?: string;
  image: string;
  title: string;
  description: string;
  content: string;
  publish_date: string;
  is_active: boolean;
  status: "draft" | "published" | "pending" | "expired";
  created_date: string;
  created_by: string;
}

interface AnnouncementItem {
  id: number;
  uuid: string;
  title: string;
  description?: string;
  content?: string;
  isActive?: boolean;
  status: number;
  publishDateStart?: string;
  publishDateEnd?: string;
  createdAt: string;
  createdBy?: string;
  coverImageFile?: { url?: string };
}

const showFilterDialog = ref(false);
const currentFilters = ref({
  startDate: "",
  endDate: "",
  status: "",
});

const items = ref<NewsData[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");

function mapStatus(a: AnnouncementItem): NewsData["status"] {
  const now = new Date();
  const start = a.publishDateStart ? new Date(a.publishDateStart) : undefined;
  const end = a.publishDateEnd ? new Date(a.publishDateEnd) : undefined;
  if (a.isActive === false) {
    return "draft";
  }

  if (start && now < start) {
    return "pending";
  }

  if (end && now > end) {
    return "expired";
  }

  return "published";
}

function mapPublishRange(a: AnnouncementItem): string {
  const start = a.publishDateStart ? dateFormatMonth(a.publishDateStart) : "-";
  const end = a.publishDateEnd ? dateFormatMonth(a.publishDateEnd) : "-";
  return `${start} - ${end}`;
}

function mapToNewsData(a: AnnouncementItem): NewsData {
  return {
    id: a.id,
    uuid: a.uuid,
    image: a.coverImageFile?.url ?? "",
    title: a.title,
    description: a.description ?? "",
    content: a.content ?? "",
    publish_date: mapPublishRange(a),
    is_active: a.isActive ?? false,
    status: mapStatus(a),
    created_date: dateFormatMonth(a.createdAt),
    created_by: a.createdBy ?? "",
  };
}

async function fetchAnnouncements() {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    const { data } = await axios.get(`${API_BASE}/v1/announcements`, {
      params: {
        page: 1,
        limit: 10,
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        from: currentFilters.value.startDate || undefined,
        to: currentFilters.value.endDate || undefined,
      },
    });
    const list: AnnouncementItem[] = data?.data?.items ?? [];
    items.value = list.map(mapToNewsData);
  } catch (e: any) {
    errorMessage.value = e?.message || "โหลดข้อมูลไม่สำเร็จ";
    items.value = [];
  } finally {
    isLoading.value = false;
  }
}

function handleApplyFilters(filters: any) {
  currentFilters.value = { ...filters };
  fetchAnnouncements();
}

function handleShowFilter() {
  showFilterDialog.value = true;
}

function handleEdit(id: number) {
  console.log("Edit news:", id);
}

async function handleDelete(id: number) {
  console.log("Delete news:", id);
}

async function handleToggleStatus(item: NewsData) {
  try {
    if (!item.uuid) {
      return;
    }
    const form = new FormData();
    form.append("IsActive", String(item.is_active));
    await axios.patch(`${API_BASE}/v1/announcements/${item.uuid}`, form);
  } catch {
    item.is_active = !item.is_active;
  }
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
    cell: ({ row }) => h("div", { class: "text-center" }, row.getValue("id")),
    enableSorting: true,
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
      const imageUrl = row.getValue("image") as string;
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
      h("div", { class: "font-medium" }, row.getValue("title")),
    enableSorting: true,
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
      h("div", { class: "text-sm" }, row.getValue("publish_date")),
    enableSorting: true,
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column,
        title: "ปิด/เปิด",
      });
    },
    cell: ({ row }) => {
      const item = row.original as NewsData;
      return h("div", { class: "flex justify-center" }, [
        h(Switch, {
          modelValue: item.is_active,
          "onUpdate:modelValue": (value: boolean) => {
            item.is_active = value;
            handleToggleStatus(item);
          },
        }),
      ]);
    },
    enableSorting: true,
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
        column,
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
        column,
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
            ],
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
            ],
          ),
        ],
      );
    },
    enableSorting: false,
  },
];

const filteredData = computed(() => {
  let data = [...items.value];
  if (currentFilters.value.status)
    data = data.filter((d) => d.status === currentFilters.value.status);
  return data;
});

onMounted(fetchAnnouncements);
</script>

<template>
  <ContentContainer
    :breadcrumbs="[{ text: 'จัดการและรายงาน (Y3)' }, { text: 'จัดการประกาศ' }]"
    last_update="2025-06-19 10:00:00"
  >
    <div class="mb-3 flex justify-end">
      <RouterLink class="create-button" to="/news/create">
        <Plus class="h-4 w-4" /> สร้างประกาศ
      </RouterLink>
    </div>

    <DataTable
      :columns="columns"
      :data="filteredData"
      :show-pagination="true"
      @show-filter="handleShowFilter"
    />

    <FilterDialog
      v-model="showFilterDialog"
      @apply-filters="handleApplyFilters"
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
