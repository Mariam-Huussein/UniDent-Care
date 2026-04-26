import Cookies from "js-cookie";

export function getTokensAndUserId() {
    const token = Cookies.get("token");
    const userId = Cookies.get("user_id");
    return {
        token,
        userId,
    };
}