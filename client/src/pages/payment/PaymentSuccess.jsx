import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get("order_id");

    return (
        <div className="payment-page-wrapper">
            <div className="payment-redirect-container">
                <div className="stripe-success-card">
                    <div className="stripe-success-icon-wrap">
                        <span className="material-icons-outlined stripe-success-icon">check_circle</span>
                    </div>
                    <h2 className="stripe-success-title">Payment Successful! 🎉</h2>
                    <p className="stripe-success-subtitle">
                        Your order has been confirmed and is being prepared.
                    </p>
                    {orderId && (
                        <p className="stripe-success-order-id">
                            Order ID: <span>#{orderId.slice(0, 8).toUpperCase()}…</span>
                        </p>
                    )}
                    <div className="stripe-success-actions">
                        <button className="stripe-pay-button" onClick={() => navigate("/myorders")}>
                            <span className="material-icons-outlined">receipt_long</span>
                            View My Orders
                        </button>
                        <button className="stripe-back-button" onClick={() => navigate("/restaurants")}>
                            <span className="material-icons-outlined">storefront</span>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
