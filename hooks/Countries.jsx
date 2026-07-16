// src/store/slices/countriesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../constants/apiUrl";

export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async (currentPage, thunkAPI) => {
    try {
      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state



      const response = await axios.get(`https://nanosoft.technology/osta-basha/api/countries`);
      console.log(response.data.data,"response.data.data");
      
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
export const addCountry = createAsyncThunk(
  "countries/addCountry",
  async (countryData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/countries`, countryData, {
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
export const updateCountry = createAsyncThunk(
  "countries/updateCountry",
  async ({ id, data }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/countries/${id}`, data, {
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
export const deleteCountry = createAsyncThunk(
  "countries/deleteCountry",
  async ({ id }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.delete(`${apiUrl}/admin/countries/${id}`, {
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
export const disactiveCountry = createAsyncThunk(
  "countries/disactiveCountry",
  async ({ id }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/countries/${id}/toggle-activate`, { country_id: id }, {
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


const countriesSlice = createSlice({
  name: "countries",
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
      .addCase(fetchCountries.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        if (action.payload && Array.isArray(action.payload.data)) {
          state.list = action.payload.data; // هنا نخزن المصفوفة الـ (6) عناصر
          state.pagination = action.payload; // هنا نخزن باقي تفاصيل الترقيم
        } else {
          state.list = [];
        }

      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;

      }).addCase(addCountry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addCountry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(addCountry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateCountry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateCountry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteCountry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(deleteCountry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })








      .addCase(disactiveCountry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(disactiveCountry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(disactiveCountry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default countriesSlice.reducer;
