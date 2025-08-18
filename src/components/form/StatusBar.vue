<script setup lang="ts">
const props = defineProps(["customClass"]);

const request_id = useParams("uid");
const bp = useQuery("bp");
const ca = useQuery("ca");
const service = useQuery("service");
const temp = useQuery("temp");

const requestStore = useRequestStore();
const { request, requestForm, isSurvey } = storeToRefs(requestStore);

const businessStore = useBusinessPartnerStore();
const { businessPartner, businessPartnerDetail } = storeToRefs(businessStore);

// onMounted(async () => {
//   await businessStore.fetchBusinessPartnersByRequestID(
//     request.value.requests?.customer_request_no,
//   );
//   console.log("businessPartner: ", businessPartner.value);
// });

function linkOne() {
  if (request_id.value) {
    if (requestForm.value.channel == 0) {
      window.location.href = `/request/${request_id.value}`;
    } else {
      window.location.href = `/createBp/${request_id.value}?bp=${
        businessPartnerDetail?.value?.bpNo || ""
      }&ca=${businessPartnerDetail?.value?.caNo || ""}`;
    }
  } else {
    window.location.href = `/createBp?bp=${bp.value || ""}&ca=${
      ca.value || ""
    }&service=${service.value || ""}&temp=${temp.value || ""}`;
  }
}

async function linkTwo() {
  if (request_id.value) {
    if (requestForm.value.status != "D" && businessPartner.value != null) {
      window.location.href = `/application/${request_id.value}?bp=${
        businessPartnerDetail?.value?.bpNo || ""
      }&ca=${businessPartnerDetail?.value?.caNo || ""}`;
    } else {
      window.location.href = `/createBp/${request_id.value}?bp=${
        businessPartnerDetail?.value?.bpNo || ""
      }&ca=${businessPartnerDetail?.value?.caNo || ""}`;
    }
  } else {
    const _bpForm = await getLocalStorage(`${temp.value}_bpForm`);
    if (_bpForm) {
      window.location.href = `/application?bp=${bp.value || ""}&ca=${
        ca.value || ""
      }&service=${service.value || ""}&temp=${temp.value || ""}`;
    } else {
      window.location.href = `/createBp?bp=${bp.value || ""}&ca=${
        ca.value || ""
      }&service=${service.value || ""}&temp=${temp.value || ""}`;
    }
  }
}

function linkThree() {
  if (
    requestForm?.value?.status != "D" &&
    requestForm?.value?.status != "C" &&
    request_id.value
  ) {
    window.location.href = `/survey/${request_id.value}`;
  }
}

function linkFour() {
  if (
    requestForm.value.status != "D" &&
    requestForm.value.status != "C" &&
    requestForm?.value.status != "I" &&
    request_id.value
  ) {
    window.location.href = `/quotation/${request_id.value}`;
  }
}

const conditionTwo = computed(() => {
  if (
    request.value?.requests?.status == "R" ||
    request.value?.requests?.status == "E"
  ) {
    return CAN_ACCESS_PAGE.APP.value;
  }

  let isEnable = false;
  if (request_id.value) {
    isEnable = true;
  } else {
    const _bpForm = getLocalStorage(`${temp.value}_bpForm`);
    if (_bpForm) isEnable = true;
  }
  return requestForm?.value?.status !== "D" && isEnable;
});

const conditionThree = computed(() => {
  if (
    request.value?.requests?.status == "R" ||
    request.value?.requests?.status == "E"
  ) {
    return CAN_ACCESS_PAGE.SURVEY.value;
  }
  return (
    requestForm?.value?.status != "D" &&
    requestForm?.value?.status != "C" &&
    request_id.value
  );
});

const conditionFour = computed(() => {
  if (
    request.value?.requests?.status == "R" ||
    request.value?.requests?.status == "E"
  ) {
    return CAN_ACCESS_PAGE.QUOTATION.value;
  }
  return (
    requestForm?.value?.status != "D" &&
    requestForm?.value?.status != "C" &&
    requestForm?.value?.status != "I" &&
    request_id.value
  );
});
</script>

