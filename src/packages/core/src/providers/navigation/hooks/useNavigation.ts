import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationProviderContext } from "../navigationContext";
import { useNavigationParams } from "./useNavigationParams";

export type GoToParams = {
  path: string;
  addToHistory?: boolean;
  params?: Record<string, unknown>;
};

export type GoBackParams = {
  steps?: number;
  defaultBackPath?: string;
  params?: Record<string, unknown>;
};

const buildUrlWithParams = (data: GoToParams) => {
  const url = new URL(data.path, "http://dummy-base");

  if (data.params) {
    Object.entries(data.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.pathname + url.search;
};

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationParams = useNavigationParams();

  const {
    history,
    addToHistory,
    popFromHistory,
    replaceHistory,
  } = useContext(NavigationProviderContext);

  const goTo = React.useCallback(
    (data: GoToParams) => {
      const url = buildUrlWithParams(data);
      const shouldAddToHistory = data.addToHistory !== false;

      if (shouldAddToHistory) {
        navigate(url);
        addToHistory(url);
      } else {
        navigate(url, { replace: true });

        if (history.length > 0) {
          popFromHistory(1);

          addToHistory(url);
        }
      }
    },
    [navigate, history, addToHistory, popFromHistory],
  );

  const goBack = React.useCallback(
    (data: GoBackParams = {}) => {
      if (history.length > 0) {
        let finalSteps = data.steps || 1;

        if (history.length < finalSteps) {
          finalSteps = history.length;
        }

        navigate(-finalSteps);

        popFromHistory(finalSteps);
      } else if (data.defaultBackPath) {
        goTo({
          path: data.defaultBackPath,
          addToHistory: false,
          params: { ...data.params },
        });
      }
    },
    [navigate, history, popFromHistory, goTo],
  );

  const clearHistory = React.useCallback(() => {
    replaceHistory([]);
  }, [replaceHistory]);

  return {
    currentPath: location.pathname,
    history,
    searchParams: navigationParams,
    goBack,
    goTo,
    clearHistory,
  };
};
