// {{base}}/api/wishlist
// src/store/slices/wishlistSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (paramsObj, thunkAPI) => {
    try {

      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state
      const queryString = new URLSearchParams(paramsObj)?.toString();

      const response = await axios.get(`${apiUrl}/client/favourites`, {
        headers: {
          Authorization: `Bearer ${state?.authorization?.token}`,
        },
      }
      );
      console.log(response.data.data, "response.data.lklsklsdkl;ds");

      return response.data.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errors
          ? Object.values(error.response.data.errors)[0][0]
          : "حدث خطأ أثناء جلب البيانات"
      );
    }
  }
);
export const fetchtoggleFavorit = createAsyncThunk(
  "wishlist/fetchtoggleFavorit",
  async (userId, thunkAPI) => {
    try {

      const state = thunkAPI.getState();


      const response = await axios.post(`${apiUrl}/client/favourites/toggle`, { user_id: userId }, {
        headers: {
          Authorization: `Bearer ${state?.authorization?.token}`,
          "Accept-Language": state?.Localization?.currentLocal?.language == "العربيه" ? "ar" : "en"
        },
      }
      );
      console.log(response.data.data, "response.d787858587574");

      return response.data.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errors
          ? Object.values(error.response.data.errors)[0][0]
          : "حدث خطأ أثناء جلب البيانات"
      );
    }
  }
);
export const addWishlist = createAsyncThunk(
  "wishlist/addWishlist",
  async (wishlistData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/wishlist`, wishlistData, {
        headers: {
          Authorization: `Bearer ${state.auth.wishlistArray.access_token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(Object.values(error.response.data.errors)[0][0] || "فشل إضافة الصف");
    }
  }
);
export const updateWishlist = createAsyncThunk(
  "wishlist/updateWishlist",
  async (wishlistData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/wishlist/${wishlistData?.id}`, wishlistData, {
        headers: {
          Authorization: `Bearer ${state.auth.wishlistArray.access_token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "فشل إضافة الصف");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    loading: true,
    pagination: null


  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;

      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.list = action.payload; 

        // if (action.payload && Array.isArray(action.payload.data)) {
        //   state.list = action.payload.data; // هنا نخزن المصفوفة الـ (6) عناصر
        //   state.pagination = action.payload; // هنا نخزن باقي تفاصيل الترقيم
        // } else {
        //   state.list = [];
        // }

      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      }).addCase(fetchtoggleFavorit.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchtoggleFavorit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(fetchtoggleFavorit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default wishlistSlice.reducer;
