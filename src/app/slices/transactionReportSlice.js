import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTransactionReport = createAsyncThunk(
  "transactions/getTransactionReport",
  async (month) => {
    const res = await axios.get("https://shohoj-pay-server.onrender.com/getTransactionReport", {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
        month: month,
      },
    });
    return res.data;
  }
);

const transactionReportSlice = createSlice({
  name: "transactionReports",
  initialState: {
    isLoading: false,
    transactionReports: {},
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTransactionReport.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactionReport.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.transactionReports = action.payload;
    });
    builder.addCase(fetchTransactionReport.rejected, (state, action) => {
      state.isLoading = false;
      state.transactionReports = {};
      state.error = action.error.message;
    });
  },
});

export default transactionReportSlice.reducer;
