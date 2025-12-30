import React, { useState, useMemo, useCallback } from "react";
import "./PaymentPage.css";
import { PaymentSummary } from "../cart/PaymentSummary";

const Icons = {
  Check: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  GPay: () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  ),
  CreditCard: () => (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  ),
};

// ============ PAYMENT CARD COMPONENT ============
const PaymentCard = ({ id, label, icon, selected, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`payment-method-card ${
      selected ? "payment-method-card-selected" : ""
    }`}
  >
    {selected && (
      <div className="payment-card-check-badge">
        <Icons.Check />
      </div>
    )}
    <div className="payment-card-icon">{icon}</div>
    <span className="payment-card-label">{label}</span>
  </button>
);

// ============ PAYMENT INPUT FIELDS COMPONENT ============
const PaymentInputFields = ({ method, formData, setFormData }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // G-Pay Payment Method
  if (method === "gpay") {
    return (
      <div className="payment-inputs-grid">
        <div className="payment-input-group payment-input-full">
          <label className="payment-input-label">UPI ID / Phone Number</label>
          <input
            type="text"
            value={formData.upiId || ""}
            onChange={(e) => handleChange("upiId", e.target.value)}
            placeholder="Enter UPI ID or phone number"
            className="payment-input"
          />
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">Coupon Code</label>
          <div className="payment-coupon-input-wrapper">
            <input
              type="text"
              value={formData.coupon || ""}
              onChange={(e) => handleChange("coupon", e.target.value)}
              placeholder="Enter code"
              className="payment-input"
            />
            <button className="payment-apply-button">Apply</button>
          </div>
        </div>
        <div className="payment-input-group payment-input-full">
          <label className="payment-input-label">Add Tip</label>
          <div className="payment-tip-input-wrapper">
            <span className="payment-currency-symbol">$</span>
            <input
              type="text"
              value={formData.tip || ""}
              onChange={(e) => handleChange("tip", e.target.value)}
              className="payment-input payment-input-currency"
            />
          </div>
        </div>
      </div>
    );
  }

  // Card Payment Method
  if (method === "card") {
    return (
      <div className="payment-inputs-grid">
        <div className="payment-input-group ">
          <label className="payment-input-label">Card Number</label>
          <input
            type="text"
            value={formData.cardNumber || ""}
            onChange={(e) => handleChange("cardNumber", e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="payment-input"
          />
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">Cardholder Name</label>
          <input
            type="text"
            value={formData.cardName || ""}
            onChange={(e) => handleChange("cardName", e.target.value)}
            placeholder="Enter name on card"
            className="payment-input"
          />
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">Expiry Date</label>
          <input
            type="text"
            value={formData.expiryDate || ""}
            onChange={(e) => handleChange("expiryDate", e.target.value)}
            placeholder="MM/YY"
            maxLength="5"
            className="payment-input"
          />
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">CVV</label>
          <input
            type="text"
            value={formData.cvv || ""}
            onChange={(e) => handleChange("cvv", e.target.value)}
            placeholder="123"
            maxLength="3"
            className="payment-input"
          />
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">Coupon Code</label>
          <div className="payment-coupon-input-wrapper">
            <input
              type="text"
              value={formData.coupon || ""}
              onChange={(e) => handleChange("coupon", e.target.value)}
              placeholder="Enter code"
              className="payment-input"
            />
            <button className="payment-apply-button">Apply</button>
          </div>
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">Add Tip</label>
          <div className="payment-tip-input-wrapper">
            <span className="payment-currency-symbol">$</span>
            <input
              type="text"
              value={formData.tip || ""}
              onChange={(e) => handleChange("tip", e.target.value)}
              className="payment-input payment-input-currency"
            />
          </div>
        </div>
      </div>
    );
  }

  // Cash on Delivery
  if (method === "cash") {
    return (
      <div className="payment-inputs-grid">
        {/* <div className="payment-input-group payment-input-full">
          <label className="payment-input-label">Delivery Address</label>
          <textarea
            value={formData.deliveryAddress || ""}
            onChange={(e) => handleChange("deliveryAddress", e.target.value)}
            placeholder="Enter delivery address"
            className="payment-input payment-textarea"
            rows="3"
          />
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">Contact Number</label>
          <input
            type="tel"
            value={formData.contactNumber || ""}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
            placeholder="Enter phone number"
            className="payment-input"
          />
        </div> */}
        <div className="payment-input-group ">
          <label className="payment-input-label">Add Tip</label>
          <div className="payment-tip-input-wrapper">
            <span className="payment-currency-symbol">$</span>
            <input
              type="text"
              value={formData.tip || ""}
              onChange={(e) => handleChange("tip", e.target.value)}
              className="payment-input payment-input-currency"
            />
          </div>
        </div>
      </div>
    );
  }

  // Gift Card
  if (method === "gift") {
    return (
      <div className="payment-inputs-grid">
        <div className="payment-input-group payment-input-full">
          <label className="payment-input-label">Gift Card Number</label>
          <input
            type="text"
            value={formData.giftCardNumber || ""}
            onChange={(e) => handleChange("giftCardNumber", e.target.value)}
            placeholder="Enter gift card number"
            className="payment-input"
          />
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">PIN</label>
          <input
            type="text"
            value={formData.giftCardPin || ""}
            onChange={(e) => handleChange("giftCardPin", e.target.value)}
            placeholder="Enter PIN"
            maxLength="4"
            className="payment-input"
          />
        </div>
        <div className="payment-input-group payment-input-full">
          <label className="payment-input-label">Add Tip</label>
          <div className="payment-tip-input-wrapper">
            <span className="payment-currency-symbol">$</span>
            <input
              type="text"
              value={formData.tip || ""}
              onChange={(e) => handleChange("tip", e.target.value)}
              className="payment-input payment-input-currency"
            />
          </div>
        </div>
      </div>
    );
  }

  // Gift Card
  if (method === "coupon") {
    return (
      <div className="payment-inputs-grid">
        <div className="payment-input-group payment-input-full">
          <label className="payment-input-label">Coupon Code</label>
          <div className="payment-coupon-input-wrapper">
            <input
              type="text"
              value={formData.couponCode || ""}
              onChange={(e) => handleChange("couponCode", e.target.value)}
              placeholder="Enter coupon code"
              className="payment-input"
            />
            <button className="payment-apply-button">Verify</button>
          </div>
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">Email Address</label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email address"
            className="payment-input"
          />
        </div>
        <div className="payment-input-group">
          <label className="payment-input-label">Add Tip</label>
          <div className="payment-tip-input-wrapper">
            <span className="payment-currency-symbol">$</span>
            <input
              type="text"
              value={formData.tip || ""}
              onChange={(e) => handleChange("tip", e.target.value)}
              className="payment-input payment-input-currency"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ============ PAYMENT HEADER ============
const PaymentHeader = () => {
  return (
    <header className="payment-header">
      <div>
        <h2 className="payment-page-title">Payment Processing</h2>
        <p className="payment-page-subtitle">
          Select payment method and complete the transaction
        </p>
      </div>
    </header>
  );
};

// ============ PAYMENT PAGE ============
export const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [formData, setFormData] = useState({
    tip: "10.00",
  });

  const INITIAL_ITEMS = [
    {
      id: "1",
      name: "Chicken BBQ pizza with mexican flavoured toppings",
      description: "3 Large pan pizzas, fries, burger",
      price: 100.0,
      quantity: 1,
      image: "https://picsum.photos/seed/pizza/200/200",
    },
    {
      id: "2",
      name: "Mushroom salad",
      description: "3 Large pan pizzas, fries, burger",
      price: 100.0,
      quantity: 3,
      image: "https://picsum.photos/seed/salad/200/200",
    },
    {
      id: "3",
      name: "Grape juice",
      description: "",
      price: 100.0,
      quantity: 2,
      image: "https://picsum.photos/seed/juice/200/200",
    },
    {
      id: "4",
      name: "Mushroom sandwich combo",
      description: "3 Large pan pizzas, fries, burger, Large",
      price: 100.0,
      quantity: 1,
      image: "https://picsum.photos/seed/sandwich/200/200",
    },
    {
      id: "5",
      name: "Cappuccino",
      description: "",
      price: 100.0,
      quantity: 2,
      image: "https://picsum.photos/seed/coffee/200/200",
    },
  ];

  const [cartItems, setCartItems] = useState(INITIAL_ITEMS);

  const totals = useMemo(() => {
    const subTotal = cartItems.reduce(
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

  const handlePaymentSelect = useCallback((id) => {
    setSelectedMethod(id);
    // Reset form data when switching payment methods, but keep tip
    setFormData((prev) => ({ tip: prev.tip || "10.00" }));
  }, []);

  return (
    <div className="payment-page-wrapper">
      <PaymentHeader />

      <div className="payment-content-grid">
        {/* Left Panel: Payment Method Selection */}
        <div className="payment-methods-panel">
          <div className="payment-panel-header">
            <h2 className="payment-panel-title">Payment Method</h2>
            <span className="payment-select-badge">Select one</span>
          </div>

          <div className="payment-methods-grid">
            <PaymentCard
              id="gpay"
              label="G-pay"
              icon={<Icons.GPay />}
              selected={selectedMethod === "gpay"}
              onClick={handlePaymentSelect}
            />
            <PaymentCard
              id="card"
              label="Card"
              icon={<Icons.CreditCard />}
              selected={selectedMethod === "card"}
              onClick={handlePaymentSelect}
            />
            <PaymentCard
              id="cash"
              label="Cash On Delivery"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              selected={selectedMethod === "cash"}
              onClick={handlePaymentSelect}
            />
            {/* <PaymentCard
              id="gift"
              label="Gift Card"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              }
              selected={selectedMethod === "gift"}
              onClick={handlePaymentSelect}
            /> */}
            <PaymentCard
              id="coupon"
              label="Gift Card"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              }
              selected={selectedMethod === "coupon"}
              onClick={handlePaymentSelect}
            />
          </div>

          <div className="payment-terminal-section">
            <div className="payment-terminal-icon">
              <Icons.CreditCard />
            </div>
            <h3 className="payment-terminal-title">
              {selectedMethod === "card"
                ? "Use Card Terminal"
                : selectedMethod === "gpay"
                ? "Scan QR Code"
                : selectedMethod === "cash"
                ? "Cash on Delivery"
                : selectedMethod === "gift"
                ? "Redeem Gift Card"
                : "Apply Coupon Code"}
            </h3>
            <p className="payment-terminal-description">
              {selectedMethod === "card"
                ? "Please follow the instructions on the card reader to complete the payment with credit or debit card."
                : selectedMethod === "gpay"
                ? "Scan the QR code with your Google Pay app or enter your UPI ID to complete the transaction."
                : selectedMethod === "cash"
                ? "You can pay in cash when your order is delivered to your doorstep."
                : selectedMethod === "gift"
                ? "Enter your gift card number and PIN to redeem the balance for this purchase."
                : "Enter your coupon code to redeem your gift card discount."}
            </p>
          </div>

          {/* Dynamic Payment Input Fields */}
          <PaymentInputFields
            method={selectedMethod}
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        {/* Right Panel: Order Summary */}
        <div className="payment-section-right">
          <PaymentSummary totals={totals} />
        </div>
      </div>
    </div>
  );
};
