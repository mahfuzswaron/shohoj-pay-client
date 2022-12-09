import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserInfo = createAsyncThunk(
    "userInfo/fetchUserInfo",
    async (user) => {
        const res = await axios.get(
            `https://shohoj-pay-server.onrender.com/getUserInfo`,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    email: user?.email
                },
            }
        );
        return res.data;
    }
);

const userInfoSlice = createSlice({
    name: "userInfoSlice",
    initialState: {
        isLoading: false,
        userInfo: {},
        error: null,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserInfo.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userInfo = action.payload;
            state.error = null;
        });
        builder.addCase(fetchUserInfo.rejected, (state, action) => {
            state.isLoading = false;
            state.userInfo = {};
            state.error = action.error.message;
        });
    },
});

export default userInfoSlice.reducer