import DashboardBackground from "../components/DashboardBackground/DashboardBackground";
import AddMenuItem from "../pages/addMenuItem/AddMenuItem";
import BusinessDetailsPage from "../pages/businessProfile/BusinessDetailsPage";
import BusinessRegister from "../pages/businessRegister/BusinessRegister";
import ProfilePage from "../pages/profile/profilePage";
import CartMain from "../pages/cart/CartMain";
import MyOrders from "../pages/myOrders/MyOrders";
import { PaymentPage } from "../pages/payment/PaymentPage";
import { PaymentSuccess } from "../pages/payment/PaymentSuccess";

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
    roles: ["customer", "restaurant_owner"],
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
  {
    path: "carts",
    element: <CartMain />,
    roles: ["customer"],
  },
  {
    path: "myorders",
    element: <MyOrders />,
    roles: ["customer"],
  },
  {
    path: "payment",
    element: <PaymentPage />,
    roles: ["customer"],
  },
  {
    path: "payment/success",
    element: <PaymentSuccess />,
    roles: ["customer"],
  },
];

export default privateRoutes;
