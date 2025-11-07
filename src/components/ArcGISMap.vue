<script setup lang="ts">
import "@arcgis/core/assets/esri/themes/light/main.css";

const modalConfirm = useModalConfirmStore();
const { isModalAlert, dataAlert } = storeToRefs(modalConfirm);

const requestStore = useRequestStore();
const { isNewCitySameOffice, requestForm } = storeToRefs(requestStore);

const addressFormStore = useAddressFormStore();
const { addressInformationForm } = storeToRefs(addressFormStore);

const masterDataStore = useMasterDataStore();
const { gisPeaOffice, allPeaOffice } = storeToRefs(masterDataStore);

const { defaultAddress, disable } = defineProps(["defaultAddress", "disable"]);
const latitude = defineModel("latitude", { required: true });
const longitude = defineModel("longitude", { required: true });

const initDefaultAddress = ref("");
const fromDefault = ref(false);
const arcGisMapStore = useArcGisMapStore();
const { centerData, searchData } = storeToRefs(arcGisMapStore);
const viewDiv = shallowRef(null);
const mapView = shallowRef(null);
const searchWidget = shallowRef(null);
const locateWidget = shallowRef(null);
const initComplete = ref(false);
const tooltipShowing = ref(false);
let eventHandles = [];

const { isRequestPage, isSurveyPage, autoForm } = autoAddressInformationForm();

watch(
  () => disable,
  () => {
    if (disable) {
      mapView.value.when(disableMap);
    } else {
      mapView.value.when(enableMap);
    }
  }
);

watch(
  () => latitude.value,
  (newValue) => {
    mapView.value.center = [longitude.value, newValue];
  }
);
watch(
  () => longitude.value,
  (newValue) => {
    mapView.value.center = [newValue, latitude.value];
  }
);

onMounted(async () => {
  const [Map, MapView, TileLayer, Search, Locate] = await Promise.all([
    import("@arcgis/core/Map").then((module) => module.default),
    import("@arcgis/core/views/MapView").then((module) => module.default),
    import("@arcgis/core/layers/TileLayer").then((module) => module.default),
    import("@arcgis/core/widgets/Search").then((module) => module.default),
    import("@arcgis/core/widgets/Locate").then((module) => module.default),
  ]);

  const map = new Map({
    layers: [], // Start with an empty layers array to exclude the default basemap
  });

  const tileLayer = new TileLayer({
    url: "https://map.pea.co.th/arcgis/rest/services/PEA_VECTOR_CACHE/MapServer",
  });
  map.add(tileLayer);
  mapView.value = new MapView({
    container: viewDiv.value,
    map: map,
    center: [
      longitude.value || centerData.value.longitude,
      latitude.value || centerData.value.latitude,
    ],
    zoom: 10,
    minZoom: 2,
    maxZoom: 18,
    navigation: {
      mouseWheelZoomEnabled: false,
      browserTouchPanEnabled: false,
    },
    mapOptions: {
      logo: false,
    },
    constraints: {
      rotationEnabled: false,
      geometry: {
        type: "extent",
        xmin: 95,
        ymin: 5,
        xmax: 106,
        ymax: 21,
      },
    },
  });
  searchWidget.value = new Search({
    view: mapView.value,
    locationEnabled: false,
    popupEnabled: false,
  });

  locateWidget.value = new Locate({
    view: mapView.value,
  });

  mapView.value.watch("center", function (center) {
    centerData.value.latitude = center.latitude;
    centerData.value.longitude = center.longitude;
  });

  if (disable) {
    mapView.value.when(disableMap);
  } else {
    mapView.value.when(enableMap);
  }

  initComplete.value = true;
});

async function getGisPeaOffice(lat, long) {
  await masterDataStore.fetchGisPeaOffice(lat, long);
}

// | ---------------------------------------------
// | V. Uncheck PEA Office start
// | ---------------------------------------------
const selectLocation = async () => {
  callTooltip();
  latitude.value = `${centerData.value.latitude}`;
  longitude.value = `${centerData.value.longitude}`;
};
// | ---------------------------------------------
// | V. Uncheck PEA Office end
// | ---------------------------------------------

