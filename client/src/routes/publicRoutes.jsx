import Sidebar from "../components/sidebar/newSidebar/SideBar";
import CartMain from "../pages/cart/CartMain";
import Hotels from "../pages/hotels/Hotels";
import Items from "../pages/items/Items";
import { LoginScreen } from "../pages/login/LoginPage";
import MyOrders from "../pages/myOrders/MyOrders";
import { PaymentPage } from "../pages/payment/paymentPage";
import { VariantPage } from "../pages/variantsAdd/VariantPage";

const publicRoutes = [
  {
    path: "restaurants",
    element: <Hotels />,
  },
  {
    path: "restaurants/:restaurantName",
    element: <Items />,
  },
  {
    path: "carts",
    element: <CartMain />,
  },
  {
    path: "restaurants/:restaurantName/:itemName/variants",
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
    path: "login",
    element: <LoginScreen />,
  },
];

export default publicRoutes;
