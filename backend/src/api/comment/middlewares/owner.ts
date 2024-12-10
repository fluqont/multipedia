import { Context, Next } from "koa";

export default (config, { strapi }) => {
  return async (ctx: Context, next: Next) => {
    const documentId = ctx.path.split("/")[3];
    const comment = await strapi.documents("api::comment.comment").findOne({
      documentId: documentId,
      fields: ["id"],
      populate: { user: { fields: ["id"] } },
    });
    if (
      !comment ||
      !ctx.state.user ||
      comment.user?.id !== ctx.state.user?.id
    ) {
      return (ctx.response.status = 401);
    }

    await next();
  };
};
