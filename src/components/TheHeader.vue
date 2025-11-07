<script setup>
const drawer = ref(true);
const userDataStore = useUserDataStore();
const { userProfile } = storeToRefs(userDataStore);
</script>

<template>
  <header id="header" class="q-py-sm bg-primary">
    <div class="container">
      <q-toolbar class="q-px-none">
        <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" class="q-mr-sm text-white" />
        <q-toolbar-title class="text-white">
          <q-avatar>
            <img src="@img/logo.svg" />
          </q-avatar>

          ระบบงานบริการลูกค้า
        </q-toolbar-title>

        <div class="box-profile-header q-gutter-xs" v-if="$keycloak.authenticated">
          <div class="box-profile-header_row">
            <div class="box-profile_name">
              <div class="text-white">
                <!-- นางสาว พิมพ์ลักษ์ บุญชูกุศล -->
                {{ $keycloak.idTokenParsed.hr_firstname }}
              </div>
            </div>
            <div class="box-profile_status q-gutter-sm">
              <div class="text-white">
                <span class="col">
                  <i class="q-icon notranslate material-icons" aria-hidden="true" role="img">person</i>
                </span>
                <!-- 505388 -->
                {{ $keycloak.idTokenParsed.preferred_username }}
              </div>
              <div class="bable bg-secondary text-white">
                {{ $keycloak.idTokenParsed.azp.toUpperCase() }}
                <!-- XSCX -->
              </div>
            </div>
          </div>
          <div class="q-gutter-xs">
            <q-btn color="white" flat round icon="arrow_drop_down">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item v-close-popup clickable>
                    <q-item-section @click="$keycloak.logout">Logout</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import "@style";

#header {
  .box-profile-header {
    @include flexbox();
    @include justify-content(space-between);
    @include align-items(center);

    .box-profile-header_row {
      .box-profile_name {
        display: block;
        text-align: right;
        font-size: 15px;
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
          padding: 6px 12px;
          display: inline-block;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
