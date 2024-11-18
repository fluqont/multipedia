/**
 * like controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::like.like", {
  async count(ctx) {
    const { query } = ctx.request;
    console.log(query.filters);
    const count = await strapi.documents("api::like.like").count(query);
    return { count: count };
  },
  async updateLike(ctx) {
    const { query, body } = ctx.request;
    const like = await strapi.documents("api::like.like").findMany(query);
    if (like.length > 0) {
      console.log(like[0].documentId);
      await strapi
        .documents("api::like.like")
        .delete({ documentId: like[0].documentId });
    } else {
      await strapi.documents("api::like.like").create({
        data: {
          article: { documentId: body.articleId },
          user: { documentId: body.userId },
        },
      });
    }
    const count = await strapi
      .documents("api::like.like")
      .count({ filters: { article: { documentId: body.articleId } } });
    return { count: count };
  },
});
