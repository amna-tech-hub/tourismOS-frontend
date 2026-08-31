// src/layouts/RootLayout.jsx

import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <Outlet />;
};

export default RootLayout;