'use client'
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: "https://dental-hup1.runasp.net/api/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;