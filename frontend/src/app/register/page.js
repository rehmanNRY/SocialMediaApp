"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import UnAuthRedirect from "@/components/UnAuthRedirect";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const validate = () => {
    let errors = {};

    // Validate username (must be at least 3 characters)
    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    }

    // Validate full name (must be at least 3 characters)
    if (!formData.fullName) {
      errors.fullName = "Full Name is required";
    } else if (formData.fullName.length < 3) {
      errors.fullName = "Full Name must be at least 3 characters long";
    }

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    // Validate password (must be at least 6 characters)
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (formData.password.length > 30) {
      errors.password = "Password must be no more than 30 characters long";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/register`,
        {
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }
      );
      console.log("User registered successfully:", response.data);
      router.push("/login"); 
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message);

      // Set the error message from the backend or show default if no message
      setErrors({
        email: error.response?.data?.message || "User with this email or username already exists",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UnAuthRedirect>
      <div className="min-h-screen flex items-center justify-center bg-indigo-100 p-6 w-screen registerPage">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white shadow-xl rounded-xl border border-gray-200 p-10 space-y-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-600">Sign Up</h2>
            <p className="text-lg text-gray-600 mt-2">Create your account</p>
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-6 py-3 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-2">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-6 py-3 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-6 py-3 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
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
              className={`w-full px-6 py-3 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-6 py-3 text-base border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-base text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </UnAuthRedirect>
  );
}
