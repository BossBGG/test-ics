<!-- src/pages/news/[id].vue -->
<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import ContentContainer from "~/layouts/ContentContainer.vue"
import {publishOptions, type NewsData} from "~/data/newsData"
import {createAnnouncement, getDetailAnnouncement, updateAnnouncementStatus} from "~/api/news_api";
import {useRoute, useRouter} from "vue-router";
import {showError, showProgress, showSuccess} from "~/composables/alert";
import {toTimestamp} from "~/composables/datetime";
import AlertAnnounce from "~/components/alert/AlertAnnounce.vue";

const newsId = useRoute().params.id as string;
const router = useRouter()
const news = ref<NewsData>({status: '1', isActive: false, isSchedulePublish: '1'} as NewsData);

const isEditing = computed(() => newsId !== 'create')
const pageTitle = computed(() => isEditing.value ? 'แก้ไขประกาศ' : 'สร้างประกาศ')
const status = ref<string>('0')
const showAlert = ref<boolean>(false)
const messageAlert = ref<string>('สร้างประกาศ')
const isSuccessAlert = ref<boolean>(true)
const descriptionMessage = ref<string>('')

onMounted(() => {
  if (isEditing.value) {
    getDetailAnnouncement(newsId).then((res) => {
      if (res.data?.statusCode === 200) {
        news.value = res.data.data || {} as NewsData;
        news.value.isSchedulePublish = news.value.isSchedulePublish ? '1' : '0'
        let dateStart = news.value.publishDateStart ?? new Date()
        news.value.publishDateStart = dateFormatBy(dateStart, 'DD/MM/YYYY HH:mm')
        let dateEnd = news.value.publishDateEnd ?? new Date()
        news.value.publishDateEnd = dateFormatBy(dateEnd, 'DD/MM/YYYY HH:mm')
        news.value.image = news.value.coverImageFile?.url
      }
    })
  }
})

const handleImageUpload = (file: File) => {
  news.value.image = file as File
  console.log(news.value)
}

const goBack = () => {
  router.push(`/news/list`)
}

const handleChangeScheduleSetting = (val: string) => {
  if(val === '1') {
    if (!news.value.publishDateStart) {
      news.value.publishDateStart = ""
    }

    if (!news.value.publishDateEnd) {
      news.value.publishDateEnd = ""
    }
  }else {
    news.value.publishDateStart = ""
    news.value.publishDateEnd = ""
  }
}

const validateForm = (): boolean => {
  let isValid: boolean = true
  let message: string = ''
  const fields = [
    {key: 'image', name: 'ภาพปก'},
    {key: 'title', name: 'หัวข้อข่าว'},
    {key: 'description', name: 'รายละเอียดข่าว'},
    {key: 'content', name: 'เนื้อหาข่าว'},
    {key: 'isSchedulePublish', name: 'ช่วงเวลาที่ต้องการเผยแพร่ข่าว'}
  ]

  for (let field of fields) {
    if (field.key === 'isSchedulePublish') {
      if(news.value.isSchedulePublish === '1' && (!news.value.publishDateStart || !news.value.publishDateEnd)) {
        isValid = false
        message = field.name
        break;
      }
    }else {
      if(!news.value[field.key]) {
        isValid = false
        message = field.name
        break;
      }
    }
  }

  if(!isValid) {
    showError('กรุณากรอกข้อมูล : ' + message)
  }

  return isValid;
}

