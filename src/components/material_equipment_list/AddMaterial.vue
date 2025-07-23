<!-- src/components/material_equipment_list/AddMaterial.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import CardCollapse from '~/components/ui/card/CardCollapse.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import '@/styles/add-material.css'

interface Material {
  id: number
  materialCode: string
  equipmentName: string
  withdrawAmount: number
  remainingAmount: number
  unit: string
  isEditing: boolean
  isSaved: boolean
}

interface MaterialOption {
  code: string
  name: string
  unit: string
  stock: number
}

const materialData = ref<Material[]>([])

// Mock data สำหรับ material options (จากรูปที่ส่งมา)
const materialOptions: MaterialOption[] = [
  { code: '1060050019', name: 'METER (E) WATTHOUR 1P 5(100) A O/D BLE', unit: 'EA', stock: 331 },
  { code: '1010110202', name: 'BOLT,MACHINE M.16X200 MM.', unit: 'EA', stock: 390 },
  { code: '1010110203', name: 'BOLT,MACHINE M.16X250 MM.', unit: 'EA', stock: 196 },
  { code: '1010180100', name: 'WASHER,PLAIN,SQUARE. 52X52X4.5 MM.', unit: 'EA', stock: 468 },
  { code: '1020080501', name: 'CABLE,CU,PVC,INS.&JAC. 600V, 2X10 SQ.MM.', unit: 'M', stock: 192 },
  { code: '1020180001', name: 'TAPE,PVC,O/D,0.18X19X10,000 MM. TIS.386', unit: 'EA', stock: 4.75 },
  { code: '1020200000', name: 'TAPE,ARMOR,AL 1X10 MM.', unit: 'KG', stock: 10.69 },
  { code: '1060100000', name: 'CABLE PLATE, SIZE 2X20X20 CM.', unit: 'EA', stock: 244 },
  { code: '1060100021', name: 'ลวดร้อยตราดาลักท์', unit: 'M', stock: 270.19 },
  { code: '1020320012', name: 'H-CONNCTOR,MAIN AL 50-95,TAP AL/CU 50-95', unit: 'EA', stock: 566 }
]

// สร้าง arrays สำหรับ dropdown options
const materialCodes = materialOptions.map(item => item.code)
const equipmentNames = materialOptions.map(item => item.name)

const addMaterial = () => {
  const newId = materialData.value.length > 0 ? Math.max(...materialData.value.map(item => item.id)) + 1 : 1
  materialData.value.push({
    id: newId,
    materialCode: '',
    equipmentName: '',
    withdrawAmount: 0,
    remainingAmount: 0,
    unit: '',
    isEditing: true,
    isSaved: false
  })
}

const removeMaterial = (id: number) => {
  materialData.value = materialData.value.filter(item => item.id !== id)
}

