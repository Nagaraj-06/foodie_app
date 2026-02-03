import React, { useState, useMemo } from "react";
import "./CartMain.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import CartSummary from "./CartSummary";
import { PaymentSummary } from "./PaymentSummary";
import { Constants } from "./constants";
import { DeliveryAddress } from "../../components/DeliveryAddress/DeliveryAddress";
import AddressModal from "../../components/AddressModal/AddressModal";

const CartMain = () => {
  const [cartItems, setCartItems] = useState(
    Constants.map((item) => ({ ...item, selected: true }))
  );

  const toggleSelection = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleAll = (isSelected) => {
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, selected: isSelected }))
    );
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totals = useMemo(() => {
    const selectedItems = cartItems.filter((item) => item.selected);
    const subTotal = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxableAmount = subTotal * 0.95238;
    const totalTax = subTotal - taxableAmount;
    return {
      subTotal,
      taxableAmount,
      totalTax,
      grandTotal: subTotal,
    };
  }, [cartItems]);

  return (
    <div className="cart-container">
      <main className="cart-main-content">
        <SearchBar />
        <div className="cart-content-grid">
          <div className="cart-section">
            <CartSummary
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onToggleSelection={toggleSelection}
              onToggleAll={toggleAll}
              totals={totals}
            />
          </div>
          <div className="payment-section">
            <DeliveryAddress />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartMain;
