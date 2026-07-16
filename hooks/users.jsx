// {{base}}/api/users
// src/store/slices/usersSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (paramsObj, thunkAPI) => {
    try {

      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state
      const token = state.authorization?.token; // عدل حسب مكان التوكن عندك

      const queryString = new URLSearchParams(paramsObj)?.toString();
console.log(`${apiUrl}/users?${queryString}`,"paramsObj");

      const response = await axios.get(`${apiUrl}/users?${queryString}`,
        {
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
export const fetchSearch = createAsyncThunk(
  "users/fetchSearch",
  async (paramsObj, thunkAPI) => {
    try {

      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state
      const token = state.authorization?.token; // عدل حسب مكان التوكن عندك

      const queryString = new URLSearchParams(paramsObj)?.toString();
console.log(`${apiUrl}/user/search?${queryString}`,"paramsObj");

      const response = await axios.get(`${apiUrl}/user/search?${queryString}`,
        {
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
export const fetchFavorit = createAsyncThunk(
  "users/fetchFavorit",
  async (paramsObj, thunkAPI) => {
    try {

      const state = thunkAPI.getState();

      console.log(state?.authorization?.token);

      const response = await axios.get(`${apiUrl}/client/favourites/toggle`, { user_id: id }, {
        headers: {
          Authorization: `Bearer ${state?.authorization?.token}`,
          "Accept-Language": state?.Localization?.currentLocal?.language == "العربيه" ? "ar" : "en"
        },
      }
      );
      console.log(response.data.data.data, "response.data.data");

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
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/users`, userData, {
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
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/users/${userData?.id}`, userData, {
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

const usersSlice = createSlice({
  name: "users",
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
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;

      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        if (action.payload && Array.isArray(action.payload.data)) {
          console.log(action.payload.data,"payload.data");
          
const filterdata = action.payload.data.filter(
      (item) => item.first_name !== null && item.first_name.toString().trim() !== ""
    );
            console.log(filterdata.length,"filterdata");
        
          state.list = filterdata; 
          state.pagination = action.payload; 
        } else {
          state.list = [];
        }

      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      })
            .addCase(fetchSearch.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;

      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        if (action.payload && Array.isArray(action.payload.data)) {
          state.list = action.payload.data; // هنا نخزن المصفوفة الـ (6) عناصر
          state.pagination = action.payload; // هنا نخزن باقي تفاصيل الترقيم
        } else {
          state.list = [];
        }

      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      })
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      .addCase(addUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default usersSlice.reducer;
