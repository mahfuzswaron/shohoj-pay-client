import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchAllAdmin = createAsyncThunk(
  "allAdmin/getAllAdmin",
  async () => {
    const res = await axios.get(`https://shohoj-pay-server.onrender.com/getAllAdmin`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return res.data;
  }
);

const allAdminSlice = createSlice({
  name: "allAdmin",
  initialState: {
    isLoading: false,
    allAdmins: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllAdmin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allAdmins = action.payload;
      state.error = null;
    });

    builder.addCase(fetchAllAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.allAdmins = [];
      state.error = action.error.message;
    });
  },
});

export default allAdminSlice.reducer;
