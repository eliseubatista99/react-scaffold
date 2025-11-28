// eslint-disable-next-line @typescript-eslint/no-explicit-any
type runFetchOptions = Record<string, any>;

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

  const runFetch = async <OutputType>(
    endpointUrl: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    headers?: HeadersInit,
    body?: BodyInit
  ): Promise<OutputType> => {
    const result = await fetch(endpointUrl, {
      method,
      headers,
      body,
    });
    const jsonResult = await result.json();

    return jsonResult as OutputType;
  };

  const fetchGet = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit
  ): Promise<OutputType> => {
    const fetchUrl = buildUrl(endpointUrl, options);

    return runFetch(fetchUrl, "GET", { ...headers });
  };

  const fetchPost = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit
  ): Promise<OutputType> => {
    return runFetch(
      endpointUrl,
      "POST",
      { "Content-Type": "application/json", ...headers },
      JSON.stringify(options)
    );
  };

  const fetchPut = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit
  ): Promise<OutputType> => {
    return runFetch(
      endpointUrl,
      "PUT",
      { "Content-Type": "application/json", ...headers },
      JSON.stringify(options)
    );
  };

  const fetchPatch = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit
  ): Promise<OutputType> => {
    return runFetch(
      endpointUrl,
      "PATCH",
      { "Content-Type": "application/json", ...headers },
      JSON.stringify(options)
    );
  };

  const fetchDelete = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions,
    headers?: HeadersInit
  ): Promise<OutputType> => {
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
