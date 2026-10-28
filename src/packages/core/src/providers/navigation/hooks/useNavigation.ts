import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNavigationParams } from "./useNavigationParams";

export type GoToParams = {
  path: string;
  addToHistory?: boolean;
  params?: Record<string, unknown>;
};

export type GoBackParams = {
  steps?: number;
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

  const goTo = React.useCallback(
    (data: GoToParams) => {
      const url = buildUrlWithParams(data);
      navigate(url, { replace: data.addToHistory === false });
    },
    [navigate],
  );

  const goBack = React.useCallback(
    (data: GoBackParams = {}) => {
      navigate(-(data.steps ?? 1));
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
