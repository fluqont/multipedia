/**
 * like controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::like.like", {
  async count(ctx) {
    const { query } = ctx.request;
    const count = await strapi.documents("api::like.like").count(query.count);
    const liked = query.user
      ? await strapi.documents("api::like.like").findMany({
          filters: {
            ...(query.count as { filters: any }).filters,
            ...(query.user as { filters: any }).filters,
          },
        })
      : [];
    return { count: count, liked: liked.length > 0 };
  },
  async updateLike(ctx) {
    const { body } = ctx.request;
    const like = await strapi.documents("api::like.like").findMany({
      filters: {
        article: { documentId: body.articleId },
        user: { documentId: ctx.state.user.documentId },
      },
    });
    let liked = true;
    if (like.length > 0) {
      liked = false;
      await strapi
        .documents("api::like.like")
        .delete({ documentId: like[0].documentId });
    } else {
      await strapi.documents("api::like.like").create({
        data: {
          article: { documentId: body.articleId },
          user: { documentId: ctx.state.user.documentId },
        },
      });
    }
    const count = await strapi
      .documents("api::like.like")
      .count({ filters: { article: { documentId: body.articleId } } });
    return { count: count, liked: liked };
  },
});
