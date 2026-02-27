import React, { useState, useMemo } from "react";
import "./VariantPage.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import { VariantSelector } from "../../components/variantSelector/VariantSelector";
import { useParams } from "react-router-dom";
import { useGetMenuItemQuery } from "../../store/api/restaurantApi";
import { CircularProgress } from "@mui/material";
import vegBiriyaniImg from "../../assets/food-items/vegBiriyani.png";

import { API_BASE_URL } from "../../config";

export const VariantPage = () => {
  const { itemId } = useParams();
  const { data: itemData, isLoading } = useGetMenuItemQuery(itemId);

  if (isLoading) {
    return (
      <div
        className="variant-page-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  const item = itemData?.data;

  if (!item) {
    return (
      <div className="variant-page-wrapper">
        <SearchBar />
        <div className="variant-page-content">
          <p>Item not found</p>
        </div>
      </div>
    );
  }

  const mappedProduct = {
    id: item.id,
    name: item.name,
    description: item.description,
    imageUrl: item.photo
      ? `${API_BASE_URL}/auth/${item.photo}`
      : vegBiriyaniImg,
    badgeCount: 1,
    variants: item.restaurant_item_variants.map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price,
    })),
  };

  return (
    <div className="variant-page-wrapper">
      <SearchBar />
      <div className="variant-page-content">
        <VariantSelector product={mappedProduct} />
      </div>
    </div>
  );
};
