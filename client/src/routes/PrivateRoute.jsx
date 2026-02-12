import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../store/api/authApi";
import privateRoutes from "./privateRoutes";

const PrivateRoute = () => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // Skip query if not authenticated
  const { data: userData, isLoading } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  const currentRoute = privateRoutes.find(r => `/${r.path}` === location.pathname);
  const userRole = userData?.role?.name;

  if (currentRoute?.roles && userRole) {
    const isAllowed = currentRoute.roles.includes(userRole);

    if (!isAllowed) {
      // Auto-redirection logic
      if (userRole === 'restaurant_owner' && location.pathname === '/profile') {
        return <Navigate to="/business_profile" replace />;
      }
      if (userRole === 'customer' && location.pathname === '/business_profile') {
        return <Navigate to="/profile" replace />;
      }

      // Fallback redirect if they hit a page they aren't supposed to
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