const saveMaterial = (id: number) => {
  const material = materialData.value.find(item => item.id === id)
  if (material && material.materialCode && material.equipmentName && material.withdrawAmount > 0 && material.unit) {
    material.isEditing = false
    material.isSaved = true
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const editMaterial = (id: number) => {
  const material = materialData.value.find(item => item.id === id)
  if (material) {
    material.isEditing = true
  }
}

const updateMaterial = (id: number, field: keyof Material, value: any) => {
  const index = materialData.value.findIndex(item => item.id === id)
  if (index !== -1) {
    materialData.value[index][field] = value
    
    // Auto-fill related fields when material code or equipment name changes
    if (field === 'materialCode' && value) {
      const selectedMaterial = materialOptions.find(item => item.code === value)
      if (selectedMaterial) {
        materialData.value[index].equipmentName = selectedMaterial.name
        materialData.value[index].unit = selectedMaterial.unit
        materialData.value[index].remainingAmount = selectedMaterial.stock
      }
    } else if (field === 'equipmentName' && value) {
      const selectedMaterial = materialOptions.find(item => item.name === value)
      if (selectedMaterial) {
        materialData.value[index].materialCode = selectedMaterial.code
        materialData.value[index].unit = selectedMaterial.unit
        materialData.value[index].remainingAmount = selectedMaterial.stock
      }
    }
  }
}

const clearAllData = () => {
  materialData.value = []
}

// Get filtered options based on current selection
const getFilteredMaterialCodes = (currentId: number) => {
  const currentMaterial = materialData.value.find(item => item.id === currentId)
  if (currentMaterial?.equipmentName) {
    const selectedMaterial = materialOptions.find(item => item.name === currentMaterial.equipmentName)
    return selectedMaterial ? [selectedMaterial.code] : materialCodes
  }
  return materialCodes
}

const getFilteredEquipmentNames = (currentId: number) => {
  const currentMaterial = materialData.value.find(item => item.id === currentId)
  if (currentMaterial?.materialCode) {
    const selectedMaterial = materialOptions.find(item => item.code === currentMaterial.materialCode)
    return selectedMaterial ? [selectedMaterial.name] : equipmentNames
  }
  return equipmentNames
}
</script>

<template>
  <CardCollapse title="รายการวัสดุอุปกรณ์" icon="/assets/images/doc.png">
    <div>
      <!-- Data Table -->
      <div class="rounded-[10px] border mb-4">
        <Table class="rounded-tl-[8px] rounded-tr-[8px] material-data-table">
          <TableHeader>
            <TableRow>
              <TableHead class="bg-[#69306D] text-white first:rounded-tl-[8px] p-2 text-center w-[80px]">
                ลำดับ
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 min-w-[150px]">
                รหัสวัสดุ
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 min-w-[300px]">
                ชื่ออุปกรณ์
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 text-center w-[140px]">
                จำนวนที่เบิก
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 text-center w-[140px]">
                จำนวนคงเหลือ
              </TableHead>
              <TableHead class="bg-[#69306D] text-white p-2 text-center w-[100px]">
                หน่วย
              </TableHead>
              <TableHead class="bg-[#69306D] text-white last:rounded-tr-[8px] p-2 text-center w-[140px]">
              
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="materialData.length > 0">
              <TableRow v-for="(material, index) in materialData" :key="material.id">
                <!-- ลำดับ -->
                <TableCell class="p-2 text-center font-semibold">
                  {{ index + 1 }}.
                </TableCell>
                
                <!-- รหัสวัสดุ -->
                <TableCell class="p-2">
                  <q-select
                    v-if="material.isEditing"
                    :model-value="material.materialCode"
                    :options="getFilteredMaterialCodes(material.id)"
                    outlined
                    placeholder="เลือกรหัสวัสดุ"
                    class="material-select"
                    use-input
                    input-debounce="0"
                    @update:model-value="(value) => updateMaterial(material.id, 'materialCode', value)"
                  />
                  <span v-else class="material-display">{{ material.materialCode || 'ยังไม่ได้เลือก' }}</span>
                </TableCell>
                
                <!-- ชื่ออุปกรณ์ -->
                <TableCell class="p-2">
                  <q-select
                    v-if="material.isEditing"
                    :model-value="material.equipmentName"
                    :options="getFilteredEquipmentNames(material.id)"
                    outlined
                    placeholder="เลือกชื่ออุปกรณ์"
                    class="material-select"
                    use-input
                    input-debounce="0"
                    @update:model-value="(value) => updateMaterial(material.id, 'equipmentName', value)"
                  />
                  <span v-else class="material-display">{{ material.equipmentName || 'ยังไม่ได้เลือก' }}</span>
                </TableCell>
                
                <!-- จำนวนที่เบิก -->
                <TableCell class="p-2 text-center">
                  <q-input
                    v-if="material.isEditing"
                    :model-value="material.withdrawAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    outlined
                    placeholder="จำนวนที่เบิก"
                    class="material-number-input"
                    @update:model-value="(value) => updateMaterial(material.id, 'withdrawAmount', parseFloat(value) || 0)"
                  />
                  <span v-else class="material-quantity-text">{{ material.withdrawAmount }}</span>
                </TableCell>
                
                <!-- จำนวนคงเหลือ -->
                <TableCell class="p-2 text-center">
                  <q-input
                    v-if="material.isEditing"
                    :model-value="material.remainingAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    outlined
                    placeholder="จำนวนคงเหลือ"
                    class="material-number-input"
                    @update:model-value="(value) => updateMaterial(material.id, 'remainingAmount', parseFloat(value) || 0)"
                  />
                  <span v-else class="material-quantity-text">{{ material.remainingAmount }}</span>
                </TableCell>
                
                <!-- หน่วย -->
                <TableCell class="p-2 text-center">
                  <q-input
                    v-if="material.isEditing"
                    :model-value="material.unit"
                    outlined
                    placeholder="หน่วย"
                    class="material-unit-input"
                    @update:model-value="(value) => updateMaterial(material.id, 'unit', value)"
                  />
                  <span v-else class="material-display">{{ material.unit || 'ยังไม่ได้กรอก' }}</span>
                </TableCell>
                
                <!-- การจัดการ -->
                <TableCell class="p-2">
                  <div class="flex justify-center items-center space-x-2 gap-4">
                    <!-- Save Icon (เมื่อกำลังแก้ไข) -->
                    <button 
                      v-if="material.isEditing"
                      class=" material-save-btn"
                      @click="saveMaterial(material.id)"
                      title="บันทึก"
                    >
                      <img src="/assets/images/save-table-icon.png" alt="" class="w-[32px] h-[32px]">
                    </button>
                    
                    <!-- Edit Icon (เมื่อบันทึกแล้ว) -->
                    <button 
                      v-else-if="material.isSaved"
                      class=" material-edit-btn"
                      @click="editMaterial(material.id)"
                      title="แก้ไข"
                    >
                     <img src="/assets/images/edit-table-icon.png" alt="" class="w-[20px] h-[20px]">
                    </button>
                    
                    <!-- Delete Icon (แสดงเสมอ) -->
                    <button 
                      class=" material-delete-btn"
                      @click="removeMaterial(material.id)"
                      title="ลบรายการ"
                    >
                      <img src="/assets/images/delete-table-icon.png" alt="" class="w-[16px] h-[20px]">
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </template>

            <TableRow v-else>
              <TableCell :colspan="7" class="h-24 text-center text-gray-500">
                ไม่มีข้อมูล
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Bottom Action Buttons -->
      <div class="flex justify-end space-x-3 mt-4 gap-4">
        <button class="material-clear-btn" @click="clearAllData">
          <img src="/assets/images/delete-icon.png" alt="" class="w-5">
          ลบทั้งหมด
        </button>
        
        <button class="material-add-btn" @click="addMaterial">
          <img src="/assets/images/add-icon.png" alt="" class="w-6 h-6">
          เพิ่มรายการ
        </button>
      </div>
    </div>
  </CardCollapse>
</template>

