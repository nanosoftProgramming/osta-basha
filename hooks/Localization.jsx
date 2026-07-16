import { createSlice } from "@reduxjs/toolkit";
import { en } from "./en";
import { ar } from "./ar";

export const localizationSlice = createSlice({
  name: "localization",
  initialState: { currentLocal: ar },
  reducers: {
    changeLocal: (state, action) => {
      state.currentLocal = action.payload === "ar" ? ar : en;
    },
  },
});

export const { changeLocal } = localizationSlice.actions;

export default localizationSlice.reducer;
