import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    country_en: '',
    country_ar: '',
currancy:"",
currancy_ar:"",

    callingCode_en:'',
    callingCode_ar:'',
    countryCode:'',

    
    city:'',
    city_ar:'',

    latitude:'',
    longitude:'',
  },
  reducers: {
  locationData: (state, action) => {
return { ...state, ...action.payload }    },
 
  },
});

export const { locationData } = locationSlice.actions;
export default locationSlice.reducer;