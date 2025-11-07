<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import MapLocationSelector from './MapLocationSelector.vue'

interface Props {
  latitude: number
  longitude: number
  options?: { showEditable?: boolean }
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({ showEditable: true }),
  disabled: false
})

const emit = defineEmits<{
  'update:location': [lat: number, lng: number, adr: string]
}>()

const mapContainer = ref<HTMLDivElement>()
const isModalOpen = ref(false)
let map: google.maps.Map | null = null
let marker: google.maps.Marker | null = null

const initializeMap = async () => {
  if (!mapContainer.value) return

  try {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    })

    await loader.load()

    map = new google.maps.Map(mapContainer.value, {
      center: { lat: props.latitude, lng: props.longitude },
      zoom: 18,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })

    marker = new google.maps.Marker({
      position: { lat: props.latitude, lng: props.longitude },
      map: map,
      draggable: false
    })
  } catch (error) {
    console.error('Error loading Google Maps:', error)
  }
}

const updateMapPosition = () => {
  if (map && marker) {
    const position = { lat: props.latitude, lng: props.longitude }
    map.setCenter(position)
    marker.setPosition(position)
  }
}

const openLocationSelector = () => {
  if (!props.disabled) {
    isModalOpen.value = true
  }
}

const handleLocationUpdate = (lat: number, lng: number, address: string) => {
  emit('update:location', lat, lng, address)
  isModalOpen.value = false
}

watch([() => props.latitude, () => props.longitude], updateMapPosition)

onMounted(async () => {
  await nextTick()
  initializeMap()
})
</script>

<template>
  <div class="map-display">
    <div class="flex justify-between items-center mb-4">
      <q-btn
        v-if="options?.showEditable"
        :disable="disabled"
        color="primary"
        outline
        icon="edit_location"
        label="ตรวจสอบ/แก้ไขตำแหน่ง"
        @click="openLocationSelector"
        class="!bg-[#994C80] w-full text-white !p-4 rounded-[8px]"
      />
    </div>

    <div
      ref="mapContainer"
      class="w-full h-[300px] rounded-lg border"
    />

    <MapLocationSelector
      v-if="isModalOpen"
      :open="isModalOpen"
      :latitude="latitude"
      :longitude="longitude"
      @close="isModalOpen = false"
      @update:location="handleLocationUpdate"
    />
  </div>
</template>
