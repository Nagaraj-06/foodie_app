import React from "react";
import "./OrderCard.css";
import { OrderStatus } from "../../pages/myOrders/types";

const OrderCard = ({ order, onTrack }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "status-completed";
      case OrderStatus.IN_PROGRESS:
        return "status-in-progress";
      case OrderStatus.CANCELLED:
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const isLive = order.status === OrderStatus.IN_PROGRESS;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`order-card ${isLive ? "order-card-live" : ""}`}>
      <div className="order-card-content">
        {/* Order Image & Info */}
        <div className="order-info-wrapper">
          <div className="order-info-left">
            <div className="order-image-wrapper">
              <img
                src={order.imageUrl}
                alt={order.item}
                className="order-image"
              />
              {isLive && <div className="live-indicator" />}
            </div>
            <div className="order-details">
              <div className="order-header">
                <span className="order-id">#{order.id}</span>
                {isLive && <span className="live-badge">Live</span>}
              </div>
              <h3 className="order-item">
                {order.item}
                {order.additionalItemsCount > 0 && (
                  <span className="additional-items">
                    + {order.additionalItemsCount} item
                    {order.additionalItemsCount > 1 ? "s" : ""}
                  </span>
                )}
              </h3>
              <p className="order-date">{order.date}</p>
            </div>
          </div>

          {/* Status & Price */}
          <div className="order-price-status">
            <span className="order-price">${order.price.toFixed(2)}</span>
            <span className={`order-status ${getStatusClass(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="order-actions">
        <div className="action-buttons-left">
          {isLive ? (
            <button onClick={onTrack} className="track-button">
              <span className="material-symbols-outlined">local_shipping</span>
              Track Order
            </button>
          ) : (
            <button onClick={onTrack} className="summary-button">
              <span className="material-symbols-outlined">info</span>
              View Summary
            </button>
          )}
        </div>
        <div className="action-buttons-right">
          <button
            title="View Details"
            onClick={onTrack}
            className="icon-button"
          >
            <span className="material-symbols-outlined">visibility</span>
          </button>
          <button
            title="Print Receipt"
            onClick={handlePrint}
            className="icon-button"
          >
            <span className="material-symbols-outlined">print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
