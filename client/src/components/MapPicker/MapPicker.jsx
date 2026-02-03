import React, { useState, useCallback, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "./MapPicker.css";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";

const center = [28.6139, 77.209]; // Default to New Delhi

// Component to handle map center changes and pin logic
function LocationMarker({ onPositionChange }) {
    const map = useMapEvents({
        moveend: () => {
            const center = map.getCenter();
            onPositionChange([center.lat, center.lng]);
        },
    });
    return null;
}

const MapPicker = ({ isOpen, onClose, onConfirm }) => {
    const [mapPosition, setMapPosition] = useState(center);
    const [address, setAddress] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const mapRef = useRef(null);

    // Reverse geocode when position changes
    const fetchAddress = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            if (data && data.display_name) {
                setAddress(data.display_name);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    };

    const handlePositionChange = (pos) => {
        setMapPosition(pos);
        fetchAddress(pos[0], pos[1]);
    };

    // Forward geocode search
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 3) {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}`
                );
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Search error:", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const selectLocation = (lat, lon, displayName) => {
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setMapPosition(newPos);
        setAddress(displayName);
        setSearchResults([]);
        setSearchQuery("");
        if (mapRef.current) {
            mapRef.current.setView(newPos, 16);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = [position.coords.latitude, position.coords.longitude];
                    setMapPosition(pos);
                    fetchAddress(pos[0], pos[1]);
                    if (mapRef.current) {
                        mapRef.current.setView(pos, 16);
                    }
                    setIsLoading(false);
                },
                () => {
                    alert("Error: The Geolocation service failed.");
                    setIsLoading(false);
                }
            );
        } else {
            alert("Error: Your browser doesn't support geolocation.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="map-picker-overlay">
            <div className="map-picker-container">
                <header className="map-picker-header">
                    <h3>Choose Location</h3>
                    <button className="close-map-btn" onClick={onClose}>
                        <CloseIcon />
                    </button>
                </header>

                <div className="map-picker-body">
                    <div className="map-wrapper">
                        <div className="map-controls-top">
                            <div className="search-container">
                                <SearchIcon className="search-icon-map" />
                                <input
                                    type="text"
                                    placeholder="Search your restaurant address..."
                                    className="map-search-input"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                {searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map((res) => (
                                            <div
                                                key={res.place_id}
                                                className="search-result-item"
                                                onClick={() => selectLocation(res.lat, res.lon, res.display_name)}
                                            >
                                                <LocationOnIcon style={{ fontSize: "16px", color: "#64748b" }} />
                                                <span>{res.display_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="use-current-loc-btn" onClick={getCurrentLocation} disabled={isLoading}>
                                <MyLocationIcon sx={{ fontSize: 18 }} />
                                <span>{isLoading ? "Fetching..." : "Use current location"}</span>
                            </button>
                        </div>

                        <MapContainer
                            center={mapPosition}
                            zoom={15}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%" }}
                            ref={mapRef}
                            zoomControl={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker onPositionChange={handlePositionChange} />
                        </MapContainer>

                        {/* Center marker - fixed in center */}
                        <div className="center-marker">
                            <div className="pin-pulse"></div>
                            <LocationOnIcon style={{ color: "#ef4444", fontSize: "3rem" }} />
                        </div>

                        <div className="zoom-controls">
                            <button onClick={() => mapRef.current?.zoomIn()}>+</button>
                            <button onClick={() => mapRef.current?.zoomOut()}>-</button>
                        </div>
                    </div>
                </div>

                <footer className="map-picker-footer">
                    <div className="selected-address-info">
                        <span className="address-label">SELECTED ADDRESS</span>
                        <p className="address-text">{address || "Drag the map to pinpoint location"}</p>
                    </div>
                    <button
                        className="confirm-location-btn"
                        onClick={() => onConfirm(address, mapPosition)}
                        disabled={!address}
                    >
                        Confirm Location
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MapPicker;
