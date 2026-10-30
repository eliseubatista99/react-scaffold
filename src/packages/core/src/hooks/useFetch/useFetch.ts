type FetchOptions = object;

export type FetchOutput<TOut> = {
  result: TOut | undefined;
  statusCode: number;
  error?: unknown;
};

export const useFetch = () => {
  const buildUrl = (baseUrl: string, options?: FetchOptions) => {
    if (!options) return baseUrl;

    const params = new URLSearchParams();

    const entries: [string, unknown][] = Object.entries(options);
    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    const queryString = params.toString();
    if (!queryString) return baseUrl;

    const hashIndex = baseUrl.indexOf("#");
    const url = hashIndex === -1 ? baseUrl : baseUrl.slice(0, hashIndex);
    const hash = hashIndex === -1 ? "" : baseUrl.slice(hashIndex);
    const separator = url.includes("?")
      ? url.endsWith("?") || url.endsWith("&")
        ? ""
        : "&"
      : "?";

    return `${url}${separator}${queryString}${hash}`;
  };

  const parseFetchResult = async <OutputType>(
    result: Response,
  ): Promise<FetchOutput<OutputType>> => {
    try {
      const responseBody = await result.text();

      if (responseBody === "") {
        return {
          result: undefined,
          statusCode: result.status,
        };
      }

      return {
        result: JSON.parse(responseBody) as OutputType,
        statusCode: result.status,
      };
    } catch (exception) {
      return {
        result: undefined,
        statusCode: result.status,
        error: exception,
      };
    }
  };

  const runFetch = async <OutputType>(
    endpointUrl: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    headers?: HeadersInit,
    body?: BodyInit,
    signal?: AbortSignal,
  ): Promise<FetchOutput<OutputType>> => {
    const requestHeaders = new Headers(headers);
    if (
      (method === "POST" || method === "PUT" || method === "PATCH") &&
      !requestHeaders.has("Content-Type")
    ) {
      requestHeaders.set("Content-Type", "application/json");
    }

    const result = await fetch(endpointUrl, {
      method,
      headers: requestHeaders,
      body,
      signal,
    });

    return parseFetchResult<OutputType>(result);
  };

  const fetchGet = async <OutputType>(
    endpointUrl: string,
    options?: FetchOptions,
    headers?: HeadersInit,
    signal?: AbortSignal,
  ): Promise<FetchOutput<OutputType>> => {
    const fetchUrl = buildUrl(endpointUrl, options);

    return runFetch(fetchUrl, "GET", headers, undefined, signal);
  };

  const fetchPost = async <OutputType>(
    endpointUrl: string,
    options?: FetchOptions,
    headers?: HeadersInit,
    signal?: AbortSignal,
  ): Promise<FetchOutput<OutputType>> => {
    return runFetch(
      endpointUrl,
      "POST",
      headers,
      JSON.stringify(options),
      signal,
    );
  };

  const fetchPut = async <OutputType>(
    endpointUrl: string,
    options?: FetchOptions,
    headers?: HeadersInit,
    signal?: AbortSignal,
  ): Promise<FetchOutput<OutputType>> => {
    return runFetch(
      endpointUrl,
      "PUT",
      headers,
      JSON.stringify(options),
      signal,
    );
  };

  const fetchPatch = async <OutputType>(
    endpointUrl: string,
    options?: FetchOptions,
    headers?: HeadersInit,
    signal?: AbortSignal,
  ): Promise<FetchOutput<OutputType>> => {
    return runFetch(
      endpointUrl,
      "PATCH",
      headers,
      JSON.stringify(options),
      signal,
    );
  };

  const fetchDelete = async <OutputType>(
    endpointUrl: string,
    options?: FetchOptions,
    headers?: HeadersInit,
    signal?: AbortSignal,
  ): Promise<FetchOutput<OutputType>> => {
    const fetchUrl = buildUrl(endpointUrl, options);

    return runFetch(fetchUrl, "DELETE", headers, undefined, signal);
  };

  return {
    get: fetchGet,
    post: fetchPost,
    put: fetchPut,
    patch: fetchPatch,
    delete: fetchDelete,
  };
};
