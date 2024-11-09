import { fetchStrapi } from "../lib/fetch-data";

export async function getTopicsAction() {
  try {
    const topics = await fetchStrapi("/topics");
    return topics;
  } catch (e) {
    return { error: e };
  }
}
