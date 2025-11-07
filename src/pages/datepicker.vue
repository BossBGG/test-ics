<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      date: ref('2019/02/01'),

      datePickerOptions: {
        format: 'DD/MM/YYYY',
        defaultView: 'years',
        firstDayOfWeek: 1,
        navigationMinMax: {
          minYear: 1900,
          maxYear: 2100,
        },
        view: 'date',
        locale: date.getLocale('th'), // กำหนด locale เป็นภาษาไทย
        header: ['year', 'month', 'prev', 'today', 'next'],
        title: (date, view) => {
          const year = date.getFullYear() + 543 // แปลงปีคริสต์ศักราชเป็น พ.ศ.
          const month = date.toLocaleString('th-TH', { month: 'long' })
          const day = date.toLocaleString('th-TH', { weekday: 'long' })

          return `${day} ${date.getDate()} ${month} ${year}`
        },
      },
    }
  },
}
</script>

<template>
  <div class="q-pa-md">
    <div v-if="date > '2024-02-20'">
      55
    </div>
    <div class="row q-gutter-md items-start">
      <q-date v-model="date" mask="YYYY-MM-DD" :options="datePickerOptions" />
      <q-date v-model="date" />
      <q-date v-model="date" minimal />
    </div>
  </div>
</template>
