import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthData, User } from "../types";
import Cookies from "js-cookie";

interface AuthState {
    user: User | null;
    token: string | null;
    role: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthData>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.roles[0];
            state.isAuthenticated = true;

            Cookies.set("token", action.payload.token, {
                expires: 7,
                secure: true,
                sameSite: "strict",
            });

            Cookies.set("user_id", action.payload.publicId, {
                expires: 7,
                secure: true,
                sameSite: "strict",
            });

            Cookies.set("user_role", action.payload.roles[0], {
                expires: 7,
                sameSite: "strict",
            });
        },

        setUserFromReload: (
            state,
            action: PayloadAction<{ user: User; role: string }>
        ) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },


        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
            Cookies.remove("token");
            Cookies.remove("user_role");
            Cookies.remove("user_id");
            window.location.href = "/login";
        },
    },
});

export const { login, setUserFromReload, logout } = authSlice.actions;
export default authSlice.reducer;
