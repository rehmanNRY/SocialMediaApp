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
      <div className="registerPage min-h-screen flex items-center justify-center bg-indigo-100 p-6 w-screen">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white shadow-xl rounded-xl border border-gray-200 p-10 space-y-6 z-10"
        >
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-lg text-gray-600 mt-2">Please login to your account</p>
          </div>

          {errors.general && (
            <p className="text-red-500 text-center text-base mb-4">{errors.general}</p>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-6 py-3 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-6 py-3 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </button>

          <p className="text-base text-center text-gray-600">
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
