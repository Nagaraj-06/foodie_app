import React from "react";
import "./ItemCard.css";
import { useNavigate } from "react-router-dom";

const ItemCard = ({ name, image, price, restaurantName }) => {
  const navigate = useNavigate();
  const encodedItemName = encodeURIComponent(name); // encode spaces, special chars
  const encodedRestaurentName = encodeURIComponent(restaurantName); // encode spaces, special chars

  return (
    <div
      className="item-card"
      onClick={() =>
        navigate(
          `/restaurants/${encodedRestaurentName}/${encodedItemName}/variants`
        )
      }
    >
      <div className="hotel-img">
        <img src={image} alt={name} className="hotel-img" />
      </div>

      <div className="item-info">
        <div className="item-header">
          <h3>{name}</h3>
          <p>₹{price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
