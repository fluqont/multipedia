/**
 * article controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    async find(ctx) {
      const { data, meta } = await super.find(ctx);

      // user reads article
      if (data.length === 1 && "views" in data[0]) {
        await strapi.documents("api::article.article").update({
          documentId: data[0].documentId,
          data: { views: data[0].views + 1 },
        });
      }

      return { data, meta };
    },
  })
);
