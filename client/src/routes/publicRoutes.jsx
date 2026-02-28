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
    path: "",
    element: <Hotels />,
  },
  {
    path: ":restaurantId",
    element: <Items />,
  },
  {
    path: ":restaurantId/items/:itemId/variants",
    element: <VariantPage />,
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
