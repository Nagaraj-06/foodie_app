import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import HotelIcon from "@mui/icons-material/Hotel";
import ItemsIcon from "@mui/icons-material/FoodBank";
import OrderIcon from "@mui/icons-material/OnlinePredictionRounded";
import CartIcon from "@mui/icons-material/CardGiftcard";
import profilePic from "../../assets/profile.png";
import nestelPic from "../../assets/nestle.png";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const [active, setActive] = useState("hotels");
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="top">
        <button className="child top-btn">
          <MenuIcon className="icon" />
        </button>
      </div>
      <div className="middle">
        <button
          className={`child ${active === "hotels" ? "selected" : ""}`}
          onClick={() => {
            setActive("hotels");
            navigate("/hotels");
          }}
        >
          <HotelIcon className="icon" />
          <span className={active === "hotels" ? "bold" : ""}>Hotels</span>
        </button>
        {/* <button
          className={`child ${active === "items" ? "selected" : ""}`}
          onClick={() => {
            setActive("items");
            navigate("/items");
          }}
        >
          <ItemsIcon className="icon" />
          <span>Items</span>
        </button> */}
        <button
          className={`child ${active === "orders" ? "selected" : ""}`}
          onClick={() => {
            setActive("myorders");
            navigate("/myorders");
          }}
        >
          <OrderIcon className="icon" />
          <span>Orders</span>
        </button>

        <button
          className={`child ${active === "carts" ? "selected" : ""}`}
          onClick={() => {
            setActive("carts");
            navigate("/carts");
          }}
        >
          <CartIcon className="icon" />
          <span>Cart</span>
        </button>
      </div>

      <div className="bottom">
        <button className="child bottom-btn">
          <img src={nestelPic} alt="my pic" className="nestlePic"></img>
        </button>
        <button className="child bottom-btn">
          <img src={profilePic} alt="my pic" className="profilePic"></img>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
