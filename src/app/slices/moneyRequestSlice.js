import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMoneyRequest = createAsyncThunk(
  "allMoneyRequest/getMoneyRequest",
  async ({ email, type }) => {
    const res = await axios.get("https://shohoj-pay-server.onrender.com/getRequests", {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        email: email,
        type: type,
      },
    });
    return res.data;
  }
);

const moneyRequestSlice = createSlice({
  name: "allRequest",
  initialState: {
    isLoading: false,
    requests: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMoneyRequest.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMoneyRequest.fulfilled, (state, action) => {
      state.isLoading = false;
      state.requests = action.payload.reverse();
      state.error = null;
    });

    builder.addCase(fetchMoneyRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.requests = [];
      state.error = action.error.message;
    });
  },
});

export default moneyRequestSlice.reducer;
