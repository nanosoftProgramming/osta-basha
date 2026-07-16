// src/store/slices/adsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import  apiUrl  from "../constants/apiUrl";

export const fetchAds = createAsyncThunk(
  "ads/fetchAds",
  async (thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/sliders`);
      
      return response.data.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errors
          ? Object.values(error.response.data.errors)[0][0]
          : "حدث خطأ أثناء جلب الاعلانات"
      );
    }
  }
);
export const addAd = createAsyncThunk(
  "ads/addAd",
  async (adData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/ads`, adData, {
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
export const updateAd = createAsyncThunk(
  "ads/updateAd",
  async ({ id, data }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/ads/${id}`, data, {
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
export const deleteAd = createAsyncThunk(
  "ads/deleteAd",
  async ({ id }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.delete(`${apiUrl}/admin/ads/${id}`, {
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
export const disactiveAd = createAsyncThunk(
  "ads/disactiveAd",
  async ({ id }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/ads/${id}/toggle-activate`, { ad_id: id }, {
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


const adsSlice = createSlice({
  name: "ads",
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
      .addCase(fetchAds.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
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
      .addCase(fetchAds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;

      }).addCase(addAd.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addAd.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(addAd.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateAd.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateAd.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteAd.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })








      .addCase(disactiveAd.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(disactiveAd.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(disactiveAd.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default adsSlice.reducer;
