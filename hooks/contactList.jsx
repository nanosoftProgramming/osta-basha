// src/store/slices/contactListSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";

export const fetchContactList = createAsyncThunk(
  "contactList/fetchContactList",
  async (currentPage, thunkAPI) => {
    try {
      
      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state


      const response = await axios.get(
        `${apiUrl}/client/contact-list`,
        {
          headers: {
                    Authorization: `Bearer ${state?.authorization?.token}`,
                    "Accept-Language": state?.Localization?.currentLocal?.language == "العربيه" ? "ar" : "en"
          },
        }
      );
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
export const addContactList = createAsyncThunk(
  "contactList/addContactList",
  async (contactListData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/contactList`, contactListData, {
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
export const updateContactList = createAsyncThunk(
  "contactList/updateContactList",
  async (contactListData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/admin/contactList/${contactListData?.id}`, contactListData, {
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

const contactListSlice = createSlice({
  name: "contactList",
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
      .addCase(fetchContactList.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.loading = true;

      })
      .addCase(fetchContactList.fulfilled, (state, action) => {
        state.status = "succeeded";
                state.loading = false;
state.list = action.payload
        // if (action.payload && Array.isArray(action.payload.data)) {
        //   state.list = action.payload.data; // هنا نخزن المصفوفة الـ (6) عناصر
        //   state.pagination = action.payload; // هنا نخزن باقي تفاصيل الترقيم
        // } else {
        //   state.list = [];
        // }

      })
      .addCase(fetchContactList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      }).addCase(addContactList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addContactList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(addContactList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateContactList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateContactList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateContactList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default contactListSlice.reducer;
