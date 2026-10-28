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

export type NavigationRoutesProps = NavigationProviderInputProps;

export const NavigationRoutes = ({
  isReady = true,
  routes,
  children,
}: NavigationRoutesProps) => {
  const routesList = routes.map((route, index) => (
    <Route
      key={`${route.path}-${index}`}
      path={route.path}
      element={route.render}
    />
  ));

  return (
    <>
      {isReady && <Routes>{routesList}</Routes>}
      {children}
    </>
  );
};

export const NavigationProvider = (props: NavigationProviderInputProps) => {
  return (
    <BrowserRouter>
      <NavigationRoutes {...props} />
    </BrowserRouter>
  );
};
