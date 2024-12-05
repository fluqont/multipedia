import { Context, Next } from "koa";

export default (config, { strapi }) => {
  return async (ctx: Context, next: Next) => {
    if (typeof ctx.request.body === "object" && "data" in ctx.request.body) {
      // @ts-ignore
      if (ctx.state.user.id !== ctx.request.body.data?.user?.id) {
        return (ctx.response.status = 401);
      }
    } else {
      return (ctx.response.status = 400);
    }

    await next();
  };
};
