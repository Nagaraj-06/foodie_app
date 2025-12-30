import { useRoutes } from "react-router-dom";
import publicRoutes from "./publicRoutes";
import Layout from "../layout/Layout";
import PrivateRoute from "./PrivateRoute";
import privateRoutes from "./privateRoutes";

const Routes = () => {
  const joinedRoutes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        ...publicRoutes,
        {
          element: <PrivateRoute />, // wrapper
          children: privateRoutes, // your protected pages
        },
      ],
    },
  ]);
  return joinedRoutes;
};

export default Routes;
