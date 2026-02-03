import SearchIcon from "@mui/icons-material/Search";
import { useParams, useNavigate } from "react-router-dom";
import "./Items.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import FilterIcon from "@mui/icons-material/List";
import ItemCard from "../../components/ItemCard/ItemCard";
import vegBiriyaniImg from "../../assets/food-items/vegBiriyani.png";
import vegRollImg from "../../assets/food-items/vegRoll.png";

const Items = () => {
  const { restaurantName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(restaurantName);
  const [searchText, setSearchText] = useState("");
  const [filterOn, setFilterOn] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const Items = [
    {
      id: 1,
      name: "Biriyani",
      items: [
        { name: "Veg Biriyani", image: vegBiriyaniImg, price: 120.0 },
        { name: "Chicken Biriyani", image: vegBiriyaniImg, price: 160.0 },
        { name: "Mutton Biriyani", image: vegBiriyaniImg, price: 200.0 },
        { name: "Egg Biriyani", image: vegBiriyaniImg, price: 130.0 },
        { name: "Egg Biriyani", image: vegBiriyaniImg, price: 130.0 },
        { name: "Egg Biriyani", image: vegBiriyaniImg, price: 130.0 },
        { name: "Egg Biriyani", image: vegBiriyaniImg, price: 130.0 },
        { name: "Egg Biriyani", image: vegBiriyaniImg, price: 130.0 },
      ],
    },
    {
      id: 2,
      name: "Dosa",
      items: [
        { name: "Veg Roll", image: vegRollImg, price: 60 },
        { name: "Chicken Roll", image: vegRollImg, price: 80 },
        { name: "Paneer Roll", image: vegRollImg, price: 70 },
      ],
    },
    // {
    //   id: 3,
    //   name: "Starters",
    //   items: [
    //     { item: "Veg Starter", price: 90 },
    //     { item: "Chicken Starter", price: 140 },
    //     { item: "Fish Starter", price: 150 },
    //   ],
    // },
    // {
    //   id: 4,
    //   name: "Desserts",
    //   items: [
    //     // { item: "Gulab Jamun", price: 50 },
    //     // { item: "Ice Cream", price: 40 },
    //     // { item: "Rasmalai", price: 60 },
    //   ],
    // },
    // {
    //   id: 5,
    //   name: "Beverages",
    //   items: [
    //     { item: "Soft Drinks", price: 30 },
    //     { item: "Lassi", price: 40 },
    //     { item: "Coffee / Tea", price: 20 },
    //   ],
    // },
  ];

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
                  <h2>{decodedName}</h2>
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

            {Items.map((cat) => (
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
            {Items.filter((cat) => {
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
              .map((food, index) => (
                <ItemCard
                  key={index}
                  {...food}
                  restaurantName={restaurantName}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Items;
