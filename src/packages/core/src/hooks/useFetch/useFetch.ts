// eslint-disable-next-line @typescript-eslint/no-explicit-any
type runFetchOptions = Record<string, any>;

export type FetchOutput<TOut> = {
  result: TOut | undefined;
  statusCode: number;
  error?: unknown;
};

export const useFetch = () => {
  const buildUrl = (baseUrl: string, options?: runFetchOptions) => {
    if (!options) return baseUrl;

    const params = new URLSearchParams();

    for (const key in options) {
      const value = options[key];

      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const parseFetchResult = async <OutputType>(
    result: Response,
  ): Promise<FetchOutput<OutputType>> => {
    try {
      const jsonResult = await result.json();

      return {
        result: jsonResult as OutputType,
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
  ): Promise<FetchOutput<OutputType>> => {
    const result = await fetch(endpointUrl, {
      method,
      headers,
      body,
    });

    return parseFetchResult<OutputType>(result);
  };

  const fetchGet = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit,
  ): Promise<FetchOutput<OutputType>> => {
    const fetchUrl = buildUrl(endpointUrl, options);

    return runFetch(fetchUrl, "GET", { ...headers });
  };

  const fetchPost = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit,
  ): Promise<FetchOutput<OutputType>> => {
    return runFetch(
      endpointUrl,
      "POST",
      { "Content-Type": "application/json", ...headers },
      JSON.stringify(options),
    );
  };

  const fetchPut = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit,
  ): Promise<FetchOutput<OutputType>> => {
    return runFetch(
      endpointUrl,
      "PUT",
      { "Content-Type": "application/json", ...headers },
      JSON.stringify(options),
    );
  };

  const fetchPatch = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit,
  ): Promise<FetchOutput<OutputType>> => {
    return runFetch(
      endpointUrl,
      "PATCH",
      { "Content-Type": "application/json", ...headers },
      JSON.stringify(options),
    );
  };

  const fetchDelete = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit,
  ): Promise<FetchOutput<OutputType>> => {
    const fetchUrl = buildUrl(endpointUrl, options);

    return runFetch(fetchUrl, "DELETE", { ...headers });
  };

  return {
    get: fetchGet,
    post: fetchPost,
    put: fetchPut,
    patch: fetchPatch,
    delete: fetchDelete,
  };
};
