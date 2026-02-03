import React from "react";
import "./Sidebar.css";
import { NavItem } from "./NavItem";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        {/* <button className="logo-button">
          <span className="material-icons-outlined">store</span>
        </button> */}

        <nav className="sidebar-nav">
          <NavItem icon="dashboard" label="Dashboard" path="/dashboard" />
          <NavItem
            icon="add_business"
            label="RegisterBusiness"
            path="/business_register"
          />
          <NavItem icon="post_add" label="AddMenuItem" path="/add_menu_item" />
          <NavItem
            icon="storefront" 
            label="Restaurants"
            path="/restaurants"
          />
          <NavItem icon="receipt_long" label="MyOrders" path="/myorders" />
          <NavItem icon="shopping_cart" label="carts" path="/carts" />
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
