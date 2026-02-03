import React, { useState, useMemo } from "react";
import "./CartItem.css";

export const CartItem = ({ item, onUpdateQuantity, onRemoveItem, onToggleSelection }) => {
  return (
    <div className={`cart-item ${!item.selected ? 'item-unselected' : ''}`}>
      <div className="cart-item-selection">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => onToggleSelection(item.id)}
          className="cart-item-checkbox"
        />
      </div>
      <div className="cart-item-info">
        <img src={item.image} alt={item.name} className="cart-item-image" />
        <div className="cart-item-details">
          <h3 className="cart-item-name" title={item.name}>
            {item.name}
          </h3>
          {item.description && (
            <p className="cart-item-description">{item.description}</p>
          )}
        </div>
      </div>

      <div className="cart-item-quantity">
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

      <div className="cart-item-amount">
        {(item.price * item.quantity).toFixed(2)}
      </div>

      <div className="cart-item-delete">
        <button onClick={() => onRemoveItem(item.id)} className="delete-button">
          <span className="material-icons-outlined">delete</span>
        </button>
      </div>
    </div>
  );
};
