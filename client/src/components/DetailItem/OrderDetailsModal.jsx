import "./OrderDetailsModal.css";

const OrderDetailsModal = ({ order, onClose }) => {
  const totalTax = order.payment.subtotal * order.payment.taxRate;
  const grandTotal =
    order.payment.subtotal +
    totalTax -
    order.payment.discount +
    order.payment.serviceFee;

  return (
    <div className="modal-overlay-order" onClick={onClose}>
      <div
        className="modal-container-order"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-order">
          <div>
            <div className="modal-header-title">
              <h2 className="order-modal-title">Order #{order.id}</h2>
              <span className="order-modal-status">{order.status}</span>
            </div>
            <p className="order-modal-date">Created on {order.createdAt}</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body-order">
          <div className="modal-content-grid">
            <div className="modal-left-column">
              <div>
                <h3 className="section-title">
                  <span className="material-symbols-outlined">list_alt</span>
                  Order Items
                </h3>
                <div className="items-table-container">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th className="text-center">Qty</th>
                        <th className="text-right">Price</th>
                        <th className="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="item-cell">
                              <div className="item-icon">{item.icon}</div>
                              <div>
                                <p className="item-name">{item.name}</p>
                                <p className="item-description">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center item-qty">{item.qty}</td>
                          <td className="text-right item-price">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="text-right item-total">
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {order.kitchenNote && (
                <div className="kitchen-note">
                  <div className="kitchen-note-icon">
                    <span className="material-symbols-outlined">info</span>
                  </div>
                  <div>
                    <h4 className="kitchen-note-title">Kitchen Note</h4>
                    <p className="kitchen-note-text">{order.kitchenNote}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-right-column">
              <div className="customer-card">
                <h3 className="section-title-small">Customer Details</h3>
                <div className="customer-info">
                  <div className="customer-avatar">
                    {order.customer.initials}
                  </div>
                  <div>
                    <h4 className="customer-name">{order.customer.name}</h4>
                    <p className="customer-type">{order.customer.type}</p>
                  </div>
                </div>

                <div className="customer-details">
                  <DetailItem
                    icon="table_restaurant"
                    label="Table"
                    value={order.customer.table}
                  />
                  <DetailItem
                    icon="restaurant"
                    label="Type"
                    value={order.customer.orderType}
                  />
                  <DetailItem
                    icon="group"
                    label="Guests"
                    value={`${order.customer.guests} People`}
                  />
                  <DetailItem
                    icon="person"
                    label="Server"
                    value={order.customer.server}
                  />
                </div>
              </div>

              <div className="payment-card">
                <h3 className="section-title-small">Payment Summary</h3>
                <div className="payment-breakdown">
                  <SummaryRow label="Subtotal" value={order.payment.subtotal} />
                  <SummaryRow
                    label={`Tax (${order.payment.taxRate * 100}%)`}
                    value={totalTax}
                  />
                  <SummaryRow
                    label="Discount (VIP)"
                    value={-order.payment.discount}
                    isDiscount
                  />
                  <SummaryRow
                    label="Service Fee"
                    value={order.payment.serviceFee}
                  />
                </div>

                <div className="payment-total">
                  <span className="payment-total-label">Total Amount</span>
                  <span className="payment-total-value">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                <div className="payment-method">
                  <div className="payment-method-left">
                    <div className="payment-method-icon">
                      <span className="material-symbols-outlined">
                        credit_card
                      </span>
                    </div>
                    <div>
                      <p className="payment-method-type">Paid with Visa</p>
                      <p className="payment-method-card">
                        •••• {order.payment.cardLast4}
                      </p>
                    </div>
                  </div>
                  <div className="payment-method-right">
                    <p className="payment-tip-label">Tip Added</p>
                    <p className="payment-tip-value">
                      +${order.payment.tip.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="payment-status">
                  <div className="payment-status-indicator"></div>
                  <p className="payment-status-text">
                    Payment Captured Successfully
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer-order">
          <div className="modal-footer-actions">
            <button className="refund-button">
              <span className="material-symbols-outlined">undo</span>
              Refund Order
            </button>
            <button className="email-button">
              <span className="material-symbols-outlined">mail</span>
              Email Receipt
            </button>
          </div>
          <button className="print-button">
            <span className="material-symbols-outlined">print</span>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
