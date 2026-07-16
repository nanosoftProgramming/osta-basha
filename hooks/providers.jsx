// src/store/slices/providersSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";

export const fetchProviders = createAsyncThunk(
  "providers/fetchProviders",
  async (paramsObj, thunkAPI) => {
    try {

      const state = thunkAPI.getState();
      const token = state.authorization?.token; 
            const queryString = new URLSearchParams(paramsObj)?.toString();

      const response = await axios.get(`${apiUrl}/providers?${queryString}`,

{
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }

      )
      
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errors
          ? Object.values(error.response.data.errors)[0][0]
          : "حدث خطأ أثناء جلب البيانات"
      );
    }
  }
);
export const addProvider = createAsyncThunk(
  "providers/addProvider",
  async (providerData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/providers`, providerData, {
        headers: {
          Authorization: `Bearer ${state.auth.userArray.access_token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(Object.values(error.response.data.errors)[0][0] || "فشل إضافة الصف");
    }
  }
);
export const updateProvider = createAsyncThunk(
  "providers/updateProvider",
  async (providerData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/providers/${providerData?.id}`, providerData, {
        headers: {
          Authorization: `Bearer ${state.auth.userArray.access_token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "فشل إضافة الصف");
    }
  }
);

const providersSlice = createSlice({
  name: "providers",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    loading: false,
    pagination: null


  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;

      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        // state.list = action.payload;
        if (action.payload.data && Array.isArray(action.payload.data)) {
          state.list = action.payload.data; 
          state.pagination = action.payload;
        } else {
          state.list = [];
        }

      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      }).addCase(addProvider.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProvider.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(addProvider.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateProvider.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProvider.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateProvider.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default providersSlice.reducer;
