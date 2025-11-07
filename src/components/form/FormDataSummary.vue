<script setup lang="ts">
const lorem = ref("IIOMN2305670");
</script>

<template>
  <div class="box_details_request">
    <div class="title q-py-sm q-px-md">
      <h4>รายละเอียดคำร้อง</h4>
    </div>
    <div class="wraper_form">
      <div class="row">
        <div class="col-12 col-md-6 form_space_left q-mb-md">
          <q-field
            class="border_dashed"
            filled
            label="เลขที่คำร้อง"
            stack-label
          >
            <template #control>
              <div class="full-width no-outline self-center" tabindex="0">
                {{ lorem }}
              </div>
            </template>
          </q-field>
        </div>
        <div class="q-mb-md col-12 col-md-6 form_space_right">
          <q-field class="border_dashed" filled label="สถานะคำร้อง" stack-label>
            <template #control>
              <div class="full-width no-outline self-center" tabindex="0">
                Field content
              </div>
            </template>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="form_space_left q-mb-md col-12 col-md-6">
          <q-field
            class="border_dashed"
            filled
            label="ประเภทคำร้อง"
            stack-label
          >
            <template #control>
              <div class="full-width no-outline self-center" tabindex="0">
                Field content
              </div>
            </template>
          </q-field>
        </div>
        <div class="form_space_right col-12 col-md-6">
          <div class="row">
            <div class="form_space_left q-mb-md col-12 col-md-6">
              <q-field
                class="border_dashed"
                filled
                label="ช่องทางรับคำร้อง"
                stack-label
              >
                <template #control>
                  <div class="full-width no-outline self-center" tabindex="0">
                    Field content
                  </div>
                </template>
              </q-field>
            </div>
            <div class="form_space_right q-mb-md col-12 col-md-6">
              <q-field
                class="border_dashed"
                filled
                label="วันที่รับคำร้อง"
                stack-label
              >
                <template #control>
                  <div class="full-width no-outline self-center" tabindex="0">
                    Field content
                  </div>
                </template>
              </q-field>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.box_details_request {
  .title {
    background-color: $primary;
    color: $white;
    @include border-radius-separate(8px, 8px, 0, 0);

    h4 {
      font-size: 20px;
      font-weight: 500;
    }
  }
}
</style>
