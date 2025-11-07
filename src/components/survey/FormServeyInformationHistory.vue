<script setup lang="ts">
const surveyStore = useSurveyStore();
const { survey_logs } = storeToRefs(surveyStore);

const columns = [
  {
    name: "index",
    required: true,
    label: "ลำดับ",
    align: "center",
    field: (row) => row.name,
    format: (val) => `${val}`,
    style: "width:10%",
  },
  {
    name: "surveyor",
    align: "center",
    label: "ผู้สำรวจ",
    field: "surveyor",
    style: "width:30%",
  },
  {
    name: "date",
    align: "center",
    label: "วันที่สำรวจ",
    field: "date",
    style: "width:15%",
  },
  {
    name: "results",
    align: "center",
    label: "ผลสำรวจ",
    field: "results",
    style: "width:15%",
  },
  {
    name: "detail",
    align: "center",
    label: "รายละเอียด",
    field: "detail",
    style: "width:30%",
  },
];

// const rows = [
//   {
//     index: '1',
//     surveyor: 'นาย ก',
//     date: '23/11/2556',
//     results: 'ไม่ผ่าน',
//     detail: 'ไม่มีคนอยู่บ้าน',
//   },
//   {
//     index: '2',
//     surveyor: 'นาย ข',
//     date: '23/11/2556',
//     results: 'ไม่สามารถติดต่อได้',
//     detail: 'ปิดเครื่อง',
//   },
//   {
//     index: '3',
//     surveyor: 'นาย ค',
//     date: '23/11/2556',
//     results: 'ผ่าน',
//     detail: '',
//   },
// ]
</script>

<template>
  <div class="box_form_customer_type">
    <q-list class="rounded-borders" style="background-color: #E3D3DF;">
      <q-expansion-item
        header-class="icon_color_gray"
        default-opened
      >
        <template #header>
          <q-item-section avatar>
            <q-icon color="primary" name="find_in_page" />
          </q-item-section>

          <q-item-section class="text_expansion text-primary">
            ประวัติการสำรวจ
          </q-item-section>
        </template>

        <q-card>
          <q-card-section v-if="!survey_logs?.length">
            <div class="q-pa-md">
              <div class="font-size-normal q-py-xl bg-white text-center">
                ----ไม่มีข้อมูล----
              </div>
            </div>
          </q-card-section>
          <q-card-section v-else>
            <div class="row q-pa-sm">
              <div class="col-12 col-md-12 q-pa-sm">
                <q-table
                  class="table-costom"
                  flat
                  :rows="survey_logs"
                  :columns="columns"
                  row-key="index"
                  hide-pagination
                  :rows-per-page-options="[0]"
                >
                  <template #body="props">
                    <q-tr :props="props">
                      <q-td key="index" :props="props">
                        <span class="table-label table-label-nocolor">
                          {{ props.rowIndex + 1 }}
                        </span>
                      </q-td>
                      <q-td key="surveyor" :props="props">
                        <span class="table-label">
                          {{ props.row.survey_by }} :
                          {{ props.row.survey_name }}
                        </span>
                      </q-td>
                      <q-td key="date" :props="props">
                        <span class="table-label">
                          {{ dateFormat(props.row.appointment_datetime) }}
                        </span>
                      </q-td>
                      <q-td key="results" :props="props">
                        <span class="table-label">
                          {{
                            props.row.status == "I"
                              ? "รอสำรวจ"
                              : props.row.status == "S"
                              ? "ผ่าน"
                              : "ไม่ผ่าน"
                          }}
                        </span>
                      </q-td>
                      <q-td key="detail" :props="props">
                        <span class="table-label">
                          {{ props.row.detail ?? "-" }}
                        </span>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";
</style>
