import React from "react";
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <header className="search-header">
      <div className="search-wrapper">
        <span className="material-icons-outlined search-icon">search</span>
        <input type="text" placeholder="Search" className="search-input" />
      </div>
      {/* <button className="grid-button">
        <span className="material-icons-outlined">grid_view</span>
      </button> */}
    </header>
  );
};

export default SearchBar;
