// src/store/slices/notificationsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiUrl from "../constants/apiUrl";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (currentPage, thunkAPI) => {
    try {
      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state



      const response = await axios.get(`${apiUrl}/sliders`);
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




export const unReadNotificationsCount = createAsyncThunk(
  "notifications/unReadNotificationsCount",
  async (currentPage, thunkAPI) => {
    try {
      // const params = new URLSearchParams();
      const state = thunkAPI.getState(); // Access Redux state
      const response = await axios.get(`${apiUrl}/notification/unReadNotificationsCount`,{
                        headers: {
                    Authorization: `Bearer ${state?.authorization?.token}`,
                    "Accept-Language": state?.Localization?.currentLocal?.language == "العربيه" ? "ar" : "en"
                },
      });
      
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
export const notificationdNotification = createAsyncThunk(
  "notifications/notificationdNotification",
  async (notificationData, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/notificationmin/notifications`, notificationData, {
        henotificationers: {
          Authorization: `Bearer ${state.auth.userArray.access_token}`,

        },
      });

      return response.data.data;
    } catch (error) {

      return thunkAPI.rejectWithValue(Object.values(error.response.data.errors)[0][0] || "فشل إضافة الصف");
    }
  }
);
export const updateNotification = createAsyncThunk(
  "notifications/updateNotification",
  async ({ id, data }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/notificationmin/notifications/${id}`, data, {
        henotificationers: {
          Authorization: `Bearer ${state.auth.userArray.access_token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "فشل إضافة الصف");
    }
  }
);
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async ({ id }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.delete(`${apiUrl}/notificationmin/notifications/${id}`, {
        henotificationers: {
          Authorization: `Bearer ${state.auth.userArray.access_token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "فشل إضافة الصف");
    }
  }
);
export const disactiveNotification = createAsyncThunk(
  "notifications/disactiveNotification",
  async ({ id }, thunkAPI) => {
    try {
      const state = thunkAPI.getState(); // Access Redux state

      const response = await axios.post(`${apiUrl}/notificationmin/notifications/${id}/toggle-activate`, { notification_id: id }, {
        henotificationers: {
          Authorization: `Bearer ${state.auth.userArray.access_token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "فشل إضافة الصف");
    }
  }
);


const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    unReadNotificationsCount: null,
    status: "idle",
    error: null,
    lonotificationing: true,
    pagination: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "lonotificationing";
        state.error = null;
        state.lonotificationing = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lonotificationing = false;
        if (action.payload && Array.isArray(action.payload.data)) {
          state.list = action.payload.data; // هنا نخزن المصفوفة الـ (6) عناصر
          state.pagination = action.payload; // هنا نخزن باقي تفاصيل الترقيم
        } else {
          state.list = [];
        }

      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.lonotificationing = false;

      })
      
      // unReadNotificationsCount
      
      .addCase(unReadNotificationsCount.pending, (state) => {
        state.status = "lonotificationing";
        state.error = null;
        state.lonotificationing = true;
      })
      .addCase(unReadNotificationsCount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lonotificationing = false;
        state.unReadNotificationsCount = action.payload;
  

      })
      .addCase(unReadNotificationsCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.lonotificationing = false;

      })



      .addCase(notificationdNotification.pending, (state) => {
        state.status = "lonotificationing";
        state.error = null;
      })
      .addCase(notificationdNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(notificationdNotification.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }).addCase(updateNotification.pending, (state) => {
        state.status = "lonotificationing";
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteNotification.pending, (state) => {
        state.status = "lonotificationing";
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })








      .addCase(disactiveNotification.pending, (state) => {
        state.status = "lonotificationing";
        state.error = null;
      })

      .addCase(disactiveNotification.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.push(action.payload);
      })
      .addCase(disactiveNotification.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

  },
});

export default notificationsSlice.reducer;
