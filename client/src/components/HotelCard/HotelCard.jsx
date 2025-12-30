import React from "react";
import "./HotelCard.css";
import { useNavigate } from "react-router-dom";

const HotelCard = ({ name, image, location, rating }) => {
  const navigate = useNavigate();

  const encodedName = encodeURIComponent(name); // encode spaces, special chars

  return (
    <div
      className="hotel-card"
      onClick={() => navigate(`/restaurants/${encodedName}`)}
    >
      <div className="hotel-img">
        <img src={image} alt={name} cl assName="hotel-img" />
      </div>
      <div className="hotel-info">
        <div className="hotel-header">
          <h3 className="hotel-title">{name}</h3>
          <span className="hotel-rating">{"⭐".repeat(rating)}</span>
        </div>
        <p className="hotel-location">{location}</p>
      </div>
    </div>
  );
};

export default HotelCard;
