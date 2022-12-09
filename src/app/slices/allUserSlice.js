import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchAllUser = createAsyncThunk(
  "allUser/getAllUser",
  async (query) => {
    const res = await axios.get(`https://shohoj-pay-server.onrender.com/getAllUser`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        query: query,
      },
    });
    return res.data;
  }
);

const allUserSlice = createSlice({
  name: "allUser",
  initialState: {
    isLoading: false,
    allUsers: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allUsers = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAllUser.rejected, (state, action) => {
      state.isLoading = false;
      state.allUsers = [];
      state.error = action.error.message;
    });
  },
});

export default allUserSlice.reducer;
