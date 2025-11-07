<script lang="ts" setup>
const userDataStore = useUserDataStore();
const { userProfile } = storeToRefs(userDataStore);
onMounted(() => {
  // console.log(window.$keycloak);
  // console.log("$keycloak", $keycloak);
});
</script>
<template>
  <div>
    <div v-if="$keycloak && $keycloak.ready" style="margin-top: 30px">
      <div v-if="$keycloak.authenticated">
        <!-- <pre>userProfile : {{ userProfile }}</pre>
        <h2>You should only be able to see this if you are authenticated.</h2>
        <h3>This is what my token looks like:</h3>
        <pre>{{ Object.keys($keycloak) }}</pre>
        <pre>{{ $keycloak }}</pre>
        <h3>This is your access token:</h3>
        <pre>{{ $keycloak.token }}</pre> -->
        <q-input
          label="Token"
          :input-style="{ height: '280px' }"
          type="textarea"
          outlined
          v-model="$keycloak.token"
          :dense="dense"
        />
        <br />
        <button @click="$keycloak.keycloak.updateToken(300)">
          Refresh token
        </button>
        <br />

        <button @click="$keycloak.logoutFn" style="margin-top: 10px">
          Logout
        </button>
      </div>
      <div v-else>
        <h1>Not authenticated</h1>
        <button @click="$keycloak.login">Login</button>
      </div>
    </div>
  </div>
</template>
