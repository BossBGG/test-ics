<script setup lang="ts">
const props = defineProps({
  label: String,
  variant: {
    type: String,
    default: 'info',
  },
})
const variantClasses = {
  error: 'bg-[#FF616D] !text-white',
  info: 'bg-[#BEE2FF]',
  warning: 'bg-[#FDE5B6]',
  critical: 'bg-[#FFD4D4]',
  debug: 'bg-[#BEE2FF]',
  notice: 'bg-[#E1D2FF]',
  success: 'bg-[#3AC0A0] !text-white',
  caution: 'bg-[#FDE3BD]',
  alert: 'bg-[#F9AC12]',
  failure: 'bg-[#FFD4D4]',
  active: 'bg-[#31C48D] !text-white',
  inactive: 'bg-[#E02424] !text-white',
};

</script>

<template>
  <div :class="[ variantClasses[variant], 'w-fit px-4 py-1 rounded-sm text-[#160C26]']">
    {{ label }}
  </div>
</template>


