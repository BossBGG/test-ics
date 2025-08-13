<!-- src/pages/news/[id].vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContentContainer from "~/layouts/ContentContainer.vue"
import { mockNewsData, publishOptions, type NewsData } from "~/data/newsData"

const route = useRoute()
const router = useRouter()

const newsId = computed(() => parseInt(route.params.id as string))
const news = ref<NewsData>({
  id: 0,
  image: '',
  title: '',
  description: '',
  content: '',
  publish_date: '',
  is_active: true,
  status: 'draft',
  created_date: '',
  created_by: ''
})

const isEditing = computed(() => newsId.value > 0)
const pageTitle = computed(() => isEditing.value ? 'แก้ไข ประกาศ' : 'สร้าง ประกาศ')

onMounted(() => {
  if (isEditing.value) {
    // Load existing news data
    const existingNews = mockNewsData.find(item => item.id === newsId.value)
    if (existingNews) {
      news.value = { ...existingNews }
    } else {
      // News not found, redirect to list
      router.push('/news/list')
    }
  }
})

const handleImageUpload = (file: File) => {
  // Handle image upload logic here
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      news.value.image = e.target.result as string
    }
  }
  reader.readAsDataURL(file)
}



const saveDraft = () => {
  news.value.status = 'draft'
  console.log('Save draft:', news.value)
  // Add save logic here
}

const saveNews = () => {
  news.value.status = 'published'
  console.log('Save news:', news.value)
  // Add save logic here
}
</script>

<template>
  <content-container
    :breadcrumbs="[
      { text: 'จัดการและรายงาน (Y3)' },
      { text: 'จัดการประกาศ', link: '/news/list' },
      { text: pageTitle }
    ]"
  >
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Image Upload -->
          <div class="lg:col-span-1">
            <div class="space-y-4">
              <InputImg 
                label="ภาพปก" 
                v-model="news.image"
                @file-change="handleImageUpload"
              />
            </div>
          </div>

          <!-- Right Column - Form Fields -->
          <div class="lg:col-span-2">
            <div class="space-y-4">
              <!-- Title -->
              <div>
                <InputText 
                  label="หัวข้อ" 
                  v-model="news.title" 
                  required 
                  placeholder="กรอกหัวข้อข่าว"
                />
              </div>

              <!-- Description -->
              <div>
                <InputTextArea 
                  label="รายละเอียด" 
                  v-model="news.description"
                  :rows="4"
                  placeholder="กรอกรายละเอียดสั้นๆ ของข่าว"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Content Editor -->
        <div class="mt-6">
          <div class="mb-2">
            <label class="text-sm font-medium text-gray-700">เนื้อหา</label>
          </div>
          <TextEditor v-model="news.content" />
        </div>

        <!-- Publish Settings -->
        <div class="mt-6 space-y-4">
          <!-- Publish Status -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-3 block">สถานะการเผยแพร่</label>
            <InputRadio 
              :options="publishOptions"
              v-model="news.status"
              name="publish_status"
            />
          </div>

          <!-- Date Range -->
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <FormDateTimePicker 
                v-model="news.publish_date"
                label-text="วัน/เวลาที่เริ่มแสดงผล"
                custom-class="w-full"
              />
            </div>
            <div class="flex items-center justify-center text-gray-500 px-2">
              -
            </div>
            <div class="flex-1">
              <FormDateTimePicker 
                v-model="news.publish_date"
                label-text="วัน/เวลาที่สิ้นสุดแสดงผล"
                custom-class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 border-t pt-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              @click="goBack"
              class="custom-button back-button"
            >
              ย้อนกลับ
            </button>
            <button 
              @click="saveDraft"
              class="custom-button save-draft-button"
            >
              บันทึกฉบับร่าง
            </button>
            <button 
              @click="saveNews"
              class="custom-button create-announcement-button"
            >
              {{ isEditing ? 'บันทึก' : 'สร้างประกาศ' }}
            </button>
          </div>
        </div>
      </div>
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
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  min-height: 44px;
}

.back-button {
  background-color: #8c4c7b;
}

.back-button:hover {
  background-color: #7a4169;
}

.save-draft-button {
  background-color: #d8c3cf;
  color: #333;
}

.save-draft-button:hover {
  background-color: #ceb3c4;
}

.create-announcement-button {
  background-color: #6a2a7a;
}

.create-announcement-button:hover {
  background-color: #5a2369;
}

.custom-button:active {
  transform: translateY(1px);
}

.custom-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>