const makeFormData = (): FormData => {
  let formData: FormData = new FormData()
  // news.value.content = "<h2>PEA จัดอบรมภาคสนาม เรื่องความปลอดภัยในการปฏิบัติงานบนเสาไฟฟ้า</h2>\\n<p>เมื่อวันที่ 8 มิถุนายน 2568 การไฟฟ้าส่วนภูมิภาค (PEA) ได้จัดอบรมภาคสนามเรื่อง <strong>“ความปลอดภัยในการปฏิบัติงานบนเสาไฟฟ้า”</strong> ณ ศูนย์ฝึกอบรมการไฟฟ้าส่วนภูมิภาค จังหวัดนนทบุรี โดยมีพนักงานและเจ้าหน้าที่จากหลายสาขาทั่วประเทศเข้าร่วมกว่า 100 คน</p>\\n<p>การอบรมครั้งนี้ประกอบด้วยการบรรยายให้ความรู้ด้านความปลอดภัย การสาธิตและฝึกปฏิบัติจริงบนเสาไฟฟ้าจำลอง รวมถึงการใช้อุปกรณ์ป้องกันอันตรายส่วนบุคคล (PPE) อย่างถูกวิธี นอกจากนี้ยังมีการทบทวนมาตรฐานการทำงานบนที่สูง การช่วยเหลือผู้ประสบเหตุ และการปฐมพยาบาลเบื้องต้น</p>\\n<p><em>นายสมชาย สุขเกษม</em> ผู้จัดการฝ่ายความปลอดภัย PEA กล่าวว่า “การอบรมภาคสนามในครั้งนี้เป็นส่วนหนึ่งของนโยบายองค์กรในการส่งเสริมวัฒนธรรมความปลอดภัย และสร้างความตระหนักรู้ให้กับพนักงานทุกคน เพื่อให้สามารถปฏิบัติงานได้อย่างมั่นใจและปลอดภัยสูงสุด”</p>\\n<p>ทั้งนี้ PEA มีแผนจัดอบรมความปลอดภัยในรูปแบบภาคสนามอย่างต่อเนื่องในทุกภูมิภาค เพื่อยกระดับมาตรฐานความปลอดภัยในการปฏิบัติงานและลดความเสี่ยงจากอุบัติเหตุบนเสาไฟฟ้า</p>\\n<p><strong>เผยแพร่เมื่อ:</strong> 9 มิถุนายน 2568</p>"
  if (newsId) {
    formData.append("id", newsId)
  }

  formData.append("title", news.value.title)
  formData.append("description", news.value.description)
  formData.append("content", news.value.content)
  formData.append("isSchedulePublish", news.value.isSchedulePublish === '1' ? 'true' : 'false')
  if(news.value.isSchedulePublish === '1') {
    formData.append("publishDateStart", dateFormatBy(toTimestamp(news.value.publishDateStart as string), 'YYYY-MM-DDTHH:mm:ss'))
  }
  if(news.value.isSchedulePublish === '1') {
    formData.append("publishDateEnd", dateFormatBy(toTimestamp(news.value.publishDateEnd as string), 'YYYY-MM-DDTHH:mm:ss'))
  }

  let isActive = news.value.isActive
  let newsStatus: string = status.value === '1' ? '1' : '0'
  if(news.value.isSchedulePublish === '1') {
    //กำหนดเวลาเผยแพร่
    isActive = true
  }else {
    //ไม่กำหนดเวลาเผยแพร่
    if(status.value === '1') { //เผยแพร่ประกาศ
      //status = 2 -> รอเผยแพร่
      newsStatus = isActive ? '1' : '2'
    }
  }

  formData.append("isActive", isActive ? 'true' : 'false')
  formData.append("status", newsStatus)
  formData.append("coverImage", news.value.image || "")

  return formData;
}

const saveNews = (st: string) => {
  status.value = st
  if (!validateForm()) return;
  // status = 0 is Draft
  // status = 1 is Published
  showProgress()
  const data = makeFormData();
  renderAlertMessage()
  if (newsId !== 'create') {
    updateAnnouncementStatus(newsId, data).then((res) => {
      if (res.data?.success) {
        responseSuccess()
      }else {
        responseFail()
        descriptionMessage.value = res.data.message || ''
      }
    })
  } else {
    createAnnouncement(data).then((res) => {
      if (res.data?.success) {
        responseSuccess()
      } else {
        responseFail()
        descriptionMessage.value = res.data.message || ''
      }
    })
  }
}

