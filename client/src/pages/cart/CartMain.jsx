import React, { useState, useMemo } from "react";
import "./CartMain.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import CartSummary from "./CartSummary";
import { PaymentSummary } from "./PaymentSummary";
import { Constants } from "./constants";
import { DeliveryAddress } from "../../components/DeliveryAddress/DeliveryAddress";
import AddressModal from "../../components/AddressModal/AddressModal";
import { useGetCartQuery, useRemoveFromCartMutation, usePlaceOrderMutation } from "../../store/api/cartApi";
import { useGetProfileQuery } from "../../store/api/authApi";
import { CircularProgress } from "@mui/material";
import vegBiriyaniImg from "../../assets/food-items/vegBiriyani.png";

const CartMain = () => {
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [placeOrder, { isLoading: isPlacing }] = usePlaceOrderMutation();

  const [selectedItems, setSelectedItems] = useState([]);

  const cartItems = useMemo(() => {
    if (!cartData?.data) return [];
    return cartData.data.map(item => ({
      id: item.variant_id,
      name: item.variant.item.name,
      variantName: item.variant.name,
      price: item.variant.price,
      quantity: item.quantity,
      image: item.variant.item.photo ? `${import.meta.env.VITE_API_BASE_URL}/auth/${item.variant.item.photo}` : vegBiriyaniImg,
      restaurantName: item.variant.item.restaurant.restaurant_name,
      selected: selectedItems.includes(item.variant_id) || selectedItems.length === 0 // Default all selected if none touched
    }));
  }, [cartData, selectedItems]);

  const toggleSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleAll = (isSelected) => {
    if (isSelected) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems(["NONE"]); // Special value to indicate nothing is selected
    }
  };

  const updateQuantity = (id, delta) => {
    // We could implement an updateQuantity API, but for now we'll just handle it or use addToCart with delta
    alert("Quantity update not fully implemented yet");
  };

  const removeItem = async (id) => {
    try {
      await removeFromCart(id).unwrap();
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };
  const deliveryAddresses = useMemo(() => {
    if (!profileData?.addresses) return [];
    return profileData.addresses.map((addr) => ({
      id: addr.id,
      type: addr.address_type,
      name: addr.address_type,
      street: addr.street_address,
      city: addr.city,
      state: addr.state,
      zip: addr.zip_code,
      country: addr.country_name,
      isDefault: addr.is_active,
    }));
  }, [profileData]);

  const handlePlaceOrder = async () => {
    const selectedCartItems = cartItems.filter(item => item.selected);
    if (selectedCartItems.length === 0) {
      alert("Please select items to order");
      return;
    }

    try {
      const orderPayload = {
        payment_method: "ONLINE", // Default for now
        items: selectedCartItems.map(item => ({
          variant_id: item.id,
          quantity: item.quantity
        }))
      };

      await placeOrder(orderPayload).unwrap();
      alert("Order placed successfully!");
      // Optionally navigate to orders page
      // navigate("/orders");
    } catch (err) {
      console.error(err);
      alert(err.data?.message || "Failed to place order");
    }
  };

  const totals = useMemo(() => {
    const selectedItems = cartItems.filter((item) => item.selected);
    const subTotal = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxableAmount = subTotal * 0.95238;
    const totalTax = subTotal - taxableAmount;
    return {
      subTotal,
      taxableAmount,
      totalTax,
      grandTotal: subTotal,
    };
  }, [cartItems]);

  if (isCartLoading || isProfileLoading) {
    return (
      <div className="cart-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="cart-container">
      <main className="cart-main-content">
        <SearchBar />
        <div className="cart-content-grid">
          <div className="cart-section">
            <CartSummary
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onToggleSelection={toggleSelection}
              onToggleAll={toggleAll}
              totals={totals}
            />
          </div>
          <div className="payment-section">
            <DeliveryAddress
              externalAddresses={deliveryAddresses}
              onProceedToPayment={handlePlaceOrder}
              isPlacing={isPlacing}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartMain;
