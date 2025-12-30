import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterOn: false,
  hotelFilter: "All",
  vegFilter: "All",
  locationFilter: "All",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    toggleFilter: (state) => {
      state.filterOn = !state.filterOn;
    },
    setHotelFilter: (state, action) => {
      state.hotelFilter = action.payload;
    },
    setVegFilter: (state, action) => {
      state.vegFilter = action.payload;
    },
    setLocationFilter: (state, action) => {
      state.locationFilter = action.payload;
    },
  },
});

export const { toggleFilter, setHotelFilter, setVegFilter, setLocationFilter } =
  filterSlice.actions;
export default filterSlice.reducer;
