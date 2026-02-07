import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthData } from "../types";
import Cookies from "js-cookie";

interface AuthState {
    user: AuthData | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthData>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            Cookies.set("token", action.payload.token, {
                expires: 7,
                secure: true,
                sameSite: 'strict'
            });
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            Cookies.remove("token");
            window.location.href = "/login";
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;