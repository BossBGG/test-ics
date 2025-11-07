<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

const props = defineProps(['defaultAddress', 'disable'])

const latitude = defineModel('latitude', { required: true })
const longitude = defineModel('longitude', { required: true })

const arcGisMapStore = useArcGisMapStore()
const { centerData } = storeToRefs(arcGisMapStore)

// Reactive variables
const mapContainer = ref<HTMLElement>()
const searchInputRef = ref<any>() // QInput component ref
const error = ref('')
const showMapDialog = ref(false)
const showSuccessDialog = ref(false)
const tempLatitude = ref<number>()
const tempLongitude = ref<number>()
const searchInput = ref('')

// Map instance
let map: google.maps.Map | null = null
let marker: google.maps.Marker | null = null
let dialogMap: google.maps.Map | null = null
let dialogMarker: google.maps.Marker | null = null
let placeAutocomplete: HTMLElement | null = null
let placeSelectHandler: ((event: Event) => void) | null = null

watch(() => [map, longitude.value, latitude.value], () => {
  if (map && typeof longitude.value === 'number' && typeof latitude.value === 'number') {
    map.setCenter({ lat: latitude.value, lng: longitude.value })
  }
})

// Initialize Google Maps
async function initializeMap() {
  try {
    error.value = ''

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      version: 'beta',
      libraries: ['places', 'maps'],
    })

    await loader.load()

    if (!mapContainer.value) {
      throw new Error('Map container not found')
    }

    map = new google.maps.Map(mapContainer.value, {
      center: {
        lat: Number(latitude.value || centerData.value.latitude),
        lng: Number(longitude.value || centerData.value.longitude),
      },
      zoom: 12,
      minZoom: 2,
      maxZoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    })

    const markerIcon = {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z',
      fillColor: '#69306D',
      fillOpacity: 1,
      strokeColor: '#69306D',
      strokeWeight: 2,
      scale: 2,
      labelOrigin: new google.maps.Point(12, 9),
    }

    marker = new google.maps.Marker({
      position: {
        lat: Number(latitude.value || centerData.value.latitude),
        lng: Number(longitude.value || centerData.value.longitude),
      },
      map,
      title: props.defaultAddress,
      icon: markerIcon,
    })
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load map'
  }
}

onMounted(() => {
  nextTick(() => {
    initializeMap()
  })
})

onUnmounted(() => {
  if (map) {
    map = null
  }
  if (placeAutocomplete && placeSelectHandler) {
    placeAutocomplete.removeEventListener('gmp-select', placeSelectHandler)
    placeAutocomplete = null
    placeSelectHandler = null
  }
})

// Initialize Google Places Autocomplete
async function initializeAutocomplete() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 300))

  try {
    const searchOverlay = document.querySelector('.search-overlay')
    if (!searchOverlay) return

    await google.maps.importLibrary('places')

    const { PlaceAutocompleteElement } = google.maps.places as any
    placeAutocomplete = new PlaceAutocompleteElement({
      componentRestrictions: { country: ['th'] },
    })

    if (!placeAutocomplete) return

    placeAutocomplete.style.width = '100%'

    const qInputElement = searchInputRef.value?.$el
    if (qInputElement) {
      qInputElement.style.display = 'none'
      searchOverlay.appendChild(placeAutocomplete)
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    placeSelectHandler = async (event: Event) => {
      const _place = (event as any).placePrediction.toPlace()
      const placeEvent = event as any
      const place = placeEvent.place || _place
      
      if (!place) return

      try {
        await place.fetchFields({
          fields: ['displayName', 'location', 'formattedAddress'],
        })

        if (!place.location) return

        const lat = place.location.lat()
        const lng = place.location.lng()

        tempLatitude.value = lat
        tempLongitude.value = lng

        if (dialogMap && dialogMarker) {
          const newPosition = { lat, lng }
          dialogMap.setCenter(newPosition)
          dialogMap.setZoom(17)
          dialogMarker.setPosition(newPosition)
        }

        if (place.displayName) {
          searchInput.value = place.displayName
        }
      }
      catch (error) {
        console.error('Error processing place:', error)
      }
    }

    if (placeAutocomplete && placeSelectHandler) {
      placeAutocomplete.addEventListener('gmp-select', placeSelectHandler)
    }
  }
  catch (error) {
    console.error('Error initializing autocomplete:', error)
  }
}

function openMapDialog() {
  tempLatitude.value = Number(latitude.value) || Number(centerData.value.latitude)
  tempLongitude.value = Number(longitude.value) || Number(centerData.value.longitude)

  showMapDialog.value = true

  nextTick(() => {
    setTimeout(() => {
      initializeDialogMap()
    }, 100)
  })
}

function closeMapDialog() {
  tempLatitude.value = Number(latitude.value)
  tempLongitude.value = Number(longitude.value)
  searchInput.value = ''
  
  if (placeAutocomplete && placeSelectHandler) {
    placeAutocomplete.removeEventListener('gmp-select', placeSelectHandler)
    placeAutocomplete.remove()
    placeAutocomplete = null
    placeSelectHandler = null
  }
  
  const qInputElement = searchInputRef.value?.$el
  if (qInputElement) {
    qInputElement.style.display = ''
  }
  
  showMapDialog.value = false
}

