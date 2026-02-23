import React, { useState, useMemo } from "react";
import FilterSection from ".//FilterSection";
import OrderCard from "../../components/OrderCard/OrderCard";
import TrackOrderModal from "./TrackOrderModal";
import { OrderStatus } from "./types";
import { useGetMyOrdersQuery } from "../../store/api/orderApi";
import { CircularProgress } from "@mui/material";
import "./MyOrders.css";
import vegBiriyaniImg from "../../assets/food-items/vegBiriyani.png";

// Map backend OrderStatus enum to frontend OrderStatus
const mapStatus = (status) => {
  switch (status) {
    case "CREATED":
    case "CONFIRMED":
    case "PREPARING":
    case "READY":
    case "OUT_FOR_DELIVERY":
      return OrderStatus.IN_PROGRESS;
    case "DELIVERED":
      return OrderStatus.COMPLETED;
    case "CANCELLED":
      return OrderStatus.CANCELLED;
    case "REFUNDED":
      return OrderStatus.REFUNDED;
    default:
      return OrderStatus.IN_PROGRESS;
  }
};

// Main App Component
const MyOrders = () => {
  const { data: response, isLoading, isError } = useGetMyOrdersQuery();
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatuses, setActiveStatuses] = useState([
    OrderStatus.COMPLETED,
    OrderStatus.IN_PROGRESS,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
  ]);

  // Transform API response into OrderCard-compatible shape
  const orders = useMemo(() => {
    if (!response?.data) return [];
    return response.data
      .filter((order) => order.status !== "CREATED")
      .map((order) => {
        const firstItem = order.order_items?.[0];
        const itemCount = order.order_items?.length || 0;

        // Use backend's display_status if available, otherwise fallback to mapStatus
        const category = order.display_status || mapStatus(order.status);

        return {
          id: order.order_number || order.id,
          item: firstItem?.variant?.item?.name || "Order",
          additionalItemsCount: Math.max(0, itemCount - 1),
          date: new Date(order.created_at).toLocaleString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "numeric", minute: "2-digit",
          }),
          price: order.total_amount,
          status: category, // Category for filtering/styling
          rawStatus: order.status, // Raw backend status (CONFIRMED, PREPARING, etc.)
          imageUrl: firstItem?.variant?.item?.photo
            ? `${import.meta.env.VITE_API_BASE_URL}/auth/${firstItem.variant.item.photo}`
            : vegBiriyaniImg,
        };
      });
  }, [response]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.item.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeStatuses.includes(order.status);
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeStatuses, orders]);

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
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <CircularProgress />
              </div>
            ) : isError ? (
              <div className="no-orders">
                <span className="material-symbols-outlined no-orders-icon">error</span>
                <h3 className="no-orders-title">Failed to load orders</h3>
                <p className="no-orders-text">Please check your connection and try again.</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  statusLabel={order.rawStatus}
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
                  {orders.length === 0
                    ? "You haven't placed any orders yet."
                    : "Try adjusting your filters or search keywords."}
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
