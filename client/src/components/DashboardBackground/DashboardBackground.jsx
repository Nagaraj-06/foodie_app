import React, { useState, useMemo } from "react";
import "./DashboardBackground.css";
import { ALL_ORDERS, RANGE_DATA } from "../../pages/dashBoard/constants";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import StatCard from "../StatCard/StatCard";

import { useGetProfileQuery } from "../../store/api/authApi";

const DashboardBackground = ({ onOpenOrder }) => {
  const { data: userData, isLoading } = useGetProfileQuery();
  const [dateRange, setDateRange] = useState("This Month");
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const ranges = ["Today", "This Week", "This Month", "This Year"];

  const displayedOrders = useMemo(() => {
    return showAllOrders ? ALL_ORDERS : ALL_ORDERS.slice(0, 4);
  }, [showAllOrders]);

  const currentChartData = useMemo(() => {
    return RANGE_DATA[dateRange] || RANGE_DATA["This Month"];
  }, [dateRange]);

  if (isLoading) return <div className="dashboard-container">Loading...</div>;

  const restaurant = userData?.restaurants?.[0];
  const isApproved = restaurant?.verification_status === "APPROVED";

  if (!isApproved) {
    return (
      <div className="dashboard-container">
        <div className="verification-pending-card">
          <span className="material-symbols-outlined pending-icon">pending_actions</span>
          <h2>Verification Pending</h2>
          <p>Your business is currently being reviewed by our admin team. The order history dashboard will be available once your business is approved.</p>
          <div className="status-steps">
            <div className="step completed">
              <span className="step-icon">check_circle</span>
              <span>Registration Submitted</span>
            </div>
            <div className="step processing">
              <span className="step-icon">sync</span>
              <span>Admin Review in Progress</span>
            </div>
            <div className="step pending">
              <span className="step-icon">radio_button_unchecked</span>
              <span>Dashboard Access</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Order History</h1>
          <p className="dashboard-subtitle">
            Track past orders, payments, and customer details.
          </p>
        </div>
        <div className="dashboard-actions">
          <div className="date-selector">
            <button
              onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
              className={`date-button ${isDateMenuOpen ? "active" : ""}`}
            >
              <div className="date-button-content">
                <span className="material-symbols-outlined">
                  calendar_today
                </span>
                {dateRange}
              </div>
              <span
                className={`material-symbols-outlined dropdown-arrow ${isDateMenuOpen ? "open" : ""
                  }`}
              >
                expand_more
              </span>
            </button>

            {isDateMenuOpen && (
              <div className="date-dropdown">
                {ranges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setIsDateMenuOpen(false);
                    }}
                    className={`date-option ${dateRange === range ? "active" : ""
                      }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="filter-button">
            <span className="material-symbols-outlined">filter_list</span>
            Filters
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="analytics-card">
          <div className="analytics-header">
            <h2 className="analytics-title">
              Orders over {dateRange.toLowerCase()}
            </h2>
            <div className="analytics-trend">
              <span className="material-symbols-outlined">trending_up</span>
              +12.4% vs last{" "}
              {dateRange.replace("This ", "").toLowerCase() || "period"}
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChartData} key={dateRange}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F3F4F6"
                />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow:
                      "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                    padding: "12px",
                  }}
                  cursor={{ fill: "#F9FAFB" }}
                />
                <Bar
                  dataKey="orders"
                  fill="#2f5da1ff"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-orders-card">
          <div className="recent-orders-header">
            <h2 className="recent-orders-title">Recent Orders</h2>
            {!showAllOrders && ALL_ORDERS.length > 4 && (
              <span className="orders-count-badge">
                {ALL_ORDERS.length} Total
              </span>
            )}
          </div>
          <div className={`orders-list ${showAllOrders ? "expanded" : ""}`}>
            {displayedOrders.map((order) => (
              <div key={order.id} onClick={onOpenOrder} className="order-item">
                <div className="order-item-left">
                  <div className="order-item-icon">
                    {order.items[0]?.icon || "🛒"}
                  </div>
                  <div>
                    <p className="order-item-id">#{order.id}</p>
                    <p className="order-item-details">
                      Table {order.customer.table} • {order.customer.name}
                    </p>
                  </div>
                </div>
                <div className="order-item-right">
                  <p className="order-item-price">
                    ${order.payment.subtotal.toFixed(2)}
                  </p>
                  <span
                    className={`order-item-status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAllOrders(!showAllOrders)}
            className="view-all-button"
          >
            {showAllOrders ? "Show Less" : "View All Orders"}
            <span
              className={`material-symbols-outlined ${showAllOrders ? "rotated" : ""
                }`}
            >
              {showAllOrders ? "keyboard_arrow_up" : "arrow_forward"}
            </span>
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Revenue"
          value="$24,510"
          change="+8.5%"
          icon="payments"
          color="blue"
        />
        <StatCard
          label="Avg. Order Value"
          value="$42.20"
          change="-2.1%"
          icon="point_of_sale"
          color="red"
        />
        <StatCard
          label="Total Orders"
          value="582"
          change="+14%"
          icon="receipt_long"
          color="green"
        />
      </div>
    </div>
  );
};

export default DashboardBackground;
