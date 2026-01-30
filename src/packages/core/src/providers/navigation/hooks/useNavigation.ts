import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationProviderContext } from "../navigationContext";
import { useNavigationParams } from "./useNavigationParams";

export type GoToParams = {
  path: string;
  addToHistory?: boolean;
  params?: Record<string, unknown>;
};

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationParams = useNavigationParams();

  const navigationContext = useContext(NavigationProviderContext);

  const buildUrlWithParams = (data: GoToParams) => {
    const url = new URL(data.path, "http://dummy-base"); // dummy url

    if (data.params) {
      Object.entries(data.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.pathname + url.search;
  };

  const goTo = React.useCallback(
    (data: GoToParams) => {
      const url = buildUrlWithParams(data);
      const addToHistory = data.addToHistory !== false;

      if (addToHistory) {
        navigate(url);
        navigationContext.addToHistory(url);
      } else {
        navigate(url, { replace: true });

        if (navigationContext.history.length > 0) {
          navigationContext.popFromHistory(1);

          navigationContext.addToHistory(url);
        }
      }
    },
    [navigate, navigationContext.history],
  );

  const goBack = React.useCallback(
    (steps?: number) => {
      let finalSteps = steps || 1;

      if (navigationContext.history.length < finalSteps) {
        finalSteps = navigationContext.history.length;
      }

      navigate(-finalSteps);

      navigationContext.popFromHistory(finalSteps);
    },
    [navigate],
  );

  return {
    currentPath: location.pathname,
    history: navigationContext.history,
    searchParams: navigationParams,
    goBack,
    goTo,
  };
};