function closeSuccessDialog() {
  showSuccessDialog.value = false
}

async function initializeDialogMap() {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))

    const dialogContainer = document.getElementById('dialog-map-container')
    if (!dialogContainer)
      return

    dialogMap = new google.maps.Map(dialogContainer, {
      center: {
        lat: Number(tempLatitude.value || centerData.value.latitude),
        lng: Number(tempLongitude.value || centerData.value.longitude),
      },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    })

    const markerIcon = {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z',
      fillColor: '#69306D',
      fillOpacity: 1,
      strokeColor: '#69306D',
      strokeWeight: 2,
      scale: 2,
      labelOrigin: new google.maps.Point(12, 9),
    }

    dialogMarker = new google.maps.Marker({
      position: {
        lat: Number(tempLatitude.value || centerData.value.latitude),
        lng: Number(tempLongitude.value || centerData.value.longitude),
      },
      map: dialogMap,
      draggable: true,
      icon: markerIcon,
    })

    dialogMarker.addListener('dragend', () => {
      const position = dialogMarker?.getPosition()
      if (position) {
        tempLatitude.value = position.lat()
        tempLongitude.value = position.lng()
      }
    })

    dialogMap.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng && dialogMarker) {
        dialogMarker.setPosition(event.latLng)
        tempLatitude.value = event.latLng.lat()
        tempLongitude.value = event.latLng.lng()
      }
    })

    await initializeAutocomplete()
  }
  catch (err) {
    console.error('Error initializing dialog map:', err)
  }
}

function saveLocation() {
  if (tempLatitude.value !== undefined && tempLongitude.value !== undefined) {
    latitude.value = Number(tempLatitude.value)
    longitude.value = Number(tempLongitude.value)

    if (map && marker) {
      const newPosition = {
        lat: Number(tempLatitude.value),
        lng: Number(tempLongitude.value),
      }
      marker.setPosition(newPosition)
      map.setCenter(newPosition)
    }

    showSuccessDialog.value = true
  }

  showMapDialog.value = false
}
</script>

<template>
  <div class="google-map-container">
    <div
      ref="mapContainer"
      class="google-map"
    >
      <div if="error" class="map-error">
        <q-icon name="error" color="negative" size="40px" />
        <div class="q-mt-sm text-negative text-subtitle2">
          {{ error }}
        </div>
      </div>
    </div>

    <div v-if="!disable" class="map-center-button">
      <q-btn
        color="primary"
        icon="mdi-map-marker"
        size="md"
        style="width: 270px;"
        @click="openMapDialog"
      >
        แก้ไขหมุด
      </q-btn>
    </div>

    <q-dialog v-model="showMapDialog" persistent>
      <q-card style="min-width: 80vw; min-height: 70vh; height: max-content;">
        <q-card-section class="q-pb-none row items-center justify-center" style="margin:  20px 0;">
          <div class="text-h6 text-primary">
            เลือกตำแหน่งสถานที่ขอรับบริการ
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div style="width: 100%; height: 500px; position: relative;">
            <div
              id="dialog-map-container"
              style="width: 100%; height: 500px; position: relative;"
            />
            <div class="search-overlay">
              <q-input
                ref="searchInputRef"
                v-model="searchInput"
                filled
                placeholder="ค้นหาสถานที่"
                dense
                bg-color="white"
              >
                <template #append>
                  <q-icon name="mdi-magnify" style="color: #994C80;" />
                </template>
              </q-input>
            </div>
          </div>
          <div style="text-align: right;margin-top: 16px;">
            <a target="_blank" :href="`https://www.google.com/maps/search/${tempLatitude},${tempLongitude}`">
              {{ tempLatitude }}, {{ tempLongitude }}
            </a>
          </div>
        </q-card-section>

        <q-card-actions align="center" style="margin: 40px 0;">
          <q-btn v-close-popup style="width: 270px;" label="ยกเลิก" @click="closeMapDialog" />
          <q-btn color="primary" style="width: 270px;" label="บันทึกการแก้ไข" @click="saveLocation" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSuccessDialog">
      <q-card style="min-width: 700px;min-height: 300px;">
        <q-card-section style="margin-top: 40px;" class="q-pb-none row items-center justify-center">
          <q-icon name="mdi-check-circle" color="primary" size="58px" />
        </q-card-section>

        <q-card-section class="text-center">
          <div class="text-h6 q-mt-sm text-primary">
            แก้ไขหมุดเรียบร้อยแล้ว
          </div>
        </q-card-section>

        <q-card-actions align="center" style="margin-top: 32px;">
          <q-btn v-close-popup color="primary" label="บันทึกการแก้ไข" style="min-width: 270px;min-height: 48px;" @click="closeSuccessDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped>
.google-map-container {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 400px;
}

.google-map {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 400px;
}

.map-loading,
.map-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.map-center-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.google-map:hover ~ .map-center-button,
.google-map-container:hover .map-center-button {
  opacity: 1;
  pointer-events: auto;
}

.search-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 99999 !important;
  width: 300px;
}
</style>

<style lang="scss">
.search-overlay .q-field__control {
  border-radius: 4px;
}
</style>
