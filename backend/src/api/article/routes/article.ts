/**
 * article router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::article.article", {
  config: {
    create: {
      middlewares: ["api::article.user"],
    },
    update: {
      middlewares: ["api::article.owner"],
    },
    delete: {
      middlewares: ["api::article.owner"],
    },
  },
});
