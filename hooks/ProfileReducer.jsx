// src/store/slices/profileSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (filters, thunkAPI) => {
    try {
      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state


console.log(`${apiUrl}/user/auth/me`);

      const response = await axios.post(`${apiUrl}/user/auth/me`,{},
        {
          headers: {
            Authorization: `Bearer ${state?.authorization?.token}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.log(error);
      
      return thunkAPI.rejectWithValue(
        error.response?.data?.errors
          ? Object.values(error.response.data.errors)[0][0]
          : "حدث خطأ أثناء جلب البيانات"
      );
    }
  }
);
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (profileData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/user/change-password`, profileData, {
        headers: {
          Authorization: `Bearer ${state?.authorization?.token}`,
        },
      });
      return response.data.data;
    } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0][0]
        : "حدث خطأ أثناء جلب البيانات"
    );    }
  }
);
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data , thunkAPI) => {
    console.log(data);
    
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/user/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${state?.authorization?.token}`,
        },
      });      
      return response.data.data;
    } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0][0]
        : "حدث خطأ أثناء جلب البيانات"
    );    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    list: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.list = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export default profileSlice.reducer;
