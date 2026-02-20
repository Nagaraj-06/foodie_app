import React, { useState, useMemo } from "react";
import "./CartSummary.css";
import { CartItem } from "./CartItem";

const CartSummary = ({ items, onUpdateQuantity, onRemoveItem, onToggleSelection, onToggleAll, totals, onPay }) => {
  const allSelected = items.length > 0 && items.every(item => item.selected);

  return (
    <div className="cart-summary-container">
      <div className="cart-header">
        <div className="cart-title-section">
          <h1>Cart summary</h1>
          <p>Order ID: 000001</p>
        </div>
        <div className="cart-header-actions">
          <label className="select-all-label">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onToggleAll(e.target.checked)}
            />
            <span>SELECT ALL</span>
          </label>
          <div className="action-buttons">
            <ActionButton icon="person_add" />
            <ActionButton icon="fullscreen" />
            <ActionButton icon="more_vert" />
          </div>
        </div>
      </div>

      <div className="cart-card">
        <div className="cart-table-header">
          <div className="header-checkbox"></div>
          <div className="header-item">Item</div>
          <div className="header-qty">Qty</div>
          <div className="header-amount">Amount (SAR)</div>
          <div className="header-actions"></div>
        </div>

        <div className="cart-items-container">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              onToggleSelection={onToggleSelection}
            />
          ))}
          {items.length === 0 && (
            <div className="empty-cart">
              <span className="material-icons-outlined empty-cart-icon">
                shopping_cart
              </span>
              <p>Your cart is empty</p>
            </div>
          )}
        </div>

        <div className="simple-total-card list-footer">
          <div className="total-row">
            <span>Grand Total</span>
            <span className="total-amount">
              ₹{totals.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon }) => (
  <button className="action-button">
    <span className="material-icons-outlined" style={{ fontSize: "1.25rem" }}>
      {icon}
    </span>
  </button>
);

export default CartSummary;
