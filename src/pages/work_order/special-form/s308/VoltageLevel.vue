<!-- src/components/work_order/VoltageLevel.vue -->
<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue"
import CardCollapse from "~/components/ui/card/CardCollapse.vue"

interface Props {
  modelValue?: string
}

interface ServiceOption {
  value: string
  label: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "change", value: string): void
}>()

const serviceOptions: ServiceOption[] = [
  { value: "22-33 kV", label: "22-33 kV" }
]

const selectedValue = ref(props.modelValue || "")
const selectedLabel = ref("")

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue || ""
    const option = serviceOptions.find((opt) => opt.value === selectedValue.value)
    selectedLabel.value = option?.label || ""
  },
  { immediate: true }
)

// Handle value change from input
const handleValueChange = (newLabel: string) => {
  const option = serviceOptions.find((opt) => opt.label === newLabel)
  if (option) {
    selectedValue.value = option.value
    selectedLabel.value = option.label
    emit("update:modelValue", option.value)
    emit("change", option.value)
  } else {
    selectedValue.value = ""
    selectedLabel.value = newLabel
    emit("update:modelValue", "")
    emit("change", "")
  }
}
</script>

<template>
  <div class="pb-4">
    <div>
      <div class="pb-4">ระดับแรงดันไฟฟ้า</div>

      <div class="flex flex-row gap-4 ">
        <q-input
          v-model="selectedLabel"
          outlined
          placeholder="กรอกระดับแรงดันไฟฟ้า"
          class="form-input w-[85%]"
          @update:model-value="handleValueChange"
        />

        <div class="bg-[#EDEDED] w-[180px] justify-center text-start items-center p-4 rounded-md">
          kw
        </div>
      </div>

      <div v-if="selectedValue">
        <p>
          ระดับแรงดันไฟฟ้า:
          <span>{{ selectedLabel }}</span>
        </p>
      </div>
    </div>
  </div>
</template>