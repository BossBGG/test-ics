<template>
  <q-dialog :model-value="modelValue" @update:model-value="closeDialog" persistent>
    <q-card style="width: 800px; max-width: 90vw;" class="shadow-xl rounded-lg">
      
      <q-card-section class="flex justify-between items-center bg-gray-50">
        <div class="text-h6 font-medium">เพิ่มรายการวัสดุอุปกรณ์</div>
        <q-btn icon="close" flat round dense @click="closeDialog" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="pt-4 pb-0">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="sets" label="ชุดติดตั้งอุปกรณ์" />
          <q-tab name="master" label="ค้นหาจากรหัส/ชื่อ" />
        </q-tabs>

        <q-separator class="mt-2" />

        <q-tab-panels v-model="activeTab" animated class="pt-4">
          <q-tab-panel name="sets" class="p-0">
            <MaterialSearchWrapper
              type="sets"
              label="ชุดติดตั้งอุปกรณ์"
              placeholder="ค้นหาชุดติดตั้งอุปกรณ์"
              :office="$keycloak.idTokenParsed?.azp?.toUpperCase() || ''"
              v-model="materialSetUuid"
              @update:setName="materialSetName = $event"
            />
          </q-tab-panel>
          
          <q-tab-panel name="master" class="p-0">
            <MaterialSearchWrapper
              type="search"
              label="ค้นหาจากรหัส/ชื่อ"
              placeholder="พิมพ์รหัส หรือ ชื่อวัสดุอุปกรณ์..."
              v-model="searchText"
              :office="''"
            />

          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pt-none" style="max-height: 400px; overflow-y: auto;">
        <q-inner-loading :showing="loading" class="bg-white bg-opacity-75">
          <q-spinner-dots size="50px" color="primary" />
        </q-inner-loading>

        <div v-if="!loading && paginatedResults.length > 0">
          <q-list separator>
            <q-item v-for="item in paginatedResults" :key="item.code" class="py-4 px-2">
              <q-item-section side top class="pt-2">
                <q-checkbox 
                  :model-value="!!selectedItems[item.code]"
                  @update:model-value="toggleSelection(item, $event)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-semibold text-base">{{ item.name }}</q-item-label>
                <q-item-label caption class="text-sm">
                  รหัส: {{ item.code }} | คงเหลือ: {{ item.availableStock || 0 }} {{ item.unit }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-right">
                  <div class="text-sm">{{ (item.quantity || 1) }} {{ item.unit }}</div>
                  <div class="font-bold text-base text-primary">{{ (item.price && typeof item.price === 'number') ? item.price.toFixed(2) : '0.00' }} บาท</div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        
        <div v-if="!loading && paginatedResults.length === 0" class="text-center text-gray-500 p-8">
          <div v-if="activeTab === 'sets' && !materialSetUuid">
            <q-icon name="inventory_2" size="4em" class="text-gray-300" />
            <div class="mt-2">กรุณาเลือกชุดติดตั้งอุปกรณ์</div>
          </div>
          <div v-else-if="activeTab === 'master' && !debouncedSearchText">
             <q-icon name="search" size="4em" class="text-gray-300" />
            <div class="mt-2">กรุณาค้นหาจากรหัสหรือชื่อ</div>
          </div>
          <div v-else>
            <q-icon name="highlight_off" size="4em" class="text-gray-300" />
            <div class="mt-2">ไม่พบรายการวัสดุอุปกรณ์</div>
          </div>
        </div>
      </q-card-section>
      
      <q-card-section v-if="!loading && totalPages > 1" class="flex justify-center py-2">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="5"
          direction-links
          flat
          color="primary"
          active-color="primary"
          class="text-sm"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="between" class="p-4 bg-gray-50">
        <div class="text-base font-medium">
          รายการที่เลือก ({{ totalSelected }} รายการ)
        </div>
        <div>
          <q-btn flat label="ยกเลิก" color="negative" @click="closeDialog" class="mr-2" />
          <q-btn 
            unelevated 
            label="เพิ่ม" 
            color="primary" 
            @click="handleAddMaterials" 
            :disable="totalSelected === 0"
            icon="add"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import {
  QDialog, QCard, QCardSection, QCardActions, QBtn, QSeparator,
  QTabs, QTab, QTabPanels, QTabPanel, QInnerLoading, QSpinnerDots,
  QList, QItem, QItemSection, QItemLabel, QCheckbox, QPagination,
  QIcon
} from 'quasar';
import MaterialSearchWrapper from './MaterialSearchWrapper.vue';
// (กรุณาตรวจสอบ Path ให้ถูกต้อง)
import { getMaterialSets, getMaterialMasterSets } from '~/api/material_equipment_api';
import { MaterialEquipmentObj } from '~/api/types'; 
import { debounce } from 'lodash-es';


interface MaterialSetItem {
  uuid: string;
  name: string;
  materialAndEquipment: MaterialEquipmentObj[];
}
interface ApiResponse<T> {
  status: number;
  data: {
    data: T;
  };
}


const props = defineProps<{
  modelValue: boolean; 
  existingMaterials?: MaterialEquipmentObj[]; 
}>();

const emit = defineEmits(['update:modelValue', 'add-materials']);


const activeTab = ref<'sets' | 'master'>('sets');
const materialSetUuid = ref<string | null>(null);
const materialSetName = ref<string>('');
const searchText = ref<string>('');
const debouncedSearchText = ref<string>('');

const loading = ref(false);
const allResults = ref<MaterialEquipmentObj[]>([]);
const selectedItems = ref<Record<string, MaterialEquipmentObj>>({}); // Use code as key

const currentPage = ref(1);
const pageSize = ref(10); 

const totalSelected = computed(() => Object.keys(selectedItems.value).length);

const totalPages = computed(() => {
  return Math.ceil(allResults.value.length / pageSize.value);
});

const paginatedResults = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return allResults.value.slice(startIndex, endIndex);
});