// | ---------------------------------------------
// | V. Check PEA Office start
// | ---------------------------------------------
// const selectLocation = async () => {
//   const status = ref(true);

//   if (centerData.value.latitude && centerData.value.longitude) {
//     await getGisPeaOffice(
//       centerData.value.latitude,
//       centerData.value.longitude
//     );
//     if (requestForm.value.pea_office == gisPeaOffice.value.peaOffice) {
//       isNewCitySameOffice.value = true;
//       callTooltip();
//       await autoForm(gisPeaOffice.value.subdistrictId);
//     } else {
//       isNewCitySameOffice.value = false;
//       if (isSurveyPage) {
//         dataAlert.value = {
//           colorText: "primary",
//           colorIcon: "white",
//           title: "แจ้งเตือน",
//           text: "อยู่นอกเหนือพื้นที่ให้บริการ",
//           icon: "warning",
//         };
//         isModalAlert.value = true;
//         status.value = false;
//       } else {
//         callTooltip();
//         if (gisPeaOffice.value.subdistrictId) {
//           await autoForm(gisPeaOffice.value.subdistrictId);
//         } else {
//           masterDataStore.resetAllPeaOffice();
//         }
//       }
//     }
//   }

//   if (status.value) {
//     latitude.value = `${centerData.value.latitude}`;
//     longitude.value = `${centerData.value.longitude}`;
//   } else {
//     mapView.value.center = [
//       longitude.value || centerData.value.longitude,
//       latitude.value || centerData.value.latitude,
//     ];
//   }
// };
// | ---------------------------------------------
// | V. Check PEA Office end
// | ---------------------------------------------

function callTooltip() {
  tooltipShowing.value = true;
  // console.log("tooltipShowing: ", tooltipShowing.value);

  setTimeout(() => {
    tooltipShowing.value = false;
  }, 3000);
}

function disableMap(view) {
  view.popup.actions = [];
  view.ui.remove(searchWidget.value);
  view.ui.remove(locateWidget.value);

  function stopEvtPropagation(event) {
    event.stopPropagation();
  }

  view.ui.components = ["attribution"];
  eventHandles.push(view.on("mouse-wheel", stopEvtPropagation));
  eventHandles.push(view.on("double-click", stopEvtPropagation));
  eventHandles.push(view.on("double-click", ["Control"], stopEvtPropagation));
  eventHandles.push(view.on("drag", stopEvtPropagation));
  eventHandles.push(view.on("drag", ["Shift"], stopEvtPropagation));
  eventHandles.push(view.on("drag", ["Shift", "Control"], stopEvtPropagation));
  eventHandles.push(
    view.on("key-down", (event) => {
      const prohibitedKeys = [
        "+",
        "-",
        "Shift",
        "_",
        "=",
        "ArrowUp",
        "ArrowDown",
        "ArrowRight",
        "ArrowLeft",
      ];
      const keyPressed = event.key;
      if (prohibitedKeys.indexOf(keyPressed) !== -1) {
        event.stopPropagation();
      }
    })
  );
  view.__stopEvtPropagation = stopEvtPropagation;
}

