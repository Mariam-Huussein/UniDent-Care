import Cookies from "js-cookie";

export function getUserDetailsFromCookies() {
    const token = Cookies.get("token");
    const userId = Cookies.get("user_id");
    const userRole = Cookies.get("user_role");
    const universityId = Cookies.get("university_id");
    return {
        token,
        userId,
        userRole,
        universityId,
    };
}

export function removeUserData() {
    Cookies.remove("token");
    Cookies.remove("user_id");
    Cookies.remove("university_id");
    Cookies.remove("user_role");
}