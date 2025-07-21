<!-- src/components/worker/EquipmentInfo.vue -->
<script setup lang="ts">
import { ref } from 'vue'

// Import CSS
import '@/styles/workorder-datatable.css'

interface Equipment {
  id: number
  type: string
  quantity: number
  isEditing: boolean
  isSaved: boolean
}

const equipmentData = ref<Equipment[]>([])

const equipmentTypes = [
  'หม้อแปลง',
  'สายไฟฟ้า',
  'เสาไฟฟ้า',
  'สวิตช์เกียร์',
  'มิเตอร์ไฟฟ้า',
  'อื่นๆ'
]

const addEquipment = () => {
  const newId = equipmentData.value.length > 0 ? Math.max(...equipmentData.value.map(item => item.id)) + 1 : 1
  equipmentData.value.push({
    id: newId,
    type: '',
    quantity: 1,
    isEditing: true,
    isSaved: false
  })
}

const removeEquipment = (id: number) => {
 
    equipmentData.value = equipmentData.value.filter(item => item.id !== id)
  
}

const saveEquipment = (id: number) => {
  const equipment = equipmentData.value.find(item => item.id === id)
  if (equipment && equipment.type && equipment.quantity > 0) {
    equipment.isEditing = false
    equipment.isSaved = true
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const editEquipment = (id: number) => {
  const equipment = equipmentData.value.find(item => item.id === id)
  if (equipment) {
    equipment.isEditing = true
  }
}

const updateEquipment = (id: number, field: keyof Equipment, value: any) => {
  const index = equipmentData.value.findIndex(item => item.id === id)
  if (index !== -1) {
    equipmentData.value[index][field] = value
  }
}

const clearAllData = () => {
 
    equipmentData.value = []
  
}
</script>

<template>
  
    <div>
      <div class="equipment-table">
        <!-- Table Header -->
        <div class="table-header">
          <div class="table-cell header-cell">ลำดับ</div>
          <div class="table-cell des-header-cell">ประเภทอุปกรณ์ไฟฟ้า</div>
          <div class="table-cell header-cell">จำนวน</div>
          
        </div>

        <!-- No Data Message -->
        <div v-if="equipmentData.length === 0" class="no-data">
          <div class="no-data-text">ไม่มีข้อมูล</div>
        </div>

        <!-- Table Rows -->
        <div 
          v-for="(equipment, index) in equipmentData" 
          :key="equipment.id"
          class="table-row"
        >
          <!-- ลำดับ -->
          <div class="table-cell center-cell">{{ index + 1 }}.</div>
          
          <!-- ประเภทอุปกรณ์ไฟฟ้า -->
          <div class="table-cell">
            <q-select
              v-if="equipment.isEditing"
              :model-value="equipment.type"
              :options="equipmentTypes"
              outlined
              placeholder="เลือกประเภทอุปกรณ์"
              class="equipment-select"
              use-input
              new-value-mode="add-unique"
              @update:model-value="(value) => updateEquipment(equipment.id, 'type', value)"
            />
            <span v-else class="equipment-display">{{ equipment.type || 'ยังไม่ได้เลือก' }}</span>
          </div>
          
          <!-- จำนวน -->
          <div class="table-cell center-cell">
            <q-input
              v-if="equipment.isEditing"
              :model-value="equipment.quantity"
              type="number"
              min="1"
              outlined
             
              @update:model-value="(value) => updateEquipment(equipment.id, 'quantity', parseInt(value) || 1)"
            />
            <span v-else class="quantity-text">{{ equipment.quantity }}</span>
          </div>
          
          <!-- การจัดการ -->
          <div class="table-cell">
            <div class="action-buttons">
              <!-- Save Icon (เมื่อกำลังแก้ไข) -->
              <button 
                v-if="equipment.isEditing"
                class="action-btn save-table-btn"
                @click="saveEquipment(equipment.id)"
                title="บันทึก"
              >
                <img src="/assets/images/save-table-icon.png" alt="" class="save-table-icon">
              </button>
              
              <!-- Edit Icon (เมื่อบันทึกแล้ว) -->
              <button 
                v-else-if="equipment.isSaved"
                class="action-btn edit-table-btn"
                @click="editEquipment(equipment.id)"
                title="แก้ไข"
              >
               <img src="/assets/images/edit-table-icon.png" alt="" class="edit-table-icon">
              </button>
              
              <!-- Delete Icon (แสดงเสมอ) -->
              <button 
                class="action-btn delete-table-btn"
                @click="removeEquipment(equipment.id)"
                title="ลบรายการ"
              >
                <img src="/assets/images/delete-table-icon.png" alt="" class="delete-table-icon">
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Action Buttons -->
      <div class="equipment-actions">
        <button class="action-btn-bottom clear-btn" @click="clearAllData">
          <img src="/assets/images/delete-icon.png" alt="" class="icon">
          ลบทั้งหมด
        </button>
        
        <button class="action-btn-bottom add-btn-bottom" @click="addEquipment">
          <img src="/assets/images/add-icon.png" alt="" class="w-6 h-6">
          เพิ่มรายการ
        </button>
      </div>
    </div>
 
</template>

