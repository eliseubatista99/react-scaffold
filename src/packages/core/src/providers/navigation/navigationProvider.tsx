import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export interface NavigationProviderRoute {
  path: string;
  render: React.ReactNode;
}

export interface NavigationProviderInputProps {
  isReady?: boolean;
  routes: NavigationProviderRoute[];
  children?: React.ReactNode;
}

export const NavigationProvider = ({
  isReady = true,
  routes,
  children,
}: NavigationProviderInputProps) => {
  const routesList = routes.map((route, index) => (
    <Route
      key={`${route.path}-${index}`}
      path={route.path}
      element={route.render}
    />
  ));

  return (
    <BrowserRouter>
      <>
        {isReady && <Routes>{routesList}</Routes>}
        {children}
      </>
    </BrowserRouter>
  );
};
