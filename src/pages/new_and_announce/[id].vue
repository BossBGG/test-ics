<template>
    <content-container
     :breadcrumbs="[{ text: 'หน้าหลัก'} , { text: 'ข่าวและประกาศ' }]"
     :last_update="'2025-02-14 09:30:00'"
    >

    <!-- Filter Dialog -->
</template>

<script setup lang="ts">

const showFilterDialog = ref(false)
const currentFilters = ref({
    startDate: '',
    endDate: '',
    status:'',
});

const filteredData = computed(() => {
    
})


</script>