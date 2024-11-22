/**
 * article controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    async find(ctx) {
      let { data, meta } = await super.find(ctx);

      // user reads article
      if (data.length === 1 && "views" in data[0]) {
        data = [
          await strapi.query("api::article.article").update({
            where: { id: data[0].id },
            data: { views: data[0].views + 1 },
            select: ["draft", "views", "documentId", "id"],
            populate: {
              user: {
                fields: ["username"],
                populate: {
                  pfp: {
                    fields: ["url"],
                  },
                },
              },
              topic: {
                fields: ["title"],
              },
            },
          }),
        ];
      }

      return { data, meta };
    },
    async random(ctx) {
      const articles = await strapi.documents("api::article.article").findMany({
        populate: {
          user: {
            fields: ["username"],
            populate: { pfp: { fields: ["url"] } },
          },
          topic: {
            fields: ["title"],
          },
        },
      });
      const random = articles[Math.floor(Math.random() * articles.length)];
      return random;
    },
  })
);
