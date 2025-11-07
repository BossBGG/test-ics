<script setup>
</script>

<template>
  <div class="box_menu">
    <div class="wraper_memu">
      <div class="sub_wraper">
        <q-list class="rounded-borders">
          <a :href="peaUrl()">
            <q-expansion-item
              expand-separator
              icon="home"
              label="หน้าหลัก"
              hide-expand-icon
              class="bg_color"
            />
          </a>

          <a :href="peaUrl('search-customer')">
            <q-expansion-item
              expand-separator
              icon="person"
              label="สร้าง/ค้นหาข้อมูลผู้ใช้ไฟฟ้า"
              hide-expand-icon
              class="bg_color"
            />
          </a>

          <a :href="peaUrl('notification')">
            <q-expansion-item
              expand-description
              hide-expand-icon
              class="bg_color"
            >
              <template #header>
                <q-item-section avatar>
                  <q-icon class="q-icon material-icons-outlined"
                    >description</q-icon
                  >
                </q-item-section>
                <q-item-section class="q-item__label"
                  >ค้นหาคำร้อง</q-item-section
                >
              </template>
            </q-expansion-item>
          </a>

          <a :href="peaUrl('?category=Y1')">
            <q-expansion-item
              expand-description
              icon="description"
              label="คำร้องขอใช้ไฟฟ้า"
              hide-expand-icon
              class="bg_color"
            >
              <template #header>
                <q-item-section avatar>
                  <q-icon class="icon_circle dark_blue">Y1</q-icon>
                </q-item-section>
                <q-item-section class="q-item__label"
                  >คำร้องขอใช้ไฟฟ้า</q-item-section
                >
              </template>
            </q-expansion-item>
          </a>

          <a :href="peaUrl('?category=Y2')">
            <q-expansion-item
              expand-description
              icon="description"
              label="คำร้องขอขยายเขต"
              hide-expand-icon
              class="bg_color"
            >
              <template #header>
                <q-item-section avatar>
                  <q-icon class="icon_circle primary">Y2</q-icon>
                </q-item-section>
                <q-item-section class="q-item__label"
                  >คำร้องขอขยายเขต</q-item-section
                >
              </template>
            </q-expansion-item>
          </a>

          <a :href="peaUrl('?category=Y3')">
            <q-expansion-item
              expand-description
              icon="description"
              label="คำร้องงานธุรกิจเกี่ยวเนื่อง"
              hide-expand-icon
              class="bg_color"
            >
              <template #header>
                <q-item-section avatar>
                  <q-icon class="icon_circle dark_moderate_pink">Y3</q-icon>
                </q-item-section>
                <q-item-section class="q-item__label"
                  >คำร้องงานธุรกิจเกี่ยวเนื่อง</q-item-section
                >
              </template>
            </q-expansion-item>
          </a>

          <a :href="peaUrl('?category=Y4')">
            <q-expansion-item
              expand-description
              icon="description"
              label="คำร้องข้อร้องขอ"
              hide-expand-icon
              class="bg_color"
            >
              <template #header>
                <q-item-section avatar>
                  <q-icon class="icon_circle grayish_red">Y4</q-icon>
                </q-item-section>
                <q-item-section class="q-item__label"
                  >คำร้องข้อร้องขอ</q-item-section
                >
              </template>
            </q-expansion-item>
          </a>

          <a :href="peaUrl('interface')">
            <q-expansion-item
              expand-separator
              icon="swap_vert"
              label="ตรวจสอบการ Interface ข้อมูล"
              hide-expand-icon
              class="bg_color"
            />
          </a>

          <a :href="peaUrl('search-notification')">
            <q-expansion-item
              expand-separator
              icon="search"
              label="ตรวจสอบ/เคลียร์ Lot"
              hide-expand-icon
              class="bg_color"
            />
          </a>

          <q-expansion-item class="bg_color" expand-separator icon="analytics">
            <template #header>
              <q-item-section avatar>
                <q-icon class="q-icon material-icons-outlined">
                  analytics
                </q-icon>
              </q-item-section>
              <q-item-section class="q-item__label"> รายงาน </q-item-section>
            </template>
            <a :href="peaUrl('report')">
              <q-expansion-item
                expand-separator
                label="สถานะการรับคำร้อง"
                hide-expand-icon
                :header-inset-level="1"
                class="bg_color space_mobile"
              />
            </a>
          </q-expansion-item>

          <q-expansion-item
            class="bg_color"
            expand-separator
            icon="admin_panel_settings"
            label="จัดการระบบ"
          >
            <a :href="peaUrl('system')">
              <q-expansion-item
                expand-separator
                :header-inset-level="1"
                label="กำหนดสิทธิ์การใช้งาน"
                hide-expand-icon
                class="bg_color space_mobile"
              />
            </a>
          </q-expansion-item>

          <a href="/new_and_announce/list">
            <q-expansion-item
              expand-separator
              icon="newspaper"
              label="ข่าวและประกาศ"
              hide-expand-icon
              class="bg_color"
            />
          </a>

          <q-expansion-item
            class="bg_color"
            expand-separator
            icon="receipt_long"
            label="จัดการและรายงาน (Y3)"
          >
            <a href="/material_equipment/list">
              <q-expansion-item
                expand-separator
                :header-inset-level="1"
                label="จัดการกลุ่มวัสดุและ อุปกรณ์"
                icon="campaign"
                hide-expand-icon
                class="bg_color space_mobile"
              />
            </a>
            <a href="/news/list">
              <q-expansion-item
                expand-separator
                :header-inset-level="1"
                label="จัดการข่าวและประกาศ"
                icon="campaign"
                hide-expand-icon
                class="bg_color space_mobile"
              />
            </a>
            <a href="/system_log/list">
              <q-expansion-item
                expand-separator
                :header-inset-level="1"
                label="System Log"
                icon="browse_gallery"
                hide-expand-icon
                class="bg_color space_mobile"
              />
            </a>
          </q-expansion-item>

          <a>
            <q-expansion-item
              expand-separator
              icon="grid_view"
              label="อื่นๆ"
              hide-expand-icon
              class="bg_color"
            />
          </a>

          <!-- <q-expansion-item
            expand-separator
            icon="logout"
            label="Log out"
            hide-expand-icon
            class="bg_color"
            @click="$keycloak.logoutFn"
          >
          </q-expansion-item> -->
        </q-list>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@style";

.box_menu {
  max-width: 1440px;
  margin: 0 auto;

  .wraper_memu {
    max-width: 1440px;
    margin: 0 auto;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #ffffff;
    z-index: 2;
    height: 100svh;
    overflow-y: auto;
    padding-bottom: 100px;

    .sub_wraper {
      width: 266px;

      @media #{$screen-mds-min} {
        width: 313px;
      }
    }

    .q-list {
      a {
        text-decoration: none;
        color: $text_input;

        &.router-link-active {
          color: $primary;

          .q-expansion-item {
            background: #e1daef !important;
          }
        }
      }

      .border_1 {
        border-bottom: 1px solid #e0e0e0;
      }
    }
  }
}
</style>
