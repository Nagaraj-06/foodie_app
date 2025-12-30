import React, { useState, useMemo } from "react";
import FilterSection from ".//FilterSection";
import OrderCard from "../../components/OrderCard/OrderCard";
import TrackOrderModal from "./TrackOrderModal";
import { OrderStatus } from "./types";
import "./MyOrders.css";

const MOCK_ORDERS = [
  {
    id: "ORD-12344",
    item: "Pepperoni Pizza Medium",
    additionalItemsCount: 1,
    date: "Aug 23, 2024 at 12:30 PM",
    price: 45.0,
    status: OrderStatus.IN_PROGRESS,
    imageUrl: "https://picsum.photos/seed/pizza/200",
  },
  {
    id: "ORD-12345",
    item: "Mediterranean Salad Bowl",
    additionalItemsCount: 3,
    date: "Aug 23, 2024 at 12:45 PM",
    price: 124.5,
    status: OrderStatus.COMPLETED,
    imageUrl: "https://picsum.photos/seed/salad/200",
  },
  {
    id: "ORD-12342",
    item: "Caramel Macchiato Grande",
    additionalItemsCount: 0,
    date: "Aug 23, 2024 at 11:55 AM",
    price: 8.75,
    status: OrderStatus.CANCELLED,
    imageUrl: "https://picsum.photos/seed/coffee/200",
  },
  {
    id: "ORD-12341",
    item: "Premium BBQ Ribs Platter",
    additionalItemsCount: 4,
    date: "Aug 23, 2024 at 11:40 AM",
    price: 210.25,
    status: OrderStatus.COMPLETED,
    imageUrl: "https://picsum.photos/seed/ribs/200",
  },
];

// Main App Component
const MyOrders = () => {
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatuses, setActiveStatuses] = useState([
    OrderStatus.COMPLETED,
    OrderStatus.IN_PROGRESS,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
  ]);

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.item.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeStatuses.includes(order.status);
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeStatuses]);

  const handleTrackOrder = (order) => {
    setSelectedOrderForTracking(order);
  };

  const closeTracking = () => {
    setSelectedOrderForTracking(null);
  };

  const toggleStatus = (status) => {
    setActiveStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleSearch = (val) => {
    setSearchTerm(val);
  };

  const trackingData = {
    orderId: selectedOrderForTracking?.id || "",
    estimatedArrival: "12:55 PM",
    timeRemaining: "~15 mins",
    progress: 75,
    driverName: "Mike R.",
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <header className="page-header">
          <h1 className="page-title">My Orders</h1>
          <div className="results-count">
            Showing{" "}
            <span className="count-highlight">{filteredOrders.length}</span>{" "}
            total results
          </div>
        </header>

        <div className="content-grid">
          <div className="filter-column">
            <FilterSection
              searchTerm={searchTerm}
              onSearch={handleSearch}
              activeStatuses={activeStatuses}
              onToggleStatus={toggleStatus}
              onReset={() => {
                setSearchTerm("");
                setActiveStatuses([
                  OrderStatus.COMPLETED,
                  OrderStatus.IN_PROGRESS,
                  OrderStatus.CANCELLED,
                  OrderStatus.REFUNDED,
                ]);
              }}
            />
          </div>

          <div className="orders-column">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onTrack={() => handleTrackOrder(order)}
                />
              ))
            ) : (
              <div className="no-orders">
                <span className="material-symbols-outlined no-orders-icon">
                  search_off
                </span>
                <h3 className="no-orders-title">No orders found</h3>
                <p className="no-orders-text">
                  Try adjusting your filters or search keywords.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedOrderForTracking && (
        <TrackOrderModal
          isOpen={!!selectedOrderForTracking}
          onClose={closeTracking}
          trackingInfo={trackingData}
        />
      )}
    </div>
  );
};

export default MyOrders;
