import React, { useState, useMemo } from "react";
import "./VariantPage.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import { VariantSelector } from "../../components/variantSelector/variantSelector";

export const VariantPage = () => {
  const sampleProduct = {
    id: "p1",
    name: "Chicken BBQ pizza with mexican flavoured toppings",
    description:
      "A delicious blend of smoky BBQ chicken and zesty Mexican spices.",
    imageUrl: "https://picsum.photos/id/43/400/400",
    badgeCount: 2,
    variants: [
      { id: "v1", name: "Pizza (Large)", price: 800.0 },
      { id: "v2", name: "Pizza (Medium)", price: 500.0 },
      { id: "v3", name: "Pizza (Small)", price: 300.0 },
    ],
  };

  return (
    <div className="variant-page-wrapper">
      <SearchBar />
      <div className="variant-page-content">
        <VariantSelector product={sampleProduct} />
      </div>
    </div>
  );
};
