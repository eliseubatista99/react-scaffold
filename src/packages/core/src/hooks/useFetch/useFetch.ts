// eslint-disable-next-line @typescript-eslint/no-explicit-any
type runFetchOptions = Record<string, any>;

export const useFetch = () => {
  const buildUrl = (baseUrl: string, options?: runFetchOptions) => {
    let optionsCount = 0;
    let finalUrl = `${baseUrl}`;

    for (const key in options) {
      if (optionsCount === 0) {
        finalUrl = `${finalUrl}?`;
      }

      const value = options[key];

      //If this is not the first option param, add an &
      if (optionsCount > 0) {
        finalUrl = `${finalUrl}&`;
      }

      //add the key and the value
      finalUrl = `${finalUrl}${key}=${value}`;
      //Count one more option
      optionsCount++;
    }

    return finalUrl;
  };

  const runFetch = async <OutputType>(
    endpointUrl: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    headers: HeadersInit,
    options?: runFetchOptions
  ): Promise<OutputType> => {
    const fetchUrl = buildUrl(endpointUrl, options);

    const result = await fetch(fetchUrl, {
      method,
      headers,
    });
    const jsonResult = await result.json();

    return jsonResult as OutputType;
  };

  const fetchGet = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions
  ): Promise<OutputType> => {
    return runFetch(endpointUrl, "GET", {}, options);
  };

  const fetchPost = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions
  ): Promise<OutputType> => {
    return runFetch(
      endpointUrl,
      "POST",
      { "Content-Type": "application/json" },
      options
    );
  };

  const fetchPut = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions
  ): Promise<OutputType> => {
    return runFetch(
      endpointUrl,
      "PUT",
      { "Content-Type": "application/json" },
      options
    );
  };

  const fetchPatch = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions
  ): Promise<OutputType> => {
    return runFetch(
      endpointUrl,
      "PATCH",
      { "Content-Type": "application/json" },
      options
    );
  };

  const fetchDelete = async <OutputType>(
    endpointUrl: string,
    options?: runFetchOptions
  ): Promise<OutputType> => {
    return runFetch(endpointUrl, "DELETE", {}, options);
  };

  return {
    get: fetchGet,
    post: fetchPost,
    put: fetchPut,
    patch: fetchPatch,
    delete: fetchDelete,
  };
};
