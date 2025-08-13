<script setup lang="ts">
interface Props {
  title: string;
  hours: number;
  icon?: string;
}
</script>

<template>
  <div>
    <div>
      <div>
        <div>
          <div>
            <img v-if="icon.includes('.')" :src="icon" :alt="title" />
          </div>
          <div>
            <div>{{ title }}</div>
            <div>(ทั้งหมด)</div>
          </div>
        </div>
        <div>
          {{ hours }}
          <label for="">ชั่วโมง</label>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style></style>