function enableMap(view) {
  view.ui.components = ["zoom", "attribution"];
  view.ui.add(searchWidget.value, "top-right");
  view.ui.add(locateWidget.value, "top-left");

  if (defaultAddress) {
    searchWidget.value.suggest(defaultAddress).then(function (suggestions) {
      if (suggestions && suggestions?.results.length > 0) {
        var suggestions = suggestions.results[0];
        if (suggestions.results?.length > 0) {
          var topSuggestion = suggestions.results[0];
          initDefaultAddress.value = defaultAddress + ", ประเทศไทย";
        } else {
          initDefaultAddress.value = defaultAddress + ", ประเทศไทย";
        }
        searchWidget.value.search(initDefaultAddress.value);
        fromDefault.value = true;
      }
    });
  } else {
    searchWidget.value.search(masterOffice);
    fromDefault.value = true;
  }

  // searchWidget.value.on("search-complete", function (event) {
  //   var results = event.results;
  //   if (results.length > 0) {
  //     if (results[0].results?.length > 0) {
  //       var result = results[0].results[0];
  //       console.log(result);
  //       if (result) {
  //         var attributes = result.feature.attributes;
  //         var geometry = result.feature.geometry;
  //         searchData.value.attributes = attributes;
  //         searchData.value.latitude = geometry.latitude;
  //         searchData.value.longitude = geometry.longitude;
  //         if (!longitude.value) {
  //           selectLocation();
  //         }
  //       }
  //     }
  //   }
  // });
  searchWidget.value.on("select-result", (event) => {
    const selectedFeature = event.result.feature;
    const location = selectedFeature.geometry;
    mapView.value
      .goTo({
        center: location,
        zoom: 10, // adjust the zoom level as needed
      })
      .then(function (suggestions) {
        if (fromDefault.value) {
          selectLocation();

          fromDefault.value = false;
        }
      });
  });

  for (let handle of eventHandles) {
    handle.remove();
  }
  eventHandles = [];
}
</script>

<template>
  <div class="map-view-wrap">
    <div ref="viewDiv" class="map-view"></div>
    <div class="marker" v-if="initComplete">
      <svg
        fill="#e00000"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 395.71 395.71"
        xml:space="preserve"
        stroke="#e00000"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <g>
            <path
              d="M197.849,0C122.131,0,60.531,61.609,60.531,137.329c0,72.887,124.591,243.177,129.896,250.388l4.951,6.738 c0.579,0.792,1.501,1.255,2.471,1.255c0.985,0,1.901-0.463,2.486-1.255l4.948-6.738c5.308-7.211,129.896-177.501,129.896-250.388 C335.179,61.609,273.569,0,197.849,0z M197.849,88.138c27.13,0,49.191,22.062,49.191,49.191c0,27.115-22.062,49.191-49.191,49.191 c-27.114,0-49.191-22.076-49.191-49.191C148.658,110.2,170.734,88.138,197.849,88.138z"
            ></path>
          </g>
        </g>
      </svg>
    </div>
    <div
      class="col-button q-mb-md text-center btn-select-location"
      v-if="initComplete"
    >
      <span class="tooltip_custom" :class="tooltipShowing ? 'show' : ''"
        >บันทึกสำเร็จ</span
      >
      <q-btn
        flat
        label="เลือกตำแหน่ง"
        class="q-mx-auto font-size-normal q-padding bg-secondary width-270 width-xs-200 text-weight-600 text-white gis-submit-btn"
        @click="selectLocation"
        :disable="disable"
      />
    </div>
  </div>
  <!-- {{ addressInformationForm.address_district_id }} -->
  <!-- <div class="row">
    <div class="col">
      searchData :
      <pre>{{ searchData }}</pre>
    </div>
    <div class="col">
      centerData :
      <pre>{{ centerData }}</pre>
    </div>
    <div class="col">
      FormData :
      <pre>{{ { longitude, latitude } }}</pre>
    </div>
  </div> -->
</template>

<style lang="scss">
@import "@style";

.map-view-wrap {
  height: 50vh;
  width: 100%;
  position: relative;
  background-color: white;
}

.map-view {
  height: 100%;
  width: 100%;
}

.marker {
  position: absolute;
  top: calc(50% - 15px);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  z-index: 10;
}

.btn-select-location {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0);

  .tooltip_custom {
    font-size: 12px;
    font-weight: bold;
    padding: 5px 0;
    width: 100%;
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translate(-50%, -10px);
    background-color: rgb(0, 0, 0, 0.417);
    @include border-radius(4px);
    color: white;
    opacity: 0;
    transition: all 0.2s ease-in-out;

    &.show {
      opacity: 1;
      transform: translate(-50%, 0px);
      transition: all 0.2s ease-in-out;
    }
  }
}
</style>