<template>
  <div class="section_box_status_bar">
    <div class="wraper_status">
      <div class="box_status">
        <div class="sub_status" :class="props.customClass">
          <q-btn @click="linkOne">
            <div class="item">
              <div class="icon">
                <q-avatar
                  class="icon_active1"
                  icon="person"
                  text-color="white"
                />
                <q-avatar class="icon_active2" icon="edit" text-color="white" />
              </div>
              <div class="text">
                <p>ข้อมูลผู้ใช้ไฟฟ้า</p>
              </div>
            </div>
          </q-btn>

          <q-btn @click="linkTwo" :disable="!conditionTwo">
            <div class="item">
              <div class="icon">
                <q-avatar
                  class="icon_active1"
                  icon="description"
                  text-color="white"
                />
                <q-avatar class="icon_active2" icon="edit" text-color="white" />
              </div>
              <div class="text">
                <p>ข้อมูลใบคำร้อง</p>
              </div>
            </div>
          </q-btn>

          <q-btn @click="linkThree" v-if="isSurvey" :disable="!conditionThree">
            <div class="item">
              <div class="icon">
                <q-avatar
                  class="icon_active1 q-icon material-icons-outlined"
                  text-color="white"
                  >map</q-avatar
                >
                <q-avatar class="icon_active2" icon="edit" text-color="white" />
              </div>
              <div class="text">
                <p>ข้อมูลการสำรวจ</p>
              </div>
            </div>
          </q-btn>

          <q-btn @click="linkFour" :disable="!conditionFour">
            <div class="item">
              <div class="icon">
                <q-avatar
                  class="icon_active1 q-icon material-icons-outlined"
                  text-color="white"
                >
                  draw
                </q-avatar>
                <q-avatar class="icon_active2" icon="edit" text-color="white" />
              </div>
              <div class="text">
                <p>ใบเสนอราคา</p>
              </div>
            </div>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.section_box_status_bar {
  margin: 17px 0px;

  @media #{$screen-xl-min} {
    margin: 29px 0px;
  }

  .wraper_status {
    .box_status {
      @include border-radius(4px);
      background-color: $bg_field_mid_gray;
      padding: 23px 5px;

      @media #{$screen-xl-min} {
        padding: 28px 50px;
      }

      @media #{$screen-xxl-min} {
        padding: 28px 130px;
      }

      .sub_status {
        position: relative;
        @include flexbox();
        @include align-items(center);
        @include justify-content(space-between);

        &::before {
          content: "";
          position: absolute;
          border-bottom: 0.6px solid $border_bottom;
          // height: 0.6px;
          // background-color: $border_bottom;
          width: 100%;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        &.active1 {
          a,
          button {
            &:nth-child(1) {
              .item {
                color: $primary;

                .icon {
                  background-color: $primary;

                  .q-avatar {
                    &.icon_active1 {
                      display: none !important;
                    }

                    &.icon_active2 {
                      display: block !important;
                    }
                  }
                }
              }
            }
          }
        }

        &.active2 {
          a,
          button {
            &:nth-child(2) {
              .item {
                color: $primary;

                .icon {
                  background-color: $primary;

                  .q-avatar {
                    &.icon_active1 {
                      display: none !important;
                    }

                    &.icon_active2 {
                      display: block !important;
                    }
                  }
                }
              }
            }
          }
        }

        &.active3 {
          a,
          button {
            &:nth-child(3) {
              .item {
                color: $primary;

                .icon {
                  background-color: $primary;

                  .q-avatar {
                    &.icon_active1 {
                      display: none !important;
                    }

                    &.icon_active2 {
                      display: block !important;
                    }
                  }
                }
              }
            }
          }
        }

        &.active4 {
          a,
          button {
            &:nth-child(4) {
              .item {
                color: $primary;

                .icon {
                  background-color: $primary;

                  .q-avatar {
                    &.icon_active1 {
                      display: none !important;
                    }

                    &.icon_active2 {
                      display: block !important;
                    }
                  }
                }
              }
            }
          }
        }

        button {
          padding: 0;
          margin: 0;
          box-shadow: none;

          &::before {
            box-shadow: none;
          }
        }

        a,
        button {
          text-decoration: none;

          .item {
            position: relative;
            @include flexbox();
            @include flex-direction(column);
            @include align-items(center);
            @include justify-content(center);
            color: $border_bottom;
            background-color: $bg_field_mid_gray;

            .icon {
              @include flexbox();
              @include align-items(center);
              @include justify-content(center);
              @include border-radius(100px);
              width: 24px;
              height: 24px;
              background-color: $border_bottom;

              .q-avatar {
                &.icon_active1 {
                  display: block !important;
                }

                &.icon_active2 {
                  display: none !important;
                }
              }

              i {
                &.q-icon {
                  font-size: 0.857rem !important;
                  color: $white;
                }
              }
            }

            .text {
              text-align: center;
              margin-top: 4px;

              p {
                font-size: 10px;
                font-weight: normal;

                @media #{$screen-xl-min} {
                  font-size: 13px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
