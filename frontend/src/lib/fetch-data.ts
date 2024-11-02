type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export async function fetchStrapi(url: string, options?: RequestInit) {
  const result = await fetch(
    import.meta.env.VITE_STRAPI_BASE_URL + url,
    options
  );
  const json = result.json();
  return json;
}

export async function jsonStrapi(
  method: Method,
  url: string,
  body: Record<string, unknown>,
  options?: RequestInit
) {
  const json = await fetchStrapi(url, {
    ...options,
    method: method,
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(body),
  });
  return json;
}
