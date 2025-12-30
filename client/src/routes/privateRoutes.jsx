import DashboardBackground from "../components/DashboardBackground/DashboardBackground";
import AddMenuItem from "../pages/addMenuItem/AddMenuItem";
import BusinessDetailsPage from "../pages/businessProfile/BusinessDetailsPage";
import BusinessRegister from "../pages/businessRegister/businessRegister";
import ProfilePage from "../pages/profile/profilePage";

const privateRoutes = [
  {
    path: "business_register",
    element: <BusinessRegister />,
  },
  {
    path: "add_menu_item",
    element: <AddMenuItem />,
  },
  {
    path: "profile",
    element: <ProfilePage />,
  },
  {
    path: "dashboard",
    element: <DashboardBackground />,
  },
  {
    path: "business_profile",
    element: <BusinessDetailsPage />,
  },
];

export default privateRoutes;
