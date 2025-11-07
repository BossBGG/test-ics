// import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import { createPinia } from "pinia";

import axios from "axios";

import Keycloak from "keycloak-js";
import type { UserModule } from "~/types";

const keycloakConfig = {
  url: "https://sso2.pea.co.th/",
  realm: "pea-users",
  clientId: "pea-ics",
};

const keycloak = new Keycloak(keycloakConfig);

function pinia({ isClient, app, initialState }) {
  const pinia = createPinia();
  app.use(pinia);
  if (isClient) pinia.state.value = initialState.pinia || {};
  else initialState.pinia = pinia.state.value;
}

function axiosInit() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
  axios.interceptors.request.use((config) => {
    config.headers.apiKey = import.meta.env.VITE_API_KEY;
    return config;
  });
}

export const installKeycloak: UserModule = async ({
  isClient,
  initialState,
  app,
}) => {
  pinia({ isClient, initialState, app });
  axiosInit();

  return new Promise((resolve, reject) => {
    keycloak
      .init({
        onLoad: "login-required",
        checkLoginIframe: false,
      })
      .then(async (authenticate) => {
        console.log("authenticate: ", authenticate);
        app.config.globalProperties.$keycloak = keycloak;
        console.log("keycloak: ", keycloak);

        try {
          const loading = useLoadingStore();
          loading.start();
          // console.log('onReady keycloak: ', keycloak);
          const profile = await keycloak.loadUserProfile();

          axios.interceptors.request.use(
            async (config) => {
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${keycloak.token}`,
              };
              return config;
            },
            (error) => {
              reject(error);
            },
          );
          const userDataStore = useUserDataStore();
          userDataStore.setToken(keycloak.token as string);

          const auth = await axios.get("users/auth");
          if (auth.data?.datas) {
            userDataStore.setUserProfile(
              auth.data.datas,
              auth.data?.y3,
              auth.data?.selectedPeaOffice,
              auth.data?.peaOffices,
              auth.data?.selectedPeaCode,
            );
          }
          loading.stop();

          resolve();
        } catch (error) {
          console.error("Error in onReady:", error);
          reject(error);
        }
      })
      .catch((err) => {
        console.error("Authentication failed", err);
      });
  });
};
