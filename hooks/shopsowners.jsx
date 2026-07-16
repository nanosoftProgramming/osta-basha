// src/store/slices/shopsownersSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";

export const fetchShopsowners = createAsyncThunk(
  "shopsowners/fetchShopsowners",
  async (paramsObj, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.authorization?.token; // عدل حسب مكان التوكن عندك
            const queryString = new URLSearchParams(paramsObj)?.toString();
console.log(`${apiUrl}/shop-owners?${queryString}`);
console.log(queryString,"queryString");


    try {
          const response = await axios.get(`${apiUrl}/shop-owners?${queryString}`,   {
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        }
      );

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
export const addShopsowner = createAsyncThunk(
  "shopsowners/addShopsowner",
  async (shopsownerData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/shopsowners`, shopsownerData, {
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
export const updateShopsowner = createAsyncThunk(
  "shopsowners/updateShopsowner",
  async (shopsownerData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/shopsowners/${shopsownerData?.id}`, shopsownerData, {
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

const shopsownersSlice = createSlice({
  name: "shopsowners",
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
      .addCase(fetchShopsowners.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;

      })
      .addCase(fetchShopsowners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        if (action.payload && Array.isArray(action.payload.data)) {
          state.list = action.payload.data; 
          state.pagination = action.payload; // هنا نخزن باقي تفاصيل الترقيم
        } else {
          state.list = [];
        }

      })
      .addCase(fetchShopsowners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      }).addCase(addShopsowner.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addShopsowner.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(addShopsowner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateShopsowner.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateShopsowner.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateShopsowner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default shopsownersSlice.reducer;
