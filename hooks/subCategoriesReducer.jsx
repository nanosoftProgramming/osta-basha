// src/store/slices/subSubCategoriesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";

export const fetchSubCategories = createAsyncThunk(
  "subSubCategories/fetchSubCategories",
  async (id, thunkAPI) => {
    try {

      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state



      const response = await axios.get(
        `${apiUrl}/categories/${id}/sub-categories`,
        {
          headers: {
            Authorization: `Bearer ${state?.authorization?.token}`,
            "Accept-Language": state?.Localization?.currentLocal?.language == "العربيه" ? "ar" : "en"
          },
        }
      );
// await new Promise((resolve) => setTimeout(resolve, 800));
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
export const addSubCategory = createAsyncThunk(
  "subSubCategories/addSubCategory",
  async (subCategoryData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/subSubCategories`, subCategoryData, {
        headers: {
          Authorization: `Bearer ${state?.authorization?.token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(Object.values(error.response.data.errors)[0][0] || "فشل إضافة الصف");
    }
  }
);
export const ChooseSubCategories = createAsyncThunk(
  "subSubCategories/ChooseSubCategories",
  async (subCategoryData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/user/auth/choose-subcategories`, subCategoryData, {
        headers: {
          Authorization: `Bearer ${state?.authorization?.token}`,
        },
      });
console.log(response?.data);

      return response.data.data;
    } catch (error) {
      console.log(error,"reducerError");
      return "error"
      // return thunkAPI.rejectWithValue(Object.values(error.response.data.errors)[0][0] || "فشل إضافة الصف");
    }
  }
);
export const updateSubCategory = createAsyncThunk(
  "subSubCategories/updateSubCategory",
  async (subCategoryData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/subSubCategories/${subCategoryData?.id}`, subCategoryData, {
        headers: {
          Authorization: `Bearer ${state?.auth?.userArray?.access_token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "فشل إضافة الصف");
    }
  }
);

const subSubCategoriesSlice = createSlice({
  name: "subSubCategories",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    loading: true,
    pagination: null,
    addingData:null


  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.status = "loading";
                        // state.list = [];

        state.error = null;
        state.loading = true;
              })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;

        if (action.payload && Array.isArray(action.payload.data)) {
          state.list = action.payload.data; // هنا نخزن المصفوفة الـ (6) عناصر
          state.pagination = action.payload; // هنا نخزن باقي تفاصيل الترقيم
        } else {
          state.list = [];
        }

      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      })









      // ChooseSubCategories

      .addCase(ChooseSubCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;

      })
      .addCase(ChooseSubCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.addingData = action.payload;
      })
      .addCase(ChooseSubCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      })

















      .addCase(addSubCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateSubCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default subSubCategoriesSlice.reducer;
