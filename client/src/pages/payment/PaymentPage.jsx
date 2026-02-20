import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCreateCheckoutSessionMutation } from "../../store/api/paymentApi";
import "./PaymentPage.css";

// ---- Payment Page ----
export const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const launchCheckout = async () => {
      try {
        const baseUrl = window.location.origin;
        const res = await createCheckoutSession({
          order_id: orderId,
          success_url: `${baseUrl}/payment/success?order_id=${orderId}`,
          cancel_url: `${baseUrl}/carts`,
        }).unwrap();

        // Redirect to Stripe Hosted Checkout
        window.location.href = res.data.checkout_url;
      } catch (err) {
        console.error(err);
        setError(err?.data?.message || "Failed to initialize payment. Please go back and try again.");
      }
    };

    launchCheckout();
  }, [orderId, createCheckoutSession]);

  return (
    <div className="payment-page-wrapper">
      <header className="payment-header">
        <div className="payment-header-brand">
          <span className="payment-header-icon material-icons-outlined">payment</span>
          <div>
            <h2 className="payment-page-title">Redirecting to Checkout…</h2>
            <p className="payment-page-subtitle">You'll be taken to Stripe's secure payment page</p>
          </div>
        </div>
      </header>

      <div className="payment-redirect-container">
        {error ? (
          <div className="stripe-error-card">
            <span className="material-icons-outlined stripe-error-icon">error_outline</span>
            <h3 className="stripe-error-title">Something went wrong</h3>
            <p className="stripe-error-desc">{error}</p>
            <a href="/carts" className="stripe-back-button">
              <span className="material-icons-outlined">arrow_back</span>
              Back to Cart
            </a>
          </div>
        ) : (
          <div className="payment-loading-card">
            <div className="payment-spinner-ring">
              <div className="payment-spinner"></div>
            </div>
            <h3 className="payment-loading-title">Preparing your payment…</h3>
            <p className="payment-loading-subtitle">
              Please wait while we create a secure checkout session for your order.
            </p>

            {/* Stripe branding */}
            <div className="stripe-powered-badge">
              <span className="stripe-powered-lock material-icons-outlined">lock</span>
              <span>Secured &amp; powered by</span>
              <span className="stripe-brand-name">Stripe</span>
            </div>

            {/* Accepted cards row */}
            <div className="stripe-card-logos">
              <span className="stripe-card-logo-badge">VISA</span>
              <span className="stripe-card-logo-badge">Mastercard</span>
              <span className="stripe-card-logo-badge">Amex</span>
              <span className="stripe-card-logo-badge">RuPay</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
