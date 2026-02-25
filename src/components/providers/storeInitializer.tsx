"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { getProfileByRole } from "@/features/auth/services/authService";
import { setUserFromReload } from "@/features/auth/store/authSlice";

export default function StoreInitializer() {
  console.log("StoreInitializer mounted");
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("user_role");
    const publicId = Cookies.get("public_id");
    if (!token || !role || !publicId) return;

    const init = async () => {
      try {
        const user = await getProfileByRole(role, publicId);
        console.log("API USER RESPONSE:", user);
        dispatch(
          setUserFromReload({
            user,
            role,
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
