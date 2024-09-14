"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setLoggedIn } from "@/redux/auth/authSlice";
import Link from "next/link";
import UnAuthRedirect from "@/components/UnAuthRedirect";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect to home if already logged in
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const validate = () => {
    let errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Store the token in localStorage
      localStorage.setItem("authToken", response.data.data.token);
      
      // Set the logged-in status in Redux
      dispatch(setLoggedIn(true, response.data.data.token));

      router.push("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      setErrors({ general: error.response?.data?.message || "Invalid credentials" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UnAuthRedirect>
    <div className="min-h-screen flex items-center justify-center bg-indigo-100 p-6 w-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-indigo-600 text-center">
          Login
        </h2>

        {errors.general && (
          <p className="text-red-500 text-center text-sm">{errors.general}</p>
        )}

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging In..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Sign Up here
          </Link>
        </p>
      </form>
    </div>
    </UnAuthRedirect>
  );
}
