<template>
<!--  <content-container
    :breadcrumbs="[
      { text: 'หน้าหลัก', link: '/' },
      { text: 'Y3 คำร้องงานธุรกิจเกี่ยวเนื่อง', link: '/' },
      { text: 'บริการก่อสร้างและติดตั้งระบบไฟฟ้า', link: '/' },
    ]"
  >
    <button
      class="flex items-center gap-2 px-4 py-3 text-white font-medium cursor-pointer"
      style="background-color: #69306D"
      @click="createWorkOrder"
    >
      <q-icon name="note_add" size="sm"/>
      สร้างใบสั่งงานปฏิบัติงาน
    </button>
  </content-container>-->

  <modal_new_work_order :open="showAddWorkOrder"
                        :on-close="() => showAddWorkOrder = false"/>

</template>

<script setup lang="ts">
// import ContentContainer from "~/layouts/ContentContainer.vue";
import modal_new_work_order from "~/pages/work_order/create_or_update/modal_new_work_order.vue";

const showAddWorkOrder = ref<boolean>(true)
/*const createWorkOrder = () => {
  console.log('สร้างใบสั่งงานปฏิบัติงาน')
  showAddWorkOrder.value = true
}*/
</script>
