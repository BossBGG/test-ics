import { date as Date, Notify, Quasar } from "quasar"
import iconSet from "quasar/icon-set/mdi-v6"
import type { UserModule } from "~/types"

import "@quasar/extras/material-icons/material-icons.css"
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css"
import "@quasar/extras/mdi-v6/mdi-v6.css"
import "quasar/src/css/index.sass"

const isClientCheck = computed(() => import.meta.env.SSR);

export const install: UserModule = ({ app, isClient }) => {
  if (isClient) {
    if (isClientCheck) {
      app.use(Quasar, {
        iconSet,
        plugins: {
          Date,
          Notify,
        },
      })
    }
  }
}

// const formattedDate = date.formatDate(new Date(), 'YYYY-MMMM-DD');
// console.log('Formatted Date:', formattedDate);
