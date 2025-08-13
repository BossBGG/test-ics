<script setup lang="ts">

interface Props {
    title: string;
    count: number;
    icon?: string;
    unit: string;
}



</script>

<template>
  <div>
    <div>
        <div>
            <div>
                {{ title}}
            </div>
            <div>
                {{ count }} 
                <label for=""> / {{ unit }}</label>
            </div>
        </div>
        <div>
            <img v-if="icon.includes('.')" :src="icon" :alt="title">
        </div>
    </div>
  </div>
</template>


<style>

</style>