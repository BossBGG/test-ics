<script setup lang="ts">
import { ref, onMounted } from "vue";
import { QSelect, QInput, QItem, QItemSection, QIcon } from "quasar";
import { getMaterialSets } from "@/api/material_equipment_api";
import { debounce } from "lodash-es";

interface Props {
  type: "sets" | "search";
  modelValue: string | null;
  label: string;
  placeholder: string;
  disabled?: boolean;
  office?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue", "update:setName"]);

const loading = ref(false);
const setOptions = ref<{ label: string; value: string }[]>([]);

const fetchMaterialSets = async (search: string = "") => {
  loading.value = true;
  try {
    const response = await getMaterialSets(search, props.office);
    if (response.status === 200 && response.data?.data) {
      setOptions.value = response.data.data.map((set: any) => ({
        label: set.name,
        value: set.id || set.uuid,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch material sets:", error);
    setOptions.value = [];
  } finally {
    loading.value = false;
  }
};

const debouncedFetch = debounce(fetchMaterialSets, 500);

const filterSets = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    debouncedFetch(val);
  });
};

const emitSet = (value: string | null) => {
  emit("update:modelValue", value);
  const selecteddOption = setOptions.value.find((opt) => opt.value === value);
  emit("update:setName", selecteddOption?.label || "");
};

const emitSearch = (value: string | null) => {
  emit('update:modelValue', value);
};

onMounted(() => {
  if (props.type === "sets") {
    fetchMaterialSets();
  }
});
</script>

<template>
  <div class="mb-3">
    <label v-if="label" class="block text-sm font-medium mb-2 text-gray-700">
        {{ label }}
    </label>

    <q-select
    v-if="type === 'sets'"
    filled
    dense
    :model-value="modelValue"
    @update:model-value="emitSet"
    :options="setOptions"
    @filter="filterSets"
    use-input
    fill-input
    hide-selected
    :placeholder="placeholder"
    :loading="loading"
    :disable="disabled"
    options-dense
    emit-value
    map-options
    class="bg-white rounded-md"
    >
    <template v-slot:no-option>
        <q-item>
            <q-item-section class="text-grey">
                ไม่พบผลลัพธ์
            </q-item-section>
        </q-item>

    </template>
    </q-select>

    <q-input
    v-if="type === 'search'"
    filled
    dense
    :model-value="modelValue"
    @update:model-value="emitSearch"
    :placeholder="placeholder"
    :disable="disabled"
    :debounce="500"
    class="bg-white rounded-md"
    >
        <template v-slot:prepend>
            <q-icon name="search"/>
        </template>
    </q-input>
  </div>
</template>
