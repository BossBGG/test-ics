<template>
  <q-dialog v-model="dialogModel">
    <q-card class="!max-w-[65%]">
      <!-- Header -->
      <q-card-section class="row items-center q-pb-none mb-2">
        <div class="text-h6">รายละเอียด Package</div>
        <q-space/>
        <q-btn icon="close" @click="$emit('update:modelValue', false)" flat round dense v-close-popup/>
      </q-card-section>

      <q-card-section class="q-pt-none" style="height: calc(100vh - 120px)">
        <q-table
          :rows="tableData"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 0 }"
          hide-pagination
          class="full-height"
          table-header-class="bg-purple text-white"
          virtual-scroll
          :virtual-scroll-item-size="48"
          :virtual-scroll-sticky-size-start="48"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-purple">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-white text-center"
                :style="getColumnStyle(col.name)"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="props.row.type === 'price' ? 'bg-grey-2' : ''"
            >
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-center"
                :style="getColumnStyle(col.name)"
              >
                <template v-if="col.name === 'id' && props.row.type === 'price'">
                  <!-- Empty for price row -->
                </template>
                <template v-else-if="col.name === 'name'">
                  <div :class="props.row.type === 'price' ? 'text-weight-bold text-left' : 'text-left'">
                    {{ col.value }}
                  </div>
                </template>
                <template v-else-if="col.name.startsWith('package') && props.row.type === 'price'">
                  <div class="text-weight-bold">
                    {{ getPackagePrice(col.name) }}
                  </div>
                </template>
                <template v-else-if="col.name.startsWith('package')">
                  <q-icon
                    :name="col.value ? 'check_circle' : 'cancel'"
                    :color="col.value ? 'green' : 'red'"
                    size="sm"
                  />
                </template>
                <template v-else>
                  {{ col.value }}
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'

// Types
interface PackageFeature {
  id: number
  name: string
  package1: boolean
  package2: boolean
  package3: boolean
  package4: boolean
}

interface PackageData {
  id: string
  name: string
  price: number
  features: PackageFeature[]
}

interface ExtendedPackageFeature extends PackageFeature {
  type: 'feature' | 'price'
}

// Props
interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Computed
const dialogModel = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const packageFeatures: PackageFeature[] = [
  {
    id: 1,
    name: "ตรวจสอบจุดสัมผัสทางไฟฟ้าและจุดต่อด้วยกล้อง Thermal Viewer",
    package1: true,
    package2: true,
    package3: true,
    package4: false,
  },
  {
    id: 2,
    name: "บำรุงรักษาอุปกรณ์แรงสูงและแก้ไขจุดร้อน",
    package1: true,
    package2: true,
    package3: true,
    package4: true,
  },
  {
    id: 3,
    name: "ตรวจสอบและแก้ไขค่ากราวด์",
    package1: true,
    package2: true,
    package3: true,
    package4: true,
  },
  {
    id: 4,
    name: "บำรุงรักษาหม้อแปลง",
    package1: true,
    package2: true,
    package3: true,
    package4: true,
  },
  {
    id: 5,
    name: "บำรุงรักษาตู้ MOB",
    package1: true,
    package2: true,
    package3: true,
    package4: true,
  },
  {
    id: 6,
    name: "ตัดกิ่งไม้ใกล้แนวสายไฟ",
    package1: true,
    package2: true,
    package3: true,
    package4: true,
  },
  {
    id: 7,
    name: "ตรวจจุดต่อและขันแน่น",
    package1: true,
    package2: true,
    package3: true,
    package4: true,
  },
  {
    id: 8,
    name: "ตรวจสอบข้อมูลการใช้โหลด (Load Profile)",
    package1: true,
    package2: false,
    package3: false,
    package4: false,
  },
  {
    id: 9,
    name: "ให้คำแนะนำการอนุรักษ์พลังงาน และความปลอดภัย",
    package1: true,
    package2: true,
    package3: true,
    package4: true,
  },
  {
    id: 10,
    name: "จัดทำรายงานผลการตรวจสอบและตรวจวัดทางวิศวกรรม",
    package1: true,
    package2: true,
    package3: true,
    package4: true,
  },
  {
    id: 11,
    name: "ตรวจสอบจุดร้อนที่ทำการแก้ไขด้วย ไมโครโอห์มมิเตอร์",
    package1: true,
    package2: true,
    package3: true,
    package4: false,
  },
];

const packages: PackageData[] = [
  {
    id: "package1",
    name: "Package 1",
    price: 35000,
    features: packageFeatures,
  },
  {
    id: "package2",
    name: "Package 2",
    price: 25000,
    features: packageFeatures,
  },
  {
    id: "package3",
    name: "Package 3",
    price: 20000,
    features: packageFeatures,
  },
  {
    id: "package4",
    name: "Package 4",
    price: 10000,
    features: packageFeatures,
  },
]

const tableData = computed((): ExtendedPackageFeature[] => {
  const featuresData: ExtendedPackageFeature[] = packageFeatures.map(
    (feature) => ({
      ...feature,
      type: 'feature' as const,
    })
  )

  const priceRow: ExtendedPackageFeature = {
    id: 999,
    name: "ราคา",
    package1: true,
    package2: true,
    package3: true,
    package4: true,
    type: 'price' as const,
  }

  return [...featuresData, priceRow]
})

// Table columns for desktop
const columns = [
  {
    name: 'id',
    label: 'ลำดับที่',
    field: 'id',
    align: 'center' as const,
  },
  {
    name: 'name',
    label: 'กิจกรรม',
    field: 'name',
    align: 'left' as const,
  },
  {
    name: 'package1',
    label: 'Package 1',
    field: 'package1',
    align: 'center' as const,
  },
  {
    name: 'package2',
    label: 'Package 2',
    field: 'package2',
    align: 'center' as const,
  },
  {
    name: 'package3',
    label: 'Package 3',
    field: 'package3',
    align: 'center' as const,
  },
  {
    name: 'package4',
    label: 'Package 4',
    field: 'package4',
    align: 'center' as const,
  },
]

const getColumnStyle = (columnName: string) => {
  if (columnName === 'id') {
    return {width: '80px', minWidth: '80px'}
  } else if (columnName === 'name') {
    return {width: '400px', minWidth: '400px'}
  } else {
    return {width: '140px', minWidth: '140px'}
  }
}

const getPackagePrice = (packageName: string): string => {
  const pkg = packages.find(p => p.id === packageName)
  return pkg ? pkg.price.toLocaleString() : '0'
}
</script>

<style scoped>
.bg-purple {
  background-color: #69306D !important;
}
</style>
