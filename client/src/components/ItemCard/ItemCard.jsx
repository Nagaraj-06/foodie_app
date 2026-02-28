import React from "react";
import "./ItemCard.css";
import { useNavigate } from "react-router-dom";

const ItemCard = ({ id, name, image, price, restaurantId }) => {
  const navigate = useNavigate();

  return (
    <div
      className="item-card"
      onClick={() =>
        navigate(
          `/${restaurantId}/items/${id}/variants`
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
