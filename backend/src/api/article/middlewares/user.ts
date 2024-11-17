import { Context, Next } from "koa";

export default (config, { strapi }) => {
  return async (ctx: Context, next: Next) => {
    console.log(ctx.request.headers);
    if (
      ctx.state.user.id !== ctx.request.body.userId &&
      ctx.state.user.id !== Number(ctx.request.headers["user-id"])
    ) {
      return (ctx.response.status = 401);
    }

    await next();
  };
};
