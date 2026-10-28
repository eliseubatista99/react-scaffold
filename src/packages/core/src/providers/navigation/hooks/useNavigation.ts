import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigationParams } from "./useNavigationParams";
import type { NavigationParamInput } from "./useNavigationParams";

export type GoToParams = {
  path: string;
  addToHistory?: boolean;
  params?: Record<string, NavigationParamInput>;
};

export type GoBackParams = {
  steps?: number;
};

const buildUrlWithParams = (data: GoToParams) => {
  const url = new URL(data.path, "http://dummy-base");

  if (data.params) {
    Object.entries(data.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          url.searchParams.delete(key);
          value.forEach((item) => {
            if (item !== undefined && item !== null) {
              url.searchParams.append(key, String(item));
            }
          });
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    });
  }

  return url.pathname + url.search + url.hash;
};

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationParams = useNavigationParams();

  const goTo = React.useCallback(
    (data: GoToParams) => {
      const url = buildUrlWithParams(data);
      navigate(url, { replace: data.addToHistory === false });
    },
    [navigate],
  );

  const goBack = React.useCallback(
    (data: GoBackParams = {}) => {
      const steps = data.steps ?? 1;

      if (!Number.isSafeInteger(steps) || steps < 1) {
        throw new RangeError("goBack steps must be a positive safe integer.");
      }

      navigate(-steps);
    },
    [navigate],
  );

  return {
    currentPath: location.pathname,
    searchParams: navigationParams,
    goBack,
    goTo,
  };
};
