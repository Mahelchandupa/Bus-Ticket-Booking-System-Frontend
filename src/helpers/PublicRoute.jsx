const PublicRoute = ({ isAuthenticated, redirectPath = "/" }) => {
    return isAuthenticated ? <Navigate to={redirectPath} replace /> : <Outlet />;
  };
  