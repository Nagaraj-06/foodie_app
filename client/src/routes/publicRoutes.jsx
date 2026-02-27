import Sidebar from "../components/sidebar/newSidebar/Sidebar";
import CartMain from "../pages/cart/CartMain";
import Hotels from "../pages/hotels/Hotels";
import Items from "../pages/items/Items";
import { LoginScreen } from "../pages/login/LoginPage";
import AuthSuccess from "../pages/login/AuthSuccess";
import MyOrders from "../pages/myOrders/MyOrders";
import { PaymentPage } from "../pages/payment/PaymentPage";
import { PaymentSuccess } from "../pages/payment/PaymentSuccess";
import { VariantPage } from "../pages/variantsAdd/VariantPage";

const publicRoutes = [
  {
    path: "restaurants",
    element: <Hotels />,
  },
  {
    path: "restaurants/:restaurantId",
    element: <Items />,
  },
  {
    path: "carts",
    element: <CartMain />,
  },
  {
    path: "restaurants/:restaurantId/items/:itemId/variants",
    element: <VariantPage />,
  },
  {
    path: "myorders",
    element: <MyOrders />,
  },
  {
    path: "payment",
    element: <PaymentPage />,
  },
  {
    path: "payment/success",
    element: <PaymentSuccess />,
  },
  {
    path: "login",
    element: <LoginScreen />,
  },
  {
    path: "auth-success",
    element: <AuthSuccess />,
  },
];

export default publicRoutes;
