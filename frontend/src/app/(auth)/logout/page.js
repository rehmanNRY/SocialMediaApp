"use client"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/auth/authSlice";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Dispatch the logout action to update the Redux state
    dispatch(logout());

    // Remove the authToken from localStorage
    localStorage.removeItem("authToken");

    // Redirect to the login page
    router.push("/login");
  }, [dispatch, router]);

  return null; // This page doesn't need to render any UI
};

export default LogoutPage;