const resetState = () => {
  activeTab.value = 'sets';
  materialSetUuid.value = null;
  searchText.value = '';
  debouncedSearchText.value = '';
  allResults.value = [];
  selectedItems.value = {};
  currentPage.value = 1;
  loading.value = false;
};

const closeDialog = () => {
  emit('update:modelValue', false);
  setTimeout(resetState, 300);
};

const handleAddMaterials = () => {
  const materialsToAdd = Object.values(selectedItems.value);
  emit('add-materials', materialsToAdd);
  closeDialog();
};

const toggleSelection = (item: MaterialEquipmentObj, isSelected: boolean) => {
  if (isSelected) {
    selectedItems.value[item.code] = item;
  } else {
    delete selectedItems.value[item.code];
  }
};

const fetchData = async () => {
  loading.value = true;
  allResults.value = [];
  currentPage.value = 1;
  selectedItems.value = {}; 

  try {
    let rawResults: MaterialEquipmentObj[] = [];
    
    if (activeTab.value === 'sets') {
      if (!materialSetUuid.value) {
        loading.value = false;
        return;
      }
      const response = await getMaterialSets('', $keycloak.idTokenParsed?.azp?.toUpperCase() || '') as ApiResponse<{ items: MaterialSetItem[] }>;
      const set = response.data.data.items.find(s => s.uuid === materialSetUuid.value);
      if (set) {
        rawResults = set.materialAndEquipment;
      }
    } else if (activeTab.value === 'master') {
      if (!debouncedSearchText.value) {
        loading.value = false;
        return;
      }
      const response = await getMaterialMasterSets(debouncedSearchText.value) as ApiResponse<MaterialEquipmentObj[]>;
      if (response.data.data) {
        rawResults = response.data.data;
      }
    }

    if (props.existingMaterials && props.existingMaterials.length > 0) {
      const existingCodes = new Set(props.existingMaterials.map(m => m.code));
      allResults.value = rawResults.filter(r => !existingCodes.has(r.code));
    } else {
      allResults.value = rawResults;
    }

  } catch (error) {
    console.error('Failed to fetch materials:', error);
    allResults.value = [];
  } finally {
    loading.value = false;
  }
};

watch(activeTab, () => {
  materialSetUuid.value = null;
  searchText.value = '';
  debouncedSearchText.value = '';
  allResults.value = [];
  selectedItems.value = {};
  currentPage.value = 1;
});

watch(searchText, debounce((newVal) => {
  debouncedSearchText.value = newVal || '';
}, 500));

watch([materialSetUuid, debouncedSearchText], () => {
  nextTick(fetchData);
});
</script>

<style scoped>
.q-card {
  border-radius: 8px;
}
.q-tab-panel {
  padding-left: 0;
  padding-right: 0;
}
</style>