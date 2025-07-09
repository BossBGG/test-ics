<script setup lang="ts">
import ContentContainer from "~/layouts/ContentContainer.vue";
import {News} from "~/api/types";
import {ref} from "vue";

const news = ref<News>({} as News)

</script>

<template>
  <content-container
      :breadcrumbs="[{ text: 'จัดการและรายงาน (Y3)' },{text: 'จัดการประกาศ'},{text: 'สร้าง/แก้ไข ประกาศ'}]"
  >
    <div class="row">
      <div class="col-auto mr-5">
        <InputImg label="ภาพปก" v-model="news.image"/>
      </div>
      <div class="col">
        <div>
          <input-text label="หัวข้อ" v-model="news.title" required/>
        </div>
        <div>
          <input-text-area label="รายละเอียด" v-model="news.description"/>
        </div>
      </div>
    </div>
    <div>
      <text-editor/>
    </div>

    <div class="mt-3">
      <input-radio :options="PUBLISH_OPTIONS"  v-model="news.publish"></input-radio>
      <div class="flex items-center">
        <div class="mr-4">
          <form-date-time-picker  v-model="news.strat_date" label-text="วัน/เวลาที่เริ่มแสดงผล"/>
        </div>
        <div> -</div>
        <div class="ml-5">
          <form-date-time-picker  v-model="news.end_date" label-text="วัน/เวลาที่สิ้นสุดแสดงผล"/>
        </div>
      </div>
    </div>

    <div id="footer" class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
      <button class="custom-button back-button">ย้อนกลับ</button>
      <button class="custom-button save-draft-button">บันทึกฉบับร่าง</button>
      <button class="custom-button create-announcement-button">
        สร้างประกาศ
      </button>
    </div>
  </content-container>
</template>

<style scoped>
.custom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 25px;
  border: none;
  border-radius: 8px; /* Adjust for desired roundedness */
  color: #ffffff; /* White text color */
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%;
}

/* Specific button styles */
.back-button {
  background-color: #8c4c7b; /* Deep purple/maroon */
}

.save-draft-button {
  background-color: #d8c3cf; /* Light purple/beige */
  color: #333; /* Potentially darker text for better contrast */
}

.create-announcement-button {
  background-color: #6a2a7a; /* Darker purple */
}

/* Hover effects */
.custom-button:hover {
  opacity: 0.9; /* Slightly dim on hover */
  transform: translateY(-2px); /* Slight lift effect */
}

.custom-button:active {
  transform: translateY(0);
  opacity: 1;
}
</style>