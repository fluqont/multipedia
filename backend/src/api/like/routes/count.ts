export default {
  routes: [
    {
      method: "GET",
      path: "/likes/count",
      handler: "like.count",
    },
    {
      method: "POST",
      path: "/likes/update",
      handler: "like.updateLike",
    },
  ],
};
