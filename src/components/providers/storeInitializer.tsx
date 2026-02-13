"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { getDecodedToken } from "@/utils/decodeToken";
import { getProfileByRole } from "@/features/auth/services/authService";
import { setUserFromReload } from "@/features/auth/store/authSlice";

export default function StoreInitializer() {
  console.log("StoreInitializer mounted");
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const decoded = getDecodedToken();
    if (!decoded) return;

    const init = async () => {
      try {
        const user = await getProfileByRole(decoded.role, decoded.userId);
        console.log("API USER RESPONSE:", user);
        dispatch(
          setUserFromReload({
            user,
            role: decoded.role,
          }),
        );
      } catch (err) {
        console.log("Restore auth failed:", err);
      }
    };

    init();
  }, [dispatch]);

  return null;
}
