import React, { useState, useMemo } from "react";
import "./VariantSelector.css";
import { useNavigate } from "react-router-dom";
import { useAddToCartMutation } from "../../store/api/cartApi";
import { CircularProgress } from "@mui/material";

export const VariantSelector = ({ product }) => {
  const navigate = useNavigate();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("variants");

  const selectedVariant = useMemo(
    () =>
      product.variants.find((v) => v.id === selectedVariantId) ||
      product.variants[0],
    [product.variants, selectedVariantId]
  );

  const total = selectedVariant.price * quantity;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        variant_id: selectedVariantId,
        quantity: quantity
      }).unwrap();

      alert("Item added to cart!");
      navigate("/carts");
    } catch (err) {
      console.error(err);
      alert(err.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="variant-selector-container">
      {/* Header */}
      <div className="variant-selector-header">
        <h2 className="variant-selector-title">Variants</h2>
        {/* <button className="variant-close-button">
          <span className="material-symbols-outlined">close</span>
        </button> */}
      </div>

      {/* Scrollable Content */}
      <div className="variant-selector-content">
        {/* Product Info */}
        <div className="variant-product-info">
          <div className="variant-product-image-wrapper">
            <img
              alt={product.name}
              className="variant-product-image"
              src={product.imageUrl}
            />
            <span className="variant-product-badge">{product.badgeCount}</span>
          </div>
          <div className="variant-product-details">
            <h3 className="variant-product-name">{product.name}</h3>
            <p className="variant-product-description">{product.description}</p>
          </div>
        </div>

        {/* Tabs */}
        {/* <div className="variant-tabs">
          <button
            onClick={() => setActiveTab("variants")}
            className={`variant-tab ${
              activeTab === "variants" ? "variant-tab-active" : ""
            }`}
          >
            Variants ({product.variants.length})
          </button>
          <button
            onClick={() => setActiveTab("addons")}
            className={`variant-tab ${
              activeTab === "addons" ? "variant-tab-active" : ""
            }`}
          >
            Add-ons
          </button>
        </div> */}

        {/* Variants List */}
        {activeTab === "variants" ? (
          <div className="variant-list-section">
            <h4 className="variant-list-title">Size</h4>
            <div className="variant-list">
              {product.variants.map((variant) => {
                const isSelected = selectedVariantId === variant.id;
                return (
                  <label
                    key={variant.id}
                    className={`variant-option ${isSelected ? "variant-option-selected" : ""
                      }`}
                  >
                    <div className="variant-option-left">
                      <input
                        type="radio"
                        name="variant"
                        className="variant-radio"
                        checked={isSelected}
                        onChange={() => setSelectedVariantId(variant.id)}
                      />
                      <span className="variant-option-name">
                        {variant.name}
                      </span>
                    </div>
                    <span className="variant-option-price">
                      ₹{variant.price.toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="variant-empty-state">
            <p>No add-ons available</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="variant-selector-footer">
        <div className="variant-total-section">
          <span className="variant-total-label">Item total</span>
          <span className="variant-total-price">
            ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="variant-actions">
          <div className="variant-quantity-controls">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="variant-quantity-button"
              disabled={quantity <= 1}
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="variant-quantity-display">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="variant-quantity-button"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          <button
            className="variant-add-button"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? <CircularProgress size={24} color="inherit" /> : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
};
