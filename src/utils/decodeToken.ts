import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export interface UserPayload {
    userId: string;
    role: string;
}

export const getDecodedToken = (): UserPayload | null => {
    const token = Cookies.get("token");

    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token);

        return {
            userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        };
    } catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
};