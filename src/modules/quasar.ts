import { Quasar, date } from "quasar";
import type { UserModule } from "~/types";

import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "quasar/src/css/index.sass";

const isClientCheck = computed(() => import.meta.env.SSR);

export const install: UserModule = ({ app, isClient }) => {
  if (isClient) {
    if (isClientCheck) {
      app.use(Quasar, {
        config: {},
        plugins: ['Date'],
      });
    }
  }
};

// const formattedDate = date.formatDate(new Date(), 'YYYY-MMMM-DD');
// console.log('Formatted Date:', formattedDate);
