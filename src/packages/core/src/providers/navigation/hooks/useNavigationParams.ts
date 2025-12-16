import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useNavigationParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const allParams = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const getMany = useCallback(
    (keys: string[]) => {
      const result: Record<string, string | null> = {};
      keys.forEach((key) => {
        result[key] = searchParams.get(key);
      });
      return result;
    },
    [searchParams]
  );

  const get = useCallback(
    <T>(key: string) => {
      const data = searchParams.get(key);

      if (data == null || data == undefined) {
        return data;
      }

      return data as T;
    },
    [searchParams]
  );

  const remove = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(key);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const removeMany = useCallback(
    (keys: string[]) => {
      const newParams = new URLSearchParams(searchParams);

      keys.forEach((key) => {
        newParams.delete(String(key));
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const removeAll = useCallback(() => {
    setSearchParams({});
  }, [searchParams, setSearchParams]);

  const set = useCallback(
    (key: string, value: any) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        if (value == null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }

        return params;
      });
    },
    [setSearchParams]
  );

  const setMany = useCallback(
    (values: Record<string, any>) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(values).forEach(([key, value]) => {
          if (value == null) {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
        });

        return params;
      });
    },
    [setSearchParams]
  );

  return {
    getAll: () => allParams,
    get,
    getMany,
    set,
    setMany,
    remove,
    removeMany,
    removeAll,
  };
};
