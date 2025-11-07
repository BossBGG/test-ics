<!-- src/components/worker/TransformerDetail.vue -->
<script setup lang="ts">
import { ref } from "vue";

// Import CSS
import "@/styles/workorder-datatable.css";

interface Equipment {
  id: number;
  brand: string;
  phase: string;
  type: string;
  serial: string;
  size: string;
  voltage: string;
  isEditing: boolean;
  isSaved: boolean;
}

const equipmentData = ref<Equipment[]>([]);

// ตัวเลือกสำหรับ dropdown
const brandOptions = ["หม้อแปลง 3P5000KVA"];

const phaseOptions = ["1 ", "2", "3 "];

const typeOptions = ["1", "2", "3", "4", "5"];

const addEquipment = () => {
  const newId =
    equipmentData.value.length > 0
      ? Math.max(...equipmentData.value.map((item) => item.id)) + 1
      : 1;
  equipmentData.value.push({
    id: newId,
    brand: "",
    phase: "",
    type: "",
    serial: "",
    size: "",
    voltage: "",
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
    equipment.brand &&
    equipment.phase &&
    equipment.type &&
    equipment.serial &&
    equipment.size &&
    equipment.voltage
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

const updateEquipment = (id: number, field: keyof Equipment, value: any) => {
  const index = equipmentData.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    equipmentData.value[index][field] = value;
  }
};

const clearAllData = () => {
  equipmentData.value = [];
};
</script>

<template>
  <div>
    <div class="transformer-table">
      <!-- Table Header -->
      <div class="transformer-table-header">
        <div class="table-cell header-cell">ลำดับ</div>
        <div class="table-cell des-header-cell">ยี่ห้อ</div>
        <div class="table-cell des-header-cell">เฟส</div>
        <div class="table-cell des-header-cell">ประเภท</div>
        <div class="table-cell des-header-cell">serial</div>
        <div class="table-cell des-header-cell">ขนาด</div>
        <div class="table-cell des-header-cell">แรงดัน</div>
        <div class="table-cell header-cell"></div>
      </div>

      <!-- No Data Message -->
      <div v-if="equipmentData.length === 0" class="no-data-transformer">
        <div class="no-data-text">ไม่มีข้อมูล</div>
      </div>

      <!-- Table Rows -->
      <div
        v-for="(equipment, index) in equipmentData"
        :key="equipment.id"
        class="transformer-table-row"
      >
        <!-- ลำดับ -->
        <div class="table-cell center-cell">{{ index + 1 }}</div>

        <!-- ยี่ห้อ -->
        <div class="table-cell">
          <q-select
            v-if="equipment.isEditing"
            :model-value="equipment.brand"
            :options="brandOptions"
            outlined
            placeholder="ยี่ห้อ"
            class="transformer-select"
            use-input
            hide-selected
            fill-input
            new-value-mode="add-unique"
            @update:model-value="
              (value) => updateEquipment(equipment.id, 'brand', value)
            "
          />
          <span v-else class="equipment-display">{{
            equipment.brand || "ยังไม่ได้เลือก"
          }}</span>
        </div>

        <!-- เฟส -->
        <div class="table-cell">
          <q-select
            v-if="equipment.isEditing"
            :model-value="equipment.phase"
            :options="phaseOptions"
            outlined
            use-input
            hide-selected
            fill-input
            placeholder="เฟส"
            class="transformer-select"
            @update:model-value="
              (value) => updateEquipment(equipment.id, 'phase', value)
            "
          />
          <span v-else class="equipment-display">{{
            equipment.phase || "ยังไม่ได้เลือก"
          }}</span>
        </div>

        <!-- ประเภท -->
        <div class="table-cell">
          <q-select
            v-if="equipment.isEditing"
            :model-value="equipment.type"
            :options="typeOptions"
            outlined
            placeholder="ประเภท"
            class="transformer-select"
            use-input
            hide-selected
            fill-input
            new-value-mode="add-unique"
            @update:model-value="
              (value) => updateEquipment(equipment.id, 'type', value)
            "
          />
          <span v-else class="equipment-display">{{
            equipment.type || "ยังไม่ได้เลือก"
          }}</span>
        </div>

        <!-- Serial -->
        <div class="table-cell">
          <q-input
            v-if="equipment.isEditing"
            :model-value="equipment.serial"
            outlined
            placeholder="serial"
            class="transformer-input"
            @update:model-value="
              (value) => updateEquipment(equipment.id, 'serial', value)
            "
          />
          <span v-else class="equipment-display">{{
            equipment.serial || "ยังไม่ได้กรอก"
          }}</span>
        </div>

        <!-- ขนาด -->
        <div class="table-cell">
          <q-input
            v-if="equipment.isEditing"
            :model-value="equipment.size"
            outlined
            placeholder="ขนาด"
            class="transformer-input"
            @update:model-value="
              (value) => updateEquipment(equipment.id, 'size', value)
            "
          />
          <span v-else class="equipment-display">{{
            equipment.size || "ยังไม่ได้กรอก"
          }}</span>
        </div>

        <!-- แรงดัน -->
        <div class="table-cell">
          <q-input
            v-if="equipment.isEditing"
            :model-value="equipment.voltage"
            outlined
            placeholder="แรงดัน"
            class="transformer-input"
            @update:model-value="
              (value) => updateEquipment(equipment.id, 'voltage', value)
            "
          />
          <span v-else class="equipment-display">{{
            equipment.voltage || "ยังไม่ได้กรอก"
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
/* Transformer Table Specific Styles */
.transformer-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

/* Table Layout - 8 columns for transformer */
.transformer-table-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 1fr 1fr 100px 100px 120px;
  background: #69306d !important;
}

.transformer-table-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 1fr 1fr 100px 100px 120px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f7f7;
}

.transformer-table-row:last-child {
  border-bottom: none;
}

.no-data-transformer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: #f8f7f7;
  color: #9ca3af;
  font-size: 16px;
  font-weight: 500;
  grid-column: span 8;
}

/* Input styles specific to transformer */
.transformer-select,
.transformer-input {
  width: 100%;
  min-width: 0;
}

/* Responsive adjustments for transformer table */
@media (max-width: 1200px) {
  .transformer-table-header,
  .transformer-table-row {
    grid-template-columns: 50px 120px 80px 120px 120px 80px 80px 100px;
    font-size: 12px;
  }

  .table-cell {
    padding: 8px 4px;
  }
}

@media (max-width: 768px) {
  .transformer-table-header,
  .transformer-table-row {
    grid-template-columns: 40px 100px 70px 100px 100px 70px 70px 80px;
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
