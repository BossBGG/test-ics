import { type UserModule } from "~/types";
import middlewares from "~/middlewares";
import globalMiddlewares from "~/middlewares/global";

import middlewarePipeline from "~/middlewares/pipeLine";

async function applyMiddleware(to, from, next) {
  const middlewareArrs = [];
  for (var key in globalMiddlewares) {
    middlewareArrs.push(globalMiddlewares[key]);
  }

  to.meta?.middleware?.map((m) => {
    if (m in middlewares) return middlewareArrs.push(middlewares[m]);
  });

  for (const middleware of middlewareArrs) {
    await new Promise((resolve, reject) => {
      middleware(to, from, (result) => {
        if (result === false) {
          reject();
        } else if (typeof result === "string" || typeof result === "object") {
          next(result);
          reject();
        } else {
          resolve();
        }
      });
    }).catch((err) => {
      console.error(err);
      return;
    });
  }
  next();
}

export const install: UserModule = ({ router }) => {
  router.beforeEach(async (to, from, next) => {
    await applyMiddleware(to, from, next);
  });
};
