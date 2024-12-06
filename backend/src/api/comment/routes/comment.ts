/**
 * comment router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::comment.comment", {
  config: {
    create: {
      middlewares: ["api::article.user"],
    },
    delete: {
      middlewares: ["api::comment.owner"],
    },
  },
});
