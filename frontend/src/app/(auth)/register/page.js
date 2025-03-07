"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import UnAuthRedirect from "@/components/UnAuthRedirect";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaGoogle, FaFacebookF, FaTwitter, FaApple } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsCheckCircleFill, BsShieldCheck, BsGlobe, BsPeople } from "react-icons/bs";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    // Simple password strength calculator
    if (formData.password) {
      let score = 0;
      // Length check
      if (formData.password.length > 8) score += 1;
      // Contains number
      if (/\d/.test(formData.password)) score += 1;
      // Contains special char
      if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;
      // Contains uppercase
      if (/[A-Z]/.test(formData.password)) score += 1;
      setStrength(score);
    } else {
      setStrength(0);
    }
  }, [formData.password]);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getStrengthColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <UnAuthRedirect>
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-indigo-800 mb-2">Join Our Community</h1>
              <p className="text-gray-600">Connect with friends and the world around you.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden border border-gray-100">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Create Account</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-8 rounded-full ${currentStep >= 1 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                    <div className={`h-2 w-8 rounded-full ${currentStep >= 2 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                    <div className={`h-2 w-8 rounded-full ${currentStep >= 3 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                  </div>
                </div>

                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                      errors.username ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                  )}
                </div>

                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                      errors.fullName ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3.5 text-gray-400 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${getStrengthColor()}`} style={{ width: `${25 * strength}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {strength === 0 && "Password strength: Enter password"}
                        {strength === 1 && "Password strength: Weak"}
                        {strength === 2 && "Password strength: Fair"}
                        {strength === 3 && "Password strength: Good"}
                        {strength === 4 && "Password strength: Strong"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-3.5 text-gray-400 focus:outline-none"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 px-4 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all active:scale-98"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-3" />
                        Creating your account...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Create Account
                        <FiArrowRight className="ml-2" />
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-center text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                    Sign in
                  </Link>
                </div>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-gray-200 w-full"></div>
                  <div className="bg-white px-4 text-sm text-gray-500">or continue with</div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <button
                    type="button"
                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaGoogle className="h-5 w-5 text-red-500" />
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaFacebookF className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaTwitter className="h-5 w-5 text-blue-400" />
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaApple className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Illustration/Image */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 800 800">
              <defs>
                <pattern id="patternId" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="white" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="800" height="800" fill="url(#patternId)" />
            </svg>
          </div>
          
          <div className="max-w-lg z-10 text-center">
            <div className="flex justify-center mb-8">
              <div className="h-24 w-24 rounded-full bg-white bg-opacity-20 backdrop-blur-xl flex items-center justify-center">
                <FaCheckCircle size={48} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">Join thousands already connecting</h2>
            
            <p className="text-lg text-indigo-100 mb-8">
              Create your account in minutes and start connecting with friends, sharing moments, and discovering new content tailored to your interests.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <BsShieldCheck size={20} className="text-white" />
                </div>
                <span className="text-white font-medium">Secure and private</span>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <BsGlobe size={20} className="text-white" />
                </div>
                <span className="text-white font-medium">Global community</span>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <BsPeople size={20} className="text-white" />
                </div>
                <span className="text-white font-medium">Connect with friends</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="flex -space-x-4">
                <div className="h-12 w-12 rounded-full border-2 border-indigo-600 bg-gray-200"></div>
                <div className="h-12 w-12 rounded-full border-2 border-indigo-600 bg-gray-200"></div>
                <div className="h-12 w-12 rounded-full border-2 border-indigo-600 bg-gray-200"></div>
                <div className="h-12 w-12 rounded-full border-2 border-indigo-600 bg-indigo-300 flex items-center justify-center text-indigo-800 font-bold text-sm">
                  99+
                </div>
              </div>
              <p className="text-white">Joined this month</p>
            </div>
          </div>

          {/* Floating elements for decoration */}
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-400 bg-opacity-30 rounded-2xl backdrop-blur-xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-indigo-400 bg-opacity-30 rounded-full backdrop-blur-xl animate-float-delay"></div>
        </div>
      </div>
    </UnAuthRedirect>
  );
}