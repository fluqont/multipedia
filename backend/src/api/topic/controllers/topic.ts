/**
 * topic controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::topic.topic",
  ({ strapi }) => ({
    async findMostViewed(ctx) {
      const topics = await strapi.documents("api::topic.topic").findMany({
        populate: {
          articles: {
            fields: ["views"],
          },
        },
      });
      const sortedTopics = topics
        .sort((a, b) => getTopicViews(b.articles) - getTopicViews(a.articles))
        .slice(0, 4);
      return sortedTopics;

      function getTopicViews(articles: (typeof topics)[number]["articles"]) {
        const views = articles.reduce(
          (views, article) => (views += article.views),
          0
        );
        return views;
      }
    },
  })
);
