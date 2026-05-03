"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { getProfileByRole } from "@/features/auth/services/authService";
import { setUserFromReload } from "@/features/auth/store/authSlice";
import { getUserDetailsFromCookies } from "@/utils/sharedHelper";

export default function StoreInitializer() {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const { token, userId: publicId, userRole: role } = getUserDetailsFromCookies();
    if (!token || !role || !publicId) return;  

    hasInitialized.current = true;

    const init = async () => {
      try {
        if (role === "ClinicalDoctor") {
          dispatch(
            setUserFromReload({
              user: null,
              role,
            }),
          );
          return;
        }

        const user = await getProfileByRole(role, publicId);
        dispatch(
          setUserFromReload({
            user,
            role,
          }),
        );
      } catch (err) {
        console.log("Restore auth failed:", err);
        hasInitialized.current = false;
      }
    };

    init();
  }, [dispatch]);

  return null;
}
