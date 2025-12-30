import React, { useState, useMemo } from "react";
import DashboardBackground from "../../components/DashboardBackground/DashboardBackground";
import OrderDetailsModal from "../../components/DetailItem/OrderDetailsModal";
import "./OrderHistoryPage.css";

const OrderHistoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`order-history-wrapper ${isModalOpen ? "blurred" : ""}`}>
      <DashboardBackground onOpenOrder={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <OrderDetailsModal
          order={MOCK_ORDER}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;
