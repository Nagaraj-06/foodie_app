import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../store/api/authApi";
import { NavItem } from "./NavItem";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { data: userData } = useGetProfileQuery();
  const userRole = userData?.role?.name;

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <nav className="sidebar-nav">
          {userRole === "restaurant_owner" && (
            <>
              <NavItem icon="dashboard" label="Dashboard" path="/dashboard" />
              {userData.restaurants?.length > 0 ? (
                <NavItem
                  icon={
                    userData.restaurants[0].verification_status === "APPROVED"
                      ? "storefront"
                      : userData.restaurants[0].verification_status ===
                          "REJECTED"
                        ? "error"
                        : "pending"
                  }
                  label={
                    userData.restaurants[0].verification_status === "APPROVED"
                      ? "Business Details"
                      : userData.restaurants[0].verification_status ===
                          "REJECTED"
                        ? "Registration Rejected"
                        : "Verification Pending"
                  }
                  path="/business_profile"
                />
              ) : (
                <NavItem
                  icon="add_business"
                  label="Register Business"
                  path="/business_register"
                />
              )}
              <NavItem
                icon="post_add"
                label="Add Menu Item"
                path="/add_menu_item"
              />
            </>
          )}

          {userRole === "customer" && (
            <>
              <NavItem
                icon="storefront"
                label="Restaurants"
                path="/restaurants"
              />
              <NavItem icon="receipt_long" label="MyOrders" path="/myorders" />
              <NavItem icon="shopping_cart" label="carts" path="/carts" />
            </>
          )}

          {/* Default links for unauthenticated or other roles if any */}
          {!userRole && (
            <NavItem
              icon="storefront"
              label="Restaurants"
              path="/restaurants"
            />
          )}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <img
          src="https://picsum.photos/seed/user123/100/100"
          alt="Avatar"
          className="avatar"
          onClick={() => navigate("/profile")}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
