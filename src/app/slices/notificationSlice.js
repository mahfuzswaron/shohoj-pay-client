import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk(
  "allNotifications/getNotifications",
  async (email) => {
    const res = await axios.get("https://shohoj-pay-server.onrender.com/getNotification", {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        email,
      },
    });
    return res.data;
  }
);

const notificationSlice = createSlice({
  name: "allNotifications",
  initialState: {
    isLoading: false,
    notifications: [],
    unseenNotifications: [],
    error: null,
  },
  reducers: {
    updateUnseenNotifications: (state, action) => {
      state.unseenNotifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload[0].reverse();
      state.unseenNotifications = action.payload[1];
      state.error = null;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.notifications = [];
      state.unseenNotifications = [];
      state.error = action.error.message;
    });
  },
});

export const { updateUnseenNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
