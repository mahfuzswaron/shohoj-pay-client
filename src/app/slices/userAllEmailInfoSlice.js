import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchUserEmailInfo = createAsyncThunk(
  "allData/fetchUserEmailInfo",
  async (user) => {
    const res = await axios.get(
      `https://shohoj-pay-server.onrender.com/user-all-info/${user?.email}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return res.data;
  }
);

const userAllEmailInfoSlice = createSlice({
  name: "userAllEmailInfoSlice",
  initialState: {
    isLoading: false,
    allInfo: {},
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserEmailInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserEmailInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allInfo = action.payload;
      state.error = null;
    });

    builder.addCase(fetchUserEmailInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.allInfo = [];
      state.error = action.error.message;
    });
  },
});

export default userAllEmailInfoSlice.reducer;
