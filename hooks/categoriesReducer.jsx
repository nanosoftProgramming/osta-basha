// src/store/slices/categoriesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (currentPage, thunkAPI) => {
    try {
      
      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state



      const response = await axios.get(
        `${apiUrl}/categories`,
        {
          headers: {
                    Authorization: `Bearer ${state?.authorization?.token}`,
                    "Accept-Language": state?.Localization?.currentLocal?.language == "العربيه" ? "ar" : "en"
          },
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
export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (categoryData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/categories`, categoryData, {
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
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (categoryData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/categories/${categoryData?.id}`, categoryData, {
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

const categoriesSlice = createSlice({
  name: "categories",
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
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;

      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
                state.loading = false;

        if (action.payload && Array.isArray(action.payload.data)) {
          state.list = action.payload.data; // هنا نخزن المصفوفة الـ (6) عناصر
          state.pagination = action.payload; // هنا نخزن باقي تفاصيل الترقيم
        } else {
          state.list = [];
        }

      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      }).addCase(addCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default categoriesSlice.reducer;
