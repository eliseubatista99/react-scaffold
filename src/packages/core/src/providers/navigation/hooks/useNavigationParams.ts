import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type NavigationParamValue = string | number | boolean | null | undefined;
export type NavigationParamInput =
  | NavigationParamValue
  | readonly NavigationParamValue[];

export interface NavigationParams {
  getAll: () => Record<string, string>;
  getAllValues: (key: string) => string[];
  get: (key: string) => string | null;
  getMany: (keys: readonly string[]) => Record<string, string | null>;
  set: (key: string, value: NavigationParamInput) => void;
  setMany: (values: Record<string, NavigationParamInput>) => void;
  remove: (key: string) => void;
  removeMany: (keys: readonly string[]) => void;
  removeAll: () => void;
}

const appendValues = (
  params: URLSearchParams,
  key: string,
  value: NavigationParamInput,
) => {
  if (value === null || value === undefined) {
    return;
  }

  if (!Array.isArray(value)) {
    params.set(key, String(value));
    return;
  }

  params.delete(key);
  value.forEach((item) => {
    if (item !== null && item !== undefined) {
      params.append(key, String(item));
    }
  });
};

export const useNavigationParams = (): NavigationParams => {
  const [searchParams, setSearchParams] = useSearchParams();

  const allParams = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  const getMany = useCallback(
    (keys: readonly string[]) => {
      const result: Record<string, string | null> = {};
      keys.forEach((key) => {
        result[key] = searchParams.get(key);
      });
      return result;
    },
    [searchParams],
  );

  const get = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  );

  const getAllValues = useCallback(
    (key: string) => searchParams.getAll(key),
    [searchParams],
  );

  const remove = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(key);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const removeMany = useCallback(
    (keys: readonly string[]) => {
      const newParams = new URLSearchParams(searchParams);

      keys.forEach((key) => {
        newParams.delete(key);
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const removeAll = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const set = useCallback(
    (key: string, value: NavigationParamInput) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        if (value === null || value === undefined) {
          params.delete(key);
        } else {
          appendValues(params, key, value);
        }

        return params;
      });
    },
    [setSearchParams],
  );

  const setMany = useCallback(
    (values: Record<string, NavigationParamInput>) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(values).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            params.delete(key);
          } else {
            appendValues(params, key, value);
          }
        });

        return params;
      });
    },
    [setSearchParams],
  );

  return {
    getAll: () => allParams,
    getAllValues,
    get,
    getMany,
    set,
    setMany,
    remove,
    removeMany,
    removeAll,
  };
};
