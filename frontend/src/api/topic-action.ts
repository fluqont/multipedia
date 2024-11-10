import { z } from "zod";
import { jsonStrapi } from "../lib/fetch-data";
import { validateData } from "../lib/utils";
import { Topic } from "../types/article";
import { Data } from "../lib/types";

const schemaRegister = z.object({
  title: z.string().min(2).max(255, {
    message: "Topic title must be between 2 and 20 characters",
  }),
});

export async function getOrCreateTopicAction(
  title: string,
  topics: Data<Topic[]>,
  userId: number
) {
  const validation = validateData({ title }, schemaRegister);
  if (!validation.success) {
    return { zodErrors: validation.error };
  }

  const createdTopic = topics.data.find((topic) => topic.title === title);

  if (createdTopic) {
    return { data: { id: createdTopic.id } };
  } else {
    try {
      const responseData = await jsonStrapi(
        "POST",
        "/topics",
        {
          data: validation.data,
          userId,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
      );

      return responseData;
    } catch (e) {
      return { error: e };
    }
  }
}
