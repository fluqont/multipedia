import { Context, Next } from "koa";

export default (config, { strapi }) => {
  return async (ctx: Context, next: Next) => {
    if (ctx.state.user.id !== ctx.request.body.userId) {
      return (ctx.response.status = 401);
    }

    await next();
  };
};