const renderAlertMessage = () => {
  if(isEditing.value) {
    messageAlert.value = status.value === '0' ? 'อัพเดทแบบร่างประกาศ' : 'เผยแพร่ประกาศ'
  }else {
    messageAlert.value = status.value === '0' ? 'สร้างแบบร่างประกาศ' : 'สร้างประกาศ'
  }
}

const responseSuccess = () => {
  dismissPopup()
  showAlert.value = true
  isSuccessAlert.value = true
}

const responseFail = () => {
  dismissPopup()
  showAlert.value = true
  isSuccessAlert.value = false
}

const handleCloseAlert = (value: boolean) => {
  if(!value && isSuccessAlert) {
    goBack()
  }
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
    <div class="mx-auto">
      <div class="bg-white rounded-lg border-1 shadow-sm p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Image Upload -->
          <div class="lg:col-span-1">
            <div class="space-y-4">
              <InputImg
                label="ภาพปก"
                v-model="news.image"
                @file-change="handleImageUpload"
                :initial-image="news.coverImageFile?.url || ''"
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
                  :initial-value="news.title"
                  required
                  placeholder="กรอกหัวข้อข่าว"
                />
              </div>

              <!-- Description -->
              <div>
                <InputTextArea
                  label="รายละเอียด"
                  v-model="news.description"
                  :initial-value="news.description"
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
          <TextEditor v-model="news.content"/>
        </div>
      </div>

      <div class="rounded-lg border-1 shadow-sm p-2 mt-3">
        <!-- Publish Settings -->
        <div class="mt-6 space-y-2">
          <!-- Publish Status -->
          <div class="flex justify-between items-center">
            <InputRadio
              :options="publishOptions"
              v-model="news.isSchedulePublish"
              name="publish_status"
              style="padding: 0 10px 10px 10px"
              @change="handleChangeScheduleSetting"
            />

            <div class="flex items-center" v-if="news.isSchedulePublish === '0'">
              <span class="mr-2">ปิด/เปิด การเผยแพร่</span>
              <q-toggle v-model="news.isActive"/>
            </div>
          </div>

          <!-- Date Range -->
          <div class="flex items-center space-x-4" v-if="news.isSchedulePublish == '1'">
            <div class="flex-1">
              <FormDateTimePicker
                v-model="news.publishDateStart"
                label-text="วัน/เวลาที่เริ่มแสดงผล"
                custom-class="w-full"
              />
            </div>
            <div class="flex items-center justify-center text-gray-500 px-2">
              -
            </div>
            <div class="flex-1">
              <FormDateTimePicker
                v-model="news.publishDateEnd"
                label-text="วัน/เวลาที่สิ้นสุดแสดงผล"
                custom-class="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <!-- Action Buttons -->
        <div class="mt-3 pt-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="goBack"
              class="custom-button back-button"
            >
              ย้อนกลับ
            </button>
            <button
              @click="() => saveNews('0')"
              class="custom-button disabled-button"
            >
              บันทึกแบบร่าง
            </button>
            <button
              @click="() => saveNews('1')"
              class="custom-button create-announcement-button"
            >
              <q-icon name="o_save" class="me-2" />
              <div>{{ isEditing ? 'เผยแพร่ประกาศ' : 'สร้างประกาศ' }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <alert-announce v-model="showAlert"
                    :message="messageAlert"
                    :is_success="isSuccessAlert"
                    :description-message="descriptionMessage"
                    @update:model-value="handleCloseAlert"
    />
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

.disabled-button {
  background-color: #d8c3cf;
  color: #333;
}

.disabled-button:hover {
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
<style lang="scss">
.modal-success-announcement {
  .swal2-icon {
    border: none !important;
  }
}

.success-icon-size {
  width: 12rem !important;
}
</style>
