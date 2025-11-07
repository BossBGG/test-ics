<script setup lang="ts">
const props = defineProps(["customClass", "links"]);
const isPopupShow = ref(false);
const img = ref("");
const fileSizes = ref([]);
const fileMap = ref([]);

async function openPopup(file) {
  const [path, fileName] = file.link.split("/");
  const newUrl = `${import.meta.env.VITE_API_URL}external/file${
    path ? "/" + path : ""
  }/${fileName}?apiKey=${import.meta.env.VITE_API_KEY}`;

  if (file.isPDF) {
    window.open(newUrl + "&preview=true", "_blank");
  } else {
    isPopupShow.value = true;
    img.value = newUrl;
  }
}

function closePopup() {
  isPopupShow.value = false;
}

async function downloadImage(link) {
  const [path, fileName] = link.split("/");
  window.open(
    `${import.meta.env.VITE_API_URL}external/file${
      path ? "/" + path : ""
    }/${fileName}?apiKey=${import.meta.env.VITE_API_KEY}`,
    "_blank"
  );
}

async function getFileSize(link) {
  const [path, fileName] = link.split("/");

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}external/file${
        path ? "/" + path : ""
      }/${fileName}?apiKey=${import.meta.env.VITE_API_KEY}`
    );
    const blob = await response.blob();
    return Math.round(blob.size / 1024);
  } catch (error) {
    return null;
  }
}

async function getFileSizes() {
  if (props.links) {
    const sizes = await Promise.all(
      props.links.map((link) => getFileSize(link))
    );
    return sizes;
  }
}

onMounted(async () => {
  if (props.links && props.links != null && props.links != "") {
    fileSizes.value = await getFileSizes();

    fileMap.value = props.links.map((link) => ({
      link,
      isPDF: link.toLowerCase().endsWith(".pdf"),
    }));
  }
});
</script>

<template>
  <div
    v-if="fileMap.length > 0"
    v-for="(file, index) in fileMap"
    :key="index"
    :class="props.customClass"
    class="box_file"
  >
    <div class="col-12 col-xs-6 col-md-8 col-lg-9">
      <q-input
        filled
        bg-color="white"
        color="primary"
        label-color="grey-14"
        readonly
        hide-bottom-space
        :label="file.link ? 'พบรายการแนบ' : 'ไม่พบรายการแนบ'"
        class="border_dashed input_filled_custom"
        :hint="
          fileSizes[index] !== undefined
            ? `${fileSizes[index]} KB`
            : 'Loading...'
        "
      >
        <template #prepend>
          <q-icon name="description" />
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-4 col-sm-8 col-lg-3">
      <div class="row">
        <div class="q-pa-sm col-6">
          <q-btn
            flat
            label="View"
            icon="visibility"
            class="bg-secondary q-px-sm btn-style-icon width-100 text-capitalize text-white"
            @click="openPopup(file)"
          />
        </div>
        <div class="q-pa-sm col-6">
          <q-btn
            flat
            icon="file_download"
            label="Download"
            class="bg-primary text-capitalize q-px-sm width-100 btn-style-icon text-white"
            @click="downloadImage(file.link)"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-else :class="props.customClass">
    <div class="col-12">
      <q-input
        filled
        bg-color="white"
        color="primary"
        label-color="grey-14"
        readonly
        hide-bottom-space
        label="ไม่พบรายการแนบ"
        class="border_dashed input_filled_custom"
      >
        <template #prepend>
          <q-icon name="description" />
        </template>
      </q-input>
    </div>
  </div>

  <q-dialog v-model="isPopupShow">
    <q-card style="width: 100%; max-width: 960px">
      <q-bar class="bg-primary text-white">
        <q-space />
        <q-btn dense flat icon="close" @click="closePopup">
          <q-tooltip class="text-primary bg-white"> Close </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section style="padding: 0">
        <q-img
          :src="img"
          style="max-width: 100%; display: block"
          fit="contain"
          :ratio="4 / 3"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
