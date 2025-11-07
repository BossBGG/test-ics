<script setup>
const userDataStore = useUserDataStore();
const { userProfile, selectedPeaOffice, showSettingModal } =
  storeToRefs(userDataStore);

const isShown = ref(false);
const toggleShow = () => {
  isShown.value = !isShown.value;
};
</script>

<template>
  <main>
    <q-layout view="hHh Lpr lff" container style="height: 100svh">
      <ModalSetting />
      <q-header id="header" elevated>
        <div class="container">
          <q-toolbar>
            <q-btn flat @click="toggleShow" round dense icon="menu" />

            <q-toolbar-title class="text_header text-white">
              <q-avatar>
                <img src="@img/logo.svg" />
              </q-avatar>

              ระบบงานบริการลูกค้า
            </q-toolbar-title>

            <q-btn-dropdown class="header_btn_right" square>
              <template v-slot:label>
                <div class="box-profile-header" v-if="$keycloak.authenticated">
                  <div class="box-profile-header_row">
                    <div class="box-profile_name">
                      <div class="text-white">
                        {{
                          `${userProfile.title_s_desc} ${userProfile.first_name} ${userProfile.last_name}`
                        }}
                      </div>
                    </div>
                    <div class="box-profile_status q-gutter-sm">
                      <div class="text-white">
                        <span class="col">
                          <i
                            class="q-icon notranslate material-icons"
                            aria-hidden="true"
                            role="img"
                            >person</i
                          >
                        </span>
                        <!-- 505388 -->
                        {{ userProfile.username ?? "-" }}
                      </div>
                      <div class="bable bg-secondary text-white">
                        {{
                          (selectedPeaOffice || userProfile.pea_office) ?? "-"
                        }}
                        <!-- XSCX -->
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <q-list>
                <q-item clickable @click="openSettingModal()">
                  <q-item-section avatar>
                    <q-avatar
                      icon="settings"
                      color="drak-blue"
                      text-color="white"
                      size="32px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>ตั้งค่าการไฟฟ้า</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable @click="$keycloak.logout">
                  <q-item-section avatar>
                    <q-avatar
                      icon="logout"
                      color="secondary"
                      text-color="white"
                      size="32px"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>ออกจากระบบ</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-toolbar>
        </div>
      </q-header>

      <q-drawer
        v-model="isShown"
        :show-if-above="false"
        :width="313"
        :breakpoint="700"
        elevated
        default-close
      >
        <q-scroll-area class="fit">
          <TheMenu />
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <div class="container">
            <RouterView />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </main>
</template>

<style lang="scss" scoped>
@import "@style";

#header {
  .q-toolbar {
    padding: 0;
  }

  .text_header {
    font-size: 16px;

    @media #{$screen-mds-min} {
      font-size: 21px;
    }
  }

  .header_btn_right {
    padding: 8px;

    @media #{$screen-mds-min} {
      padding: 8px 12px;
    }

    &.q-btn {
      &:before {
        box-shadow: none !important;
      }
    }
  }

  .box-profile-header {
    @include flexbox();
    @include justify-content(space-between);
    @include align-items(center);

    .box-profile-header_row {
      .box-profile_name {
        display: block;
        text-align: right;
        font-size: 14px;
      }

      .box-profile_status {
        display: block;
        text-align: right;
        @include flexbox();
        @include align-items(center);
        @include justify-content(end);
        font-size: 12px;

        .material-icons {
          font-size: 1.5em;
        }

        .bable {
          @include border-radius(4px);
          padding: 4px 8px;
          display: inline-block;
          font-size: 14px;
        }
      }
    }
  }
}

.q-layout-padding {
  padding: 0;
}
</style>
