import React from "react";
import { useFetch, type FetchOutput } from "../useFetch";

export interface useFetchStoriesSetupProps {
  url: string;
  type: unknown;
}

export const UseFetchStoriesSetup = (props: useFetchStoriesSetupProps) => {
  const [isFetching, setIsFetching] = React.useState(false);
  const [response, setResponse] = React.useState<
    FetchOutput<typeof props.type> | undefined
  >(undefined);

  const { get } = useFetch();

  const executeFetch = React.useCallback(async () => {
    setIsFetching(true);
    const response = await get<typeof props.type>(props.url);

    console.debug("Response from fetch:", response);
    setResponse(response);

    setIsFetching(false);

    return response;
  }, []);

  React.useEffect(() => {
    executeFetch();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {isFetching && <p>Loading...</p>}
      {!isFetching && (
        <div>
          <p>Response: </p>
          <pre style={{ maxWidth: "90%" }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
