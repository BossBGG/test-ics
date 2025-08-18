<script lang="ts">
import type {PropType} from 'vue'
import {defineComponent} from 'vue'
import type {RouteLocationRaw} from 'vue-router'

export interface BreadcrumbItem {
  text: String,
  link?: RouteLocationRaw
}

interface Props {
  items: { type: BreadcrumbItem[] }
}

export default defineComponent({
  props: {
    items: {
      type: Object as PropType<BreadcrumbItem[]>,
      required: true,
    }
  },
})
</script>
<template>
  <nav aria-label="breadcrumb" v-if="items.length">
    <ol class="breadcrumb">
      <li class="breadcrumb-item" :class="{active:i==items.length-1}" v-for="(item,i) in items">
        <router-link :to="item.link" v-if="item.link">{{ item.text }}</router-link>
        <template v-else>{{ item.text }}</template>
      </li>
    </ol>
  </nav>
</template>

<style scoped lang="scss">

.breadcrumb-item {
  a {
    color: #6c757d;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
}

.breadcrumb-item:last-child {
  &, a {
    color: #AAAAAA;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
}

.breadcrumb {
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  padding: 0.75rem 0;
  margin-bottom: 1rem;
  list-style: none;
  border-radius: 0.375rem; /* Rounded corners */
}

.breadcrumb-item + .breadcrumb-item {
  padding-left: 0.5rem; /* Space between items */
}

.breadcrumb-item + .breadcrumb-item::before {
  display: inline-block;
  padding-right: 0.5rem; /* Space before separator */
  color: #6c757d; /* Separator color */
  content: var(--bs-breadcrumb-divider, "/"); /* Default separator */
}

.breadcrumb-item.active {
  color: #6c757d; /* Active item color */
}

.breadcrumb-item a {
  color: #0d6efd; /* Link color */
  text-decoration: none; /* Remove underline */
}

.breadcrumb-item a:hover {
  color: #0a58ca; /* Darker blue on hover */
  text-decoration: underline; /* Underline on hover */
}
</style>
