import React, { useState } from "react";
import "./Hotels.css";
import SearchIcon from "@mui/icons-material/Search";
import GridIcon from "@mui/icons-material/GridGoldenratio";
import ListIcon from "@mui/icons-material/List";
import FilterIcon from "@mui/icons-material/List";
import Restaurant from "@mui/icons-material/Restaurant";
import LocationIcon from "@mui/icons-material/LocationDisabledRounded";
import HotelCard from "../../components/HotelCard/HotelCard";
import AsianKathaImg from "../../assets/AsianKatha.png";
import bombayTruffleImg from "../../assets/bombayTruffle.png";
import grandHotelImg from "../../assets/grandHotel.png";
import madrasSquareImg from "../../assets/madrasSquare.png";
import SearchBar from "../../components/SearchBar/SearchBar";
import { API_BASE_URL } from "../../config";
import { CircularProgress } from "@mui/material";
import { useGetRestaurantsQuery } from "../../store/api/restaurantApi";

const Hotels = () => {
  const { data: restaurantsData, isLoading } = useGetRestaurantsQuery();
  const [filterOn, setFilterOn] = useState(true);
  const [foodType, setFoodType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchText, setSearchText] = useState("");

  if (isLoading) {
    return (
      <div className="Section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  const hotels = restaurantsData?.data || [];
  const locations = [...new Set(hotels.map((h) => h.address?.city).filter(Boolean))];

  const filteredHotels = filterOn
    ? hotels.filter((h) => {
      const locationMatch =
        selectedLocation === "all" || h.address?.city === selectedLocation;

      // Current schema doesn't have isPureVeg on restaurant directly, 
      // it's defined at item level. For now, we'll show all or use a placeholder.
      const foodMatch = true;

      return locationMatch && foodMatch;
    })
    : hotels;

  return (
    <>
      <div className="Section">
        <SearchBar />
        <div>
          <div className="header-bar">
            {/* 2. Title */}
            <h2 className="header-title">Restaurant Selection</h2>
            {/* Right: View Buttons */}
            <div className="view-buttons">
              <button className="grid-button">
                <span className="material-icons-outlined">grid_view</span>
              </button>
              <button>
                <ListIcon />
              </button>
            </div>
          </div>

          <hr className="line" />

          {/* Left: Filters */}
          <div className="filter-bar">
            <button
              className={`filter-main ${filterOn ? "active-filter" : ""}`}
              onClick={() => setFilterOn(!filterOn)}
            >
              <FilterIcon className="icon" />
              Filter
            </button>

            <div className="filter-option">
              <Restaurant className="icon" />
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
              >
                <option value="all">All Food Types</option>
                <option value="veg">Veg</option>
                <option value="nonveg">Non-Veg</option>
              </select>
            </div>

            <div className="filter-option">
              <LocationIcon className="icon" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">All Locations</option>

                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="line" />
          <div className="grid">
            {filteredHotels
              .filter((h) => {
                return !searchText || searchText.trim() === ""
                  ? true
                  : h?.name?.toLowerCase().includes(searchText.toLowerCase());
              })
              .map((h) => (
                <HotelCard
                  key={h.id}
                  id={h.id}
                  name={h.restaurant_name}
                  image={h.photo ? `${API_BASE_URL}/auth/${h.photo}` : grandHotelImg}
                  location={h.address?.city || "Unknown"}
                  rating={4} // Placeholder rating
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hotels;
