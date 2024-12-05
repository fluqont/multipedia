import { Context, Next } from "koa";

export default (config, { strapi }) => {
  return async (ctx: Context, next: Next) => {
    const documentId = ctx.path.split("/")[3];
    const article = await strapi.documents("api::article.article").findOne({
      documentId: documentId,
      populate: { user: { fields: ["id"] } },
    });
    if (article.user.id !== ctx.state.user.id) {
      return (ctx.response.status = 401);
    }

    await next();
  };
};
