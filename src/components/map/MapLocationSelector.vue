<script setup lang="ts">
import {ref, watch, nextTick, onUnmounted, onMounted} from 'vue'
import {Loader} from '@googlemaps/js-api-loader'

interface Props {
  latitude: number
  longitude: number
  address?: string
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  'update:location': [lat: number, lng: number]
}>()

const mapLocationContainer = ref<HTMLDivElement>()
const autocompleteInput = ref<HTMLInputElement>()
const placesContainer = ref<HTMLDivElement>()
const markerPos = ref({lat: props.latitude, lng: props.longitude})
const address = ref(props.address || "")

let map: google.maps.Map | null = null
let marker: google.maps.Marker | null = null
let autocomplete: google.maps.places.Autocomplete | null = null
let geocoder: google.maps.Geocoder | null = null

onMounted(async () => {
  markerPos.value = {lat: props.latitude, lng: props.longitude}
  // Reset map instance
  map = null
  marker = null
  autocomplete = null

  await nextTick()
  // Wait for dialog to fully render
  setTimeout(async () => {
    await initializeMap()
  }, 500)
})

const initializeMap = async () => {
  if (!mapLocationContainer.value || !autocompleteInput.value) return

  try {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    })

    await loader.load()

    // Initialize geocoder
    geocoder = new google.maps.Geocoder()

    // Clear container first
    mapLocationContainer.value.innerHTML = ''

    map = new google.maps.Map(mapLocationContainer.value, {
      center: {lat: markerPos.value.lat, lng: markerPos.value.lng},
      zoom: 18,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })

    marker = new google.maps.Marker({
      position: {lat: markerPos.value.lat, lng: markerPos.value.lng},
      map: map,
      draggable: true
    })

    // Force map resize
    setTimeout(() => {
      if (map) {
        google.maps.event.trigger(map, 'resize')
        map.setCenter({lat: markerPos.value.lat, lng: markerPos.value.lng})
      }
    }, 100)

    // Initialize autocomplete
    autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {
      componentRestrictions: {country: 'th'},
      fields: ['geometry', 'name', 'formatted_address']
    })

    // Move pac-container into modal
    setTimeout(() => {
      const pacContainer = document.querySelector('.pac-container') as HTMLElement
      if (pacContainer && placesContainer.value) {
        placesContainer.value.appendChild(pacContainer)
      }
    }, 100)

    // Event listeners
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete?.getPlace()
      if (place?.geometry?.location) {
        const position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        address.value = place.formatted_address || place.name || ''
        map?.setCenter(position)
        marker?.setPosition(position)
        markerPos.value = position
      }
    })

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng && geocoder) {
        const position = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
        marker?.setPosition(position)
        markerPos.value = position

        // Reverse geocoding to get address
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            address.value = results[0].formatted_address
          }
        })
      }
    })

    marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
      if (e.latLng && geocoder) {
        markerPos.value = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }

        // Reverse geocoding to get address when marker is dragged
        geocoder.geocode({ location: e.latLng }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            address.value = results[0].formatted_address
          }
        })
      }
    })

  } catch (error) {
    console.error('Error loading Google Maps:', error)
  }
}

const selectLocation = () => {
  emit('update:location', markerPos.value.lat, markerPos.value.lng, address.value || "")
}

const closeModal = () => {
  emit('close')
}

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        map?.setCenter(pos)
        marker?.setPosition(pos)
        markerPos.value = pos
      }
    )
  }
}

const centerToMarker = () => {
  if (map) {
    map.setCenter(markerPos.value)
  }
}

const openGoogleMaps = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`
        const destination = `${markerPos.value.lat},${markerPos.value.lng}`
        const url = `https://www.google.com/maps/dir/${origin}/${destination}`
        window.open(url, '_blank')
      },
      () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${markerPos.value.lat},${markerPos.value.lng}`
        window.open(url, '_blank')
      }
    )
  } else {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${markerPos.value.lat},${markerPos.value.lng}`
    window.open(url, '_blank')
  }
}

onUnmounted(() => {
  // Clean up pac-container
  const pacContainer = document.querySelector('.pac-container') as HTMLElement
  if (pacContainer) {
    document.body.appendChild(pacContainer)
  }
})
</script>

<template>
  <q-dialog
    :model-value="open"
    @update:model-value="closeModal"
  >
    <q-card class="full-width full-height !max-w-[80%] !w-[50%]">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">เลือกตำแหน่งบนแผนที่</div>
        <q-space/>
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="closeModal"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="relative my-4 map-location-search">
          <input
            ref="autocompleteInput"
            outlined
            placeholder="ค้นหาสถานที่..."
            class="mb-4 p-2 w-full border-1"
            type="text"
          />
          <div ref="placesContainer" class="absolute left-0 z-50"/>
        </div>

        <div class="relative">
          <div
            ref="mapLocationContainer"
            class="w-full h-[500px] rounded-lg border"
          />

          <div class="absolute bottom-20 right-2 flex flex-col gap-1">
            <q-btn
              round
              color="white"
              text-color="dark"
              icon="my_location"
              size="md"
              @click="getCurrentLocation"
              class="shadow-md"
            />
            <q-btn
              round
              color="white"
              text-color="dark"
              icon="center_focus_strong"
              size="md"
              @click="centerToMarker"
              class="shadow-md"
            />
            <q-btn
              round
              color="white"
              text-color="dark"
              icon="directions"
              size="md"
              @click="openGoogleMaps"
              class="shadow-md"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="ยกเลิก"
          @click="closeModal"
        />
        <q-btn
          color="primary"
          label="เลือกตำแหน่ง"
          @click="selectLocation"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.map-location-search {
  .pac-container {
    left: 0 !important;
    top: 0 !important;
  }
}
</style>
