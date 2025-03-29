"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import UnAuthRedirect from "@/components/UnAuthRedirect";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
  FaTwitter,
  FaApple
} from "react-icons/fa";
import {
  HiOutlineLightBulb,
  HiOutlineSparkles,
  HiOutlineHeart
} from "react-icons/hi";

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
  const [step, setStep] = useState(1);
  const [strength, setStrength] = useState(0);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    // Password strength calculator
    if (formData.password) {
      let score = 0;
      if (formData.password.length > 8) score += 1;
      if (/\d/.test(formData.password)) score += 1;
      if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;
      if (/[A-Z]/.test(formData.password)) score += 1;
      setStrength(score);
    } else {
      setStrength(0);
    }
  }, [formData.password]);

  const validate = (currentStep) => {
    let stepErrors = {};

    if (currentStep === 1) {
      if (!formData.username) {
        stepErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        stepErrors.username = "Username must be at least 3 characters";
      }

      if (!formData.fullName) {
        stepErrors.fullName = "Full name is required";
      } else if (formData.fullName.length < 3) {
        stepErrors.fullName = "Full name must be at least 3 characters";
      }
    }

    if (currentStep === 2) {
      if (!formData.email) {
        stepErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        stepErrors.email = "Please enter a valid email";
      }
    }

    if (currentStep === 3) {
      if (!formData.password) {
        stepErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        stepErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        stepErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = "Passwords don't match";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const nextStep = () => {
    if (validate(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(3)) return;

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

  const getStrengthText = () => {
    if (strength === 0) return "Too weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">Let's start with your identity</h2>
              <p className="text-gray-500">How should people recognize you?</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <span className="text-blue-400 text-sm">@</span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 pr-10 bg-transparent border-2 rounded-lg focus:outline-none transition-all ${errors.username
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                      }`}
                  />
                </div>
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm ml-2">{errors.username}</p>
              )}

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 bg-transparent border-2 rounded-lg focus:outline-none transition-all ${errors.fullName
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                      }`}
                  />
                </div>
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm ml-2">{errors.fullName}</p>
              )}
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none transition-all"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">How can we reach you?</h2>
              <p className="text-gray-500">We'll send important updates to this email</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 bg-transparent border-2 rounded-lg focus:outline-none transition-all ${errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                      }`}
                  />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm ml-2">{errors.email}</p>
              )}
            </div>

            <div className="flex space-x-4 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevStep}
                className="w-1/3 py-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none transition-all"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="w-2/3 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none transition-all"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">Secure your account</h2>
              <p className="text-gray-500">Create a strong password to protect your new account</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 pr-12 bg-transparent border-2 rounded-lg focus:outline-none transition-all ${errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                      }`}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-blue-500 focus:outline-none"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm ml-2">{errors.password}</p>
              )}

              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <div className="w-full flex space-x-2">
                      <div className={`h-1 flex-1 rounded-full ${strength >= 1 ? getStrengthColor() : "bg-gray-200"}`}></div>
                      <div className={`h-1 flex-1 rounded-full ${strength >= 2 ? getStrengthColor() : "bg-gray-200"}`}></div>
                      <div className={`h-1 flex-1 rounded-full ${strength >= 3 ? getStrengthColor() : "bg-gray-200"}`}></div>
                      <div className={`h-1 flex-1 rounded-full ${strength >= 4 ? getStrengthColor() : "bg-gray-200"}`}></div>
                    </div>
                    <span className="text-xs font-medium ml-2" style={{ color: strength > 0 ? getStrengthColor().replace('bg-', 'text-') : 'text-gray-400' }}>
                      {getStrengthText()}
                    </span>
                  </div>
                </div>
              )}

              <div className="relative group mt-3">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 pr-12 bg-transparent border-2 rounded-lg focus:outline-none transition-all ${errors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                      }`}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="text-blue-500 focus:outline-none"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm ml-2">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex space-x-4 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevStep}
                className="w-1/3 py-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none transition-all"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-2/3 py-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none transition-all relative overflow-hidden"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating your account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create my account
                    {isButtonHovered && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-2"
                      >
                        ✨
                      </motion.span>
                    )}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <UnAuthRedirect>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Left side - Light themed feature showcase */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234F46E5' fillOpacity='0.05' fillRule='evenodd'/%3E%3C/svg%3E'), linear-gradient(to bottom right, rgba(239, 246, 255, 0.7), rgba(238, 242, 255, 0.7))" }}></div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-blue-300 bg-opacity-20 rounded-full backdrop-blur-xl animate-float-slow"></div>
          <div className="absolute top-2/3 right-1/4 w-24 h-24 bg-indigo-300 bg-opacity-20 rounded-full backdrop-blur-xl animate-float-medium"></div>
          <div className="absolute bottom-1/3 left-1/5 w-20 h-20 bg-violet-300 bg-opacity-20 rounded-full backdrop-blur-xl animate-float-fast"></div>

          <div className="px-8 pt-12 md:pt-24 text-gray-800 relative z-10">
            <Link href="/" className="inline-block mb-12">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-blue-500 bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="h-6 w-6 bg-blue-500 rounded-md"></div>
                </div>
                <span className="text-2xl font-bold text-blue-600">Connect</span>
              </div>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-md"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-800">
                Start connecting with your world
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Join millions of others in sharing photos, chatting with friends, and discovering what's trending right now.
              </p>
            </motion.div>
          </div>

          <div className="p-8 relative z-10 hidden md:block">
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white bg-opacity-80 shadow-sm backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex flex-col items-center text-center text-gray-800">
                  <div className="p-3 bg-blue-100 rounded-full mb-2">
                    <HiOutlineLightBulb className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">Discover</h3>
                  <p className="text-xs text-gray-600">Find content that matches your interests</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white bg-opacity-80 shadow-sm backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex flex-col items-center text-center text-gray-800">
                  <div className="p-3 bg-indigo-100 rounded-full mb-2">
                    <HiOutlineSparkles className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-medium mb-1">Connect</h3>
                  <p className="text-xs text-gray-600">Build meaningful relationships with others</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white bg-opacity-80 shadow-sm backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex flex-col items-center text-center text-gray-800">
                  <div className="p-3 bg-violet-100 rounded-full mb-2">
                    <HiOutlineHeart className="h-6 w-6 text-violet-600" />
                  </div>
                  <h3 className="font-medium mb-1">Engage</h3>
                  <p className="text-xs text-gray-600">Interact with content you care about</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-6 md:mb-10">
              <div className="flex justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Create an account</h1>
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Sign in</Link>
              </div>
              <p className="text-gray-500 mt-2">
                Join our community and start sharing your experiences!
              </p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
                <span className="px-4 text-sm text-gray-500">Step {step} of 3</span>
                <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
              </div>

              <div className="relative">
                {renderStep()}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <FaGoogle className="text-red-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <FaFacebookF className="text-blue-600" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-50 hover:bg-sky-100 transition-colors"
                >
                  <FaTwitter className="text-sky-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <FaApple className="text-gray-800" />
                </motion.button>
              </div>

              <p className="text-center text-sm text-gray-500">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </UnAuthRedirect >
  );
}