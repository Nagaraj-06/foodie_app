import DashboardBackground from "../components/DashboardBackground/DashboardBackground";
import AddMenuItem from "../pages/addMenuItem/AddMenuItem";
import BusinessDetailsPage from "../pages/businessProfile/BusinessDetailsPage";
import BusinessRegister from "../pages/businessRegister/businessRegister";
import ProfilePage from "../pages/profile/profilePage";

const privateRoutes = [
  {
    path: "business_register",
    element: <BusinessRegister />,
    roles: ["restaurant_owner"],
  },
  {
    path: "add_menu_item",
    element: <AddMenuItem />,
    roles: ["restaurant_owner"],
  },
  {
    path: "profile",
    element: <ProfilePage />,
    roles: ["customer"],
  },
  {
    path: "dashboard",
    element: <DashboardBackground />,
    // dashboard might be for both with different views, but for now leave open or restricted
  },
  {
    path: "business_profile",
    element: <BusinessDetailsPage />,
    roles: ["restaurant_owner"],
  },
];

export default privateRoutes;
