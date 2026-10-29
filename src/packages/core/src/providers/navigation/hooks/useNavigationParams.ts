import { useCallback, useMemo, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

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
  const { search } = useLocation();
  const pendingSearchParams = useRef(new URLSearchParams(search));
  const observedSearch = useRef(search);

  if (observedSearch.current !== search) {
    observedSearch.current = search;
    pendingSearchParams.current = new URLSearchParams(search);
  }

  const allParams = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  const getAll = useCallback(() => allParams, [allParams]);

  const getMany = useCallback(
    (keys: readonly string[]) =>
      Object.fromEntries(keys.map((key) => [key, searchParams.get(key)])),
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

  const updateSearchParams = useCallback(
    (update: (params: URLSearchParams) => URLSearchParams) => {
      const updatedParams = update(
        new URLSearchParams(pendingSearchParams.current),
      );
      pendingSearchParams.current = new URLSearchParams(updatedParams);
      setSearchParams(updatedParams);
    },
    [setSearchParams],
  );

  const remove = useCallback(
    (key: string) => {
      updateSearchParams((params) => {
        params.delete(key);
        return params;
      });
    },
    [updateSearchParams],
  );

  const removeMany = useCallback(
    (keys: readonly string[]) => {
      updateSearchParams((params) => {
        keys.forEach((key) => {
          params.delete(key);
        });
        return params;
      });
    },
    [updateSearchParams],
  );

  const removeAll = useCallback(
    () => updateSearchParams(() => new URLSearchParams()),
    [updateSearchParams],
  );

  const set = useCallback(
    (key: string, value: NavigationParamInput) => {
      updateSearchParams((params) => {
        if (value === null || value === undefined) {
          params.delete(key);
        } else {
          appendValues(params, key, value);
        }
        return params;
      });
    },
    [updateSearchParams],
  );

  const setMany = useCallback(
    (values: Record<string, NavigationParamInput>) => {
      updateSearchParams((params) => {
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
    [updateSearchParams],
  );

  return {
    getAll,
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
