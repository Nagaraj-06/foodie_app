import SearchIcon from "@mui/icons-material/Search";
import { useParams, useNavigate } from "react-router-dom";
import "./Items.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import FilterIcon from "@mui/icons-material/List";
import ItemCard from "../../components/ItemCard/ItemCard";
import { useGetRestaurantMenuQuery } from "../../store/api/restaurantApi";
import { CircularProgress } from "@mui/material";
import vegBiriyaniImg from "../../assets/food-items/vegBiriyani.png";
import vegRollImg from "../../assets/food-items/vegRoll.png";

import { API_BASE_URL } from "../../config";

const Items = () => {
  const { restaurantId } = useParams();
  const { data: menuData, isLoading } = useGetRestaurantMenuQuery(restaurantId);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (isLoading) {
    return (
      <div className="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  const categories = menuData?.data || [];
  // Get first item to find restaurant name if needed, or we might need another API for restaurant details
  const restaurantName = "Menu"; // We could fetch this if needed, for now placeholder

  return (
    <>
      <div className="main">
        <div className="Section">
          <div className="headerbar">
            <div className="heading">
              <ArrowBackIcon
                className="arrow-icon"
                onClick={() => navigate("/restaurants")}
              />
              <div id="hotel-name">
                <span>
                  <h2>{restaurantName}</h2>
                </span>
                <span>
                  <p>Select items to add to the cart</p>
                </span>
              </div>
            </div>
            <div className="search-bar">
              <SearchIcon className="search-icon" />
              <input
                value={searchText}
                placeholder="Search Items..."
                onChange={(e) => setSearchText(e.target.value)}
              />{" "}
            </div>
          </div>


          <div className="filter-bar">
            <button
              className={`filter-main ${selectedCategory === "All" ? "active-filter" : ""
                }`}
              onClick={() => setSelectedCategory("All")}
            >
              <FilterIcon className="icon" />
              All Items
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`item-filter-option ${selectedCategory === cat.name ? "active-filter" : ""
                  }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>


          <div className="item-grid">
            {categories.filter((cat) => {
              // filter categories
              if (selectedCategory !== "All" && cat.name !== selectedCategory) {
                return false;
              }
              return true;
            })
              .flatMap((cat) =>
                // return the INNER items
                cat.items.filter((food) =>
                  searchText.trim() === ""
                    ? true
                    : food.name.toLowerCase().includes(searchText.toLowerCase())
                )
              )
              .map((food) => (
                <ItemCard
                  key={food.id}
                  id={food.id}
                  name={food.name}
                  price={food.restaurant_item_variants?.[0]?.price || 0}
                  image={food.photo ? `${API_BASE_URL}/auth/${food.photo}` : vegBiriyaniImg}
                  restaurantId={restaurantId}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Items;
