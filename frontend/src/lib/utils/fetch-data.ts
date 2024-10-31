import { Method } from "axios";

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
  body: BodyInit | Record<string, unknown>,
  method: Method = "POST"
) {
  const result = await fetch(import.meta.env.VITE_STRAPI_BASE_URL + url, {
    ...options,
    method: method,
    headers: { "Content-Type": "application/json", ...options.headers },
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
  const json = result.json();
  return json;
}
