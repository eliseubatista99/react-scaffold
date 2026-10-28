import React from "react";
import { parsePath, useLocation, useNavigate } from "react-router-dom";
import { NavigationHistoryContext } from "../navigationHistoryContext";
import { useNavigationParams } from "./useNavigationParams";
import type { NavigationParamInput } from "./useNavigationParams";

export type GoToParams = {
  path: string;
  addToHistory?: boolean;
  params?: Record<string, NavigationParamInput>;
};

export type GoBackParams = {
  steps?: number;
  defaultBackPath?: string;
};

const buildNavigationTarget = (data: GoToParams) => {
  if (!data.params) {
    return data.path;
  }

  const target = parsePath(data.path);
  const searchParams = new URLSearchParams(target.search);

  Object.entries(data.params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        searchParams.delete(key);
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            searchParams.append(key, String(item));
          }
        });
      } else {
        searchParams.set(key, String(value));
      }
    }
  });

  const search = searchParams.toString();

  return {
    ...target,
    search: search ? `?${search}` : "",
  };
};

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const historyTracker = React.useContext(NavigationHistoryContext);
  const navigationParams = useNavigationParams();

  const goTo = React.useCallback(
    (data: GoToParams) => {
      const target = buildNavigationTarget(data);
      navigate(target, { replace: data.addToHistory === false });
    },
    [navigate],
  );

  const goBack = React.useCallback(
    (data: GoBackParams = {}) => {
      const steps = data.steps ?? 1;

      if (!Number.isSafeInteger(steps) || steps < 1) {
        throw new RangeError("goBack steps must be a positive safe integer.");
      }

      if (historyTracker && historyTracker.index < steps) {
        if (data.defaultBackPath !== undefined) {
          navigate(data.defaultBackPath, { replace: true });
          return;
        }
      }

      navigate(-steps);
    },
    [historyTracker, navigate],
  );

  return {
    currentPath: location.pathname,
    history:
      historyTracker?.entries.map((entry) => entry.path) ?? [
        `${location.pathname}${location.search}${location.hash}`,
      ],
    searchParams: navigationParams,
    goBack,
    goTo,
  };
};
