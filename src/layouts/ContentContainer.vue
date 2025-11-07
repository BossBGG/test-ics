<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, ref, watch } from 'vue'
import type { BreadcrumbItem } from '@/layouts/Breadcrumbs.vue'
import Breadcrumbs from '@/layouts/Breadcrumbs.vue'
import {dateTimeFormatThaiMonth} from "~/composables/datetime";

const { breadcrumbs: pageBreadcrumbs, size,last_update } = defineProps({
  size: { default: 'full', type: String, validator: (v: string) => ['compact', 'wide', 'full'].indexOf(v) >= 0 },
  breadcrumbs: {
    type: Object as PropType<BreadcrumbItem[]>,
  },
  last_update: {
    type: String,
    default: ''
  }
})

// create breadcrumbs from route meta for better breadcrumbs
const breadcrumbs = ref<BreadcrumbItem[] | null>(null)
const menu = ref<string>('')

onMounted(() => {
  reCreateBreadcrumb()
})

function reCreateBreadcrumb () {
  if (pageBreadcrumbs) {
    breadcrumbs.value = pageBreadcrumbs
    menu.value = pageBreadcrumbs.length > 0 ? pageBreadcrumbs[pageBreadcrumbs.length - 1].text : ''
  }
}

watch(() => pageBreadcrumbs, () => { reCreateBreadcrumb() }, { deep: true })
</script>
<template>
  <div class="p-3 content-container">
    <div :class="size!=='full'?('content-'+size):''">
      <div class="row g-2" v-if="breadcrumbs">
        <div class="col-lg">
          <breadcrumbs v-if="breadcrumbs" :items="breadcrumbs"/>
        </div>
      </div>
      <div class="mb-3">
        <div class="flex items-center justify-between">
          <div>
            <div v-if="menu" class="text-[32px] text-[#C99530] font-bold">{{ menu}}</div>
            <div v-if="last_update">อัปเดตล่าสุดเมื่อ: {{ dateTimeFormatThaiMonth(last_update) }}</div>
          </div>
          <div v-if="$slots.menu">
            <slot name="menu"/>
          </div>
        </div>
      </div>

      <div class="m-5">
        <slot/>
      </div>
    </div>
  </div>
</template>

<style>
.content-container {
  width: 100%;
}

.content-container > div {
  width: 100%;
  margin: 0 auto;
}

.content-container .content-wide {
  max-width: 1144px;
}

.content-container .content-compact {
  max-width: 560px;
}
</style>
