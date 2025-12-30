import React, { useState, useMemo } from "react";
import "./FilterSection.css";
import "./TrackOrderModal.css";
import { OrderStatus } from "./types";
import SearchBar from "../../components/SearchBar/SearchBar";

// FilterSection Component
const FilterSection = ({
  searchTerm,
  onSearch,
  activeStatuses,
  onToggleStatus,
  onReset,
}) => {
  return (
    <div className="filter-section">
      <SearchBar />
      {/* Status Filters */}
      <div className="status-filter-card">
        <h4 className="filter-title">Order Status</h4>
        <div className="checkbox-list">
          {[
            { label: "Completed", value: OrderStatus.COMPLETED },
            { label: "In Progress", value: OrderStatus.IN_PROGRESS },
            { label: "Refunded", value: OrderStatus.REFUNDED },
            { label: "Cancelled", value: OrderStatus.CANCELLED },
          ].map((item) => (
            <label key={item.label} className="checkbox-label">
              {console.log(activeStatuses)}
              <input
                type="checkbox"
                checked={activeStatuses.includes(item.value)}
                onChange={() => onToggleStatus(item.value)}
                className="checkbox-input"
              />
              <span
                className={`checkbox-text ${
                  activeStatuses.includes(item.value) ? "active" : ""
                }`}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <button onClick={onReset} className="reset-button">
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSection;
