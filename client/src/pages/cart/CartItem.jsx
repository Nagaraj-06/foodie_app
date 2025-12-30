import React, { useState, useMemo } from "react";
import "./CartItem.css";

export const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="cart-item">
      <div className="item-info">
        <img src={item.image} alt={item.name} className="item-image" />
        <div className="item-details">
          <h3 className="item-name" title={item.name}>
            {item.name}
          </h3>
          {item.description && (
            <p className="item-description">{item.description}</p>
          )}
        </div>
      </div>

      <div className="item-quantity">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="qty-button"
        >
          -
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="qty-button"
        >
          +
        </button>
      </div>

      <div className="item-amount">
        {(item.price * item.quantity).toFixed(2)}
      </div>

      <div className="item-delete">
        <button onClick={() => onRemoveItem(item.id)} className="delete-button">
          <span className="material-icons-outlined">delete</span>
        </button>
      </div>
    </div>
  );
};
