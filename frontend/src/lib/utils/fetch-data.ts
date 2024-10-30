export async function fetchStrapi(url: string, options: RequestInit = {}) {
  const result = await fetch(
    import.meta.env.VITE_STRAPI_BASE_URL + url,
    options
  );
  const json = result.json();
  return json;
}

export async function postStrapi(
  url: string,
  options: RequestInit,
  body: Record<string, unknown>
) {
  const result = await fetch(import.meta.env.VITE_STRAPI_BASE_URL + url, {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = result.json();
  return json;
}
