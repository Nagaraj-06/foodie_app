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

const Hotels = () => {
  const [filterOn, setFilterOn] = useState(true);
  const [foodType, setFoodType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchText, setSearchText] = useState("");

  const hotels = [
    {
      id: 1,
      name: "AsianKatha",
      image: AsianKathaImg,
      location: "Chennai",
      isPureVeg: true,
      rating: 4,
    },
    {
      id: 2,
      name: "Bombay Truffle",
      image: bombayTruffleImg,
      location: "Bangalore",
      isPureVeg: true,
      rating: 5,
    },
    {
      id: 3,
      name: "Grand Hotel",
      image: grandHotelImg,
      location: "Bangalore",
      isPureVeg: false,
      rating: 3,
    },
    {
      id: 4,
      name: "Madras Square",
      image: madrasSquareImg,
      location: "Bangalore",
      isPureVeg: false,
      rating: 4,
    },
    {
      id: 5,
      name: "Madras Square",
      image: madrasSquareImg,
      location: "Bangalore",
      isPureVeg: false,
      rating: 4,
    },
  ];

  const locations = [...new Set(hotels.map((h) => h.location))];

  const filteredHotels = filterOn
    ? hotels.filter((h) => {
        const locationMatch =
          selectedLocation === "all" || h.location === selectedLocation;

        const foodMatch =
          foodType === "all" ||
          (foodType === "veg" && h.isPureVeg) ||
          (foodType === "nonveg" && !h.isPureVeg);

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
                <HotelCard key={h.id} {...h} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hotels;
