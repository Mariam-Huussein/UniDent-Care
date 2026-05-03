'use client'
import axios from "axios";
import Cookies from "js-cookie";
import { getUserDetailsFromCookies } from "./sharedHelper";

const axiosInstance = axios.create({
    baseURL: "https://dental-hup1.runasp.net/api",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const {token} = getUserDetailsFromCookies();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            Cookies.remove("token");
            Cookies.remove("user_role");
            Cookies.remove("user_id");
            Cookies.remove("university_id");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;