<!-- src/components/work_order/MeterElectricalEquipment.vue -->
<script setup lang="ts">
import { ref } from "vue";

// Import CSS
import "@/styles/workorder-datatable.css";

interface MeterEquipment {
  id: number;
  equipmentType: string;
  size: string;
  quantity: string;
  isEditing: boolean;
  isSaved: boolean;
}

const equipmentData = ref<MeterEquipment[]>([]);

// ตัวเลือกสำหรับมิเตอร์/อุปกรณ์ไฟฟ้า
const equipmentTypeOptions = [
  'มิเตอร์ไฟฟ้า 1 เฟส',
  'มิเตอร์ไฟฟ้า 3 เฟส', 
  'CT (Current Transformer)',
  'PT (Potential Transformer)',
  'เครื่องวัดแรงดัน',
  'เครื่องวัดกระแส',
  'รีเลย์ป้องกัน',
  'สวิตช์ไฟฟ้า',
  'เบรกเกอร์',
  'ฟิวส์',
  'อื่นๆ'
];

const addEquipment = () => {
  const newId =
    equipmentData.value.length > 0
      ? Math.max(...equipmentData.value.map((item) => item.id)) + 1
      : 1;
  equipmentData.value.push({
    id: newId,
    equipmentType: "",
    size: "",
    quantity: "",
    isEditing: true,
    isSaved: false,
  });
};

const removeEquipment = (id: number) => {
  equipmentData.value = equipmentData.value.filter((item) => item.id !== id);
};

const saveEquipment = (id: number) => {
  const equipment = equipmentData.value.find((item) => item.id === id);
  if (
    equipment &&
    equipment.equipmentType &&
    equipment.size &&
    equipment.quantity
  ) {
    equipment.isEditing = false;
    equipment.isSaved = true;
  } else {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
  }
};

const editEquipment = (id: number) => {
  const equipment = equipmentData.value.find((item) => item.id === id);
  if (equipment) {
    equipment.isEditing = true;
  }
};

const updateEquipment = (id: number, field: keyof MeterEquipment, value: any) => {
  const index = equipmentData.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    equipmentData.value[index][field] = value;
  }
};

const clearAllData = () => {
  equipmentData.value = [];
};

// Expose methods for parent component (optional)
defineExpose({
  getData: () => equipmentData.value,
  addEquipment,
  clearAllData
});
</script>

<template>
  <div>
    <div class="meter-equipment-table">
      <!-- Table Header -->
      <div class="meter-table-header">
        <div class="table-cell header-cell">ลำดับ</div>
        <div class="table-cell des-header-cell">มิเตอร์/อุปกรณ์ไฟฟ้า</div>
        <div class="table-cell des-header-cell">ขนาด</div>
        <div class="table-cell des-header-cell">จำนวน</div>
        <div class="table-cell header-cell"></div>
      </div>

      <!-- No Data Message -->
      <div v-if="equipmentData.length === 0" class="no-data-meter">
        <div class="no-data-text">ไม่มีข้อมูล</div>
      </div>

      <!-- Table Rows -->
      <div
        v-for="(equipment, index) in equipmentData"
        :key="equipment.id"
        class="meter-table-row"
      >
        <!-- ลำดับ -->
        <div class="table-cell center-cell">{{ index + 1 }}</div>

        <!-- มิเตอร์/อุปกรณ์ไฟฟ้า -->
        <div class="table-cell">
          <q-select
            v-if="equipment.isEditing"
            :model-value="equipment.equipmentType"
            :options="equipmentTypeOptions"
            outlined
            placeholder="เลือกมิเตอร์/อุปกรณ์ไฟฟ้า"
            class="meter-select"
            use-input
            new-value-mode="add-unique"
            @update:model-value="
              (value) => updateEquipment(equipment.id, 'equipmentType', value)
            "
          />
          <span v-else class="equipment-display">{{
            equipment.equipmentType || "ยังไม่ได้เลือก"
          }}</span>
        </div>

        <!-- ขนาด -->
        <div class="table-cell">
          <q-input
            v-if="equipment.isEditing"
            :model-value="equipment.size"
            outlined
            placeholder="ระบุขนาด"
            class="meter-input"
            @update:model-value="
              (value) => updateEquipment(equipment.id, 'size', value)
            "
          />
          <span v-else class="equipment-display">{{
            equipment.size || "ยังไม่ได้กรอก"
          }}</span>
        </div>

        <!-- จำนวน -->
        <div class="table-cell">
          <q-input
            v-if="equipment.isEditing"
            :model-value="equipment.quantity"
            outlined
            placeholder="ระบุจำนวน"
            class="meter-input"
            @update:model-value="
              (value) => updateEquipment(equipment.id, 'quantity', value)
            "
          />
          <span v-else class="equipment-display">{{
            equipment.quantity || "ยังไม่ได้กรอก"
          }}</span>
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
              <img
                src="/assets/images/save-table-icon.png"
                alt=""
                class="save-table-icon"
              />
            </button>

            <!-- Edit Icon (เมื่อบันทึกแล้ว) -->
            <button
              v-else-if="equipment.isSaved"
              class="action-btn edit-table-btn"
              @click="editEquipment(equipment.id)"
              title="แก้ไข"
            >
              <img
                src="/assets/images/edit-table-icon.png"
                alt=""
                class="edit-table-icon"
              />
            </button>

            <!-- Delete Icon (แสดงเสมอ) -->
            <button
              class="action-btn delete-table-btn"
              @click="removeEquipment(equipment.id)"
              title="ลบรายการ"
            >
              <img
                src="/assets/images/delete-table-icon.png"
                alt=""
                class="delete-table-icon"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Buttons -->
    <div class="equipment-actions">
      <button class="action-btn-bottom clear-btn" @click="clearAllData">
        <img src="/assets/images/delete-icon.png" alt="" class="icon" />
        ลบทั้งหมด
      </button>

      <button class="action-btn-bottom add-btn-bottom" @click="addEquipment">
        <img src="/assets/images/add-icon.png" alt="" class="w-6 h-6" />
        เพิ่มรายการ
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Meter Equipment Table Specific Styles */
.meter-equipment-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

/* Table Layout - 5 columns for meter equipment */
.meter-table-header {
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1fr 120px;
  background: #69306d !important;
}

.meter-table-row {
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1fr 120px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f7f7;
}

.meter-table-row:last-child {
  border-bottom: none;
}

.no-data-meter {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: #f8f7f7;
  color: #9ca3af;
  font-size: 16px;
  font-weight: 500;
  grid-column: span 5;
}

/* Input styles specific to meter equipment */
.meter-select,
.meter-input {
  width: 100%;
  min-width: 0;
}

/* Responsive adjustments for meter equipment table */
@media (max-width: 1200px) {
  .meter-table-header,
  .meter-table-row {
    grid-template-columns: 50px 2fr 120px 100px 100px;
    font-size: 12px;
  }

  .table-cell {
    padding: 8px 4px;
  }
}

@media (max-width: 768px) {
  .meter-table-header,
  .meter-table-row {
    grid-template-columns: 40px 1fr 80px 80px 80px;
    font-size: 11px;
  }

  .table-cell {
    padding: 6px 2px;
  }

  .action-btn {
    width: 20px;
    height: 20px;
  }
}

/* Inherit other styles from workorder-datatable.css */
</style>