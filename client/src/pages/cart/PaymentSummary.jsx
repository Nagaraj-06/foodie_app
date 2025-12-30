import { useNavigate } from "react-router-dom";
import "./PaymentSummary.css";

export const PaymentSummary = ({ totals }) => {
  const navigate = useNavigate();

  return (
    <div className="payment-card">
      <header className="payment-header">
        <h2 className="payment-title">Payment summary</h2>
        <div className="payment-user">
          <span
            className="material-icons-outlined"
            style={{ fontSize: "1.125rem" }}
          >
            person
          </span>
          <span className="payment-user-name">Ashwin</span>
        </div>
      </header>

      <div className="payment-body">
        <div className="summary-rows">
          <SummaryRow label="Sub total" value={totals.subTotal} />
          <SummaryRow label="Taxable amount" value={totals.taxableAmount} />
          <SummaryRow label="Total tax" value={totals.totalTax} />
        </div>

        <div className="grand-total-section">
          <div className="grand-total-row">
            <span className="grand-total-label">Grand Total</span>
            <span className="grand-total-value">
              SAR {totals.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <button className="add-notes-button">
          <span className="material-icons-outlined">add_circle_outline</span>
          Add notes
        </button>

        <div className="utility-buttons">
          <UtilityButton icon="person" label="Customer" />
          <UtilityButton icon="sell" label="Coupon" />
          <UtilityButton icon="discount" label="Discount" />
        </div>
      </div>

      <div className="payment-footer">
        <button className="print-button">
          <span className="material-icons-outlined">print</span>
          Print bill
        </button>
        <button className="payment-button" onClick={() => navigate("/payment")}>
          Pay
        </button>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="summary-row">
    <span className="summary-label">{label}</span>
    <span className="summary-value">SAR {value.toFixed(2)}</span>
  </div>
);

const UtilityButton = ({ icon, label }) => (
  <button className="utility-button">
    <span className="material-icons-outlined utility-icon">{icon}</span>
    <span className="utility-label">{label}</span>
  </button>
);
