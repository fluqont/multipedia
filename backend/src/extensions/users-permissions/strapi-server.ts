module.exports = (plugin) => {
  //  custom controller
  plugin.controllers.user.updateMe = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      return (ctx.response.status = 401);
    }

    if (ctx.request.body.username) {
      const userUsername = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { username: ctx.request.body.username } });
      if (userUsername && userUsername.id !== ctx.state.user.id) {
        ctx.response.status = 400;
        return (ctx.response.body = JSON.stringify({
          error: { message: "Username is already in use" },
        }));
      }
    }

    if (ctx.request.body.email) {
      const userEmail = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { username: ctx.request.body.email } });
      if (userEmail && userEmail.id !== ctx.state.user.id) {
        ctx.response.status = 400;
        return (ctx.response.body = JSON.stringify({
          error: { message: "Email is already in use" },
        }));
      }
    }

    await strapi
      .query("plugin::users-permissions.user")
      .update({
        where: { id: ctx.state.user.id },
        data: ctx.request.body,
      })
      .then((res) => {
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(res);
      });
  };

  // custom route
  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/user/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });

  return plugin;
};
