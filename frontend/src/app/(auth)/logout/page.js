"use client"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signOut } from "next-auth/react";
import { performLogout, clearAuthState } from "@/redux/auth/authSlice";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      // Sign out from NextAuth
      await signOut({ redirect: false });
      
      // Dispatch the logout action to update the Redux state
      await dispatch(performLogout()).unwrap();

      // Remove the authToken from localStorage
      localStorage.removeItem("authToken");

      // Redirect to the login page
      router.push("/login");
    };

    handleLogout();
  }, [dispatch, router]);

  return null; // This page doesn't need to render any UI
};

export default LogoutPage;