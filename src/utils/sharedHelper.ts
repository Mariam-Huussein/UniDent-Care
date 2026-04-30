import Cookies from "js-cookie";

export function getTokensAndUserId() {
    const token = Cookies.get("token");
    const userId = Cookies.get("user_id");
    return {
        token,
        userId,
    };
}

export function removeUserData() {
    Cookies.remove("token");
    Cookies.remove("user_id");
    Cookies.remove("university_id");
    Cookies.remove("user_role");
}