type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export async function fetchStrapi(url: string, options?: RequestInit) {
  const result = await fetch(
    import.meta.env.VITE_STRAPI_BASE_URL + url,
    options
  );
  const json = await result.json();
  if (!result.ok) {
    return { error: json.error.message, errorCode: json.error.status };
  }
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

export async function fetchQuery(url: string, options?: RequestInit) {
  const response = await fetch(
    import.meta.env.VITE_STRAPI_BASE_URL + url,
    options
  );
  return response.json();
}

interface FetchMutationOptions extends RequestInit {
  headers: Record<string, string>;
}

export async function fetchMutation(
  method: Method,
  url: string,
  body?: Record<string, unknown>,
  options?: FetchMutationOptions
) {
  const fetchOptions: FetchMutationOptions = {
    ...options,
    method,
    headers: {
      ...options?.headers,
    },
    body: JSON.stringify(body),
  };

  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    fetchOptions.headers.Authorization = `Bearer ${jwt}`;
  }

  if (body) {
    fetchOptions.headers["Content-Type"] = "application/json";
  }

  const response = await fetch(
    import.meta.env.VITE_STRAPI_BASE_URL + url,
    fetchOptions
  );
  if (response.headers.get("content-type") === "application/json") {
    return response.json();
  } else {
    return response;
  }
}
