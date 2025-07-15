import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationProviderContext } from "./navigationContext";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationContext = useContext(NavigationProviderContext);

  const goTo = React.useCallback(
    (screenPath: string, alsoAddToHistory = true) => {
      if (screenPath !== location.pathname) {
        navigate(screenPath, { replace: true });
      }

      if (alsoAddToHistory) {
        navigationContext.addToHistory(screenPath);
      }
    },
    [location.pathname, navigate, navigationContext]
  );

  const goBack = React.useCallback(
    (steps?: number) => {
      const finalSteps = steps || 1;
      const resultScreen =
        navigationContext.history[history.length - 1 - finalSteps];

      navigationContext.popFromHistory(finalSteps);
      goTo(resultScreen, false);
    },
    [goTo, navigationContext]
  );

  const replaceHistory = React.useCallback(
    (newHistory: string[]) => {
      navigationContext.replaceHistory(newHistory);
    },
    [navigationContext]
  );

  return {
    currentPath: location.pathname,
    goBack,
    goTo,
    replaceHistory,
  };
};
