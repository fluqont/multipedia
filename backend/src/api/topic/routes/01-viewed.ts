export default {
  routes: [
    {
      method: "GET",
      path: "/topics/viewed",
      handler: "topic.findMostViewed",
    },
  ],
};
