import Cookies from "js-cookie";

export function getTokens() {
    const cookieToken = Cookies.get("token");
    const cookieUserId = Cookies.get("user_id");
    return {
        cookieToken,
        cookieUserId,
    };
}