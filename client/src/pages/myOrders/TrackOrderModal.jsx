import React from "react";
import "./MyOrders.css";

const TrackOrderModal = ({ isOpen, onClose, trackingInfo }) => {
  if (!isOpen) return null;

  const steps = [
    { label: "Confirmed", icon: "check_circle", completed: true },
    { label: "Preparing", icon: "restaurant", completed: true },
    {
      label: "Out for Delivery",
      icon: "local_shipping",
      completed: true,
      active: true,
    },
    { label: "Arrived", icon: "home", completed: false },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />

      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">
              <span className="material-symbols-outlined">map</span>
            </div>
            <div>
              <h2 className="modal-title">
                Track Order #{trackingInfo.orderId}
              </h2>
              <p className="modal-subtitle">Real-time update from courier</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body">
          <div className="modal-grid">
            {/* Map Preview Area */}
            <div className="map-preview">
              <div className="map-background">
                <svg className="map-svg" viewBox="0 0 100 100">
                  <path
                    d="M0,50 Q25,30 50,50 T100,50"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                  <path
                    d="M20,0 Q40,20 20,40 T20,100"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                  <path
                    d="M70,0 L70,100"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                  <path
                    d="M0,70 L100,70"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              <div className="driver-tag">
                <span>Driver: Mike</span>
              </div>

              <div className="map-pin restaurant-pin">
                <div className="pin-circle">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
              </div>

              <div className="map-pin driver-pin">
                <div className="pin-circle driver-circle">
                  <span className="material-symbols-outlined">
                    delivery_dining
                  </span>
                </div>
                <div className="driver-status">ON THE WAY</div>
              </div>

              <button className="compass-button">
                <span className="material-symbols-outlined">navigation</span>
              </button>
            </div>

            {/* Info Area */}
            <div className="tracking-info">
              <div className="arrival-info">
                <div>
                  <p className="info-label">Estimated Arrival</p>
                  <h3 className="arrival-time">
                    {trackingInfo.estimatedArrival}
                  </h3>
                </div>
                <div className="time-left">
                  <p className="info-label">Time Left</p>
                  <p className="time-remaining">{trackingInfo.timeRemaining}</p>
                </div>
              </div>

              {/* Delivery Progress Stepper */}
              <div className="progress-container">
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${trackingInfo.progress}%` }}
                  />
                </div>

                <div className="progress-steps">
                  {steps.map((step, idx) => (
                    <div key={idx} className="progress-step">
                      <div
                        className={`step-circle ${
                          step.completed ? "completed" : ""
                        } ${step.active ? "active" : ""}`}
                      >
                        {step.completed && (
                          <span className="material-symbols-outlined step-check">
                            check
                          </span>
                        )}
                      </div>
                      <span
                        className={`step-label ${step.active ? "active" : ""}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver & Support */}
              <div className="driver-section">
                <div className="driver-info">
                  <div className="driver-avatar">
                    <span className="material-symbols-outlined">
                      sports_motorsports
                    </span>
                  </div>
                  <div>
                    <p className="driver-name">{trackingInfo.driverName}</p>
                    <p className="driver-role">Your Delivery Partner</p>
                  </div>
                </div>

                <div className="contact-buttons">
                  <button className="contact-button">
                    <span className="material-symbols-outlined">call</span>
                  </button>
                  <button className="contact-button">
                    <span className="material-symbols-outlined">chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <p className="last-updated">Last updated: Just now</p>
          <button onClick={onClose} className="close-modal-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
