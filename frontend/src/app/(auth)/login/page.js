"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setLoggedIn } from "@/redux/auth/authSlice";
import Link from "next/link";
import UnAuthRedirect from "@/components/UnAuthRedirect";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaFacebook, FaTwitter, FaCheckCircle } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { RiUploadCloud2Fill } from "react-icons/ri";

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formFocus, setFormFocus] = useState({
    email: false,
    password: false
  });

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleFocus = (field) => {
    setFormFocus({...formFocus, [field]: true});
  };

  const handleBlur = (field) => {
    setFormFocus({...formFocus, [field]: false});
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
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 to-purple-100">
        {/* Left side - Visual content */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-pattern-dots"></div>
            <div className="absolute inset-0 bg-gradient-radial from-indigo-500/20 to-transparent"></div>
          </div>
          
          <div className="max-w-lg z-10 text-center">
            <div className="flex justify-center mb-10">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="w-40 h-40 relative">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400/30 backdrop-blur-sm rounded-lg transform -rotate-6 animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-400/30 backdrop-blur-sm rounded-lg transform rotate-6 animate-pulse" style={{animationDelay: "1s"}}></div>
                  <div className="absolute inset-4 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <BiMessageDetail size={64} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">Welcome Back!</h2>
            
            <p className="text-lg text-indigo-100 mb-10">
              Log in to continue your journey. Connect with friends, discover trending content, and share your moments with the world.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <IoNotifications size={24} className="text-white" />
                  <h3 className="text-xl font-semibold text-white">Notifications</h3>
                </div>
                <p className="text-indigo-100">
                  See who liked your posts and stay updated with friend requests
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <RiUploadCloud2Fill size={24} className="text-white" />
                  <h3 className="text-xl font-semibold text-white">Share</h3>
                </div>
                <p className="text-indigo-100">
                  Upload your best moments and share them with your community
                </p>
              </div>
            </div>
            
            <div className="text-white">
              <span className="text-sm opacity-80">Trusted by 1M+ users worldwide</span>
              <div className="flex justify-center mt-4 space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white/50"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/70"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/70"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h1 className="text-4xl font-extrabold text-indigo-800 mb-2 relative">
                Welcome Back
                <span className="absolute -bottom-1 left-0 w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
              </h1>
              <p className="text-gray-600">Sign in to continue to your account</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              {errors.general && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 animate-shake">
                  <p className="text-red-600 text-sm font-medium">{errors.general}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                  <p className="text-gray-500 text-sm mt-1">Please enter your credentials</p>
                </div>

                <div className="relative">
                  <FiMail className={`absolute left-3 top-3.5 h-5 w-5 transition-colors duration-200 ${formFocus.email ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 ${
                      errors.email ? "border-red-500" : formFocus.email ? "border-indigo-500" : "border-gray-200"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.email}</p>
                  )}
                </div>

                <div className="relative">
                  <FiLock className={`absolute left-3 top-3.5 h-5 w-5 transition-colors duration-200 ${formFocus.password ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 ${
                      errors.password ? "border-red-500" : formFocus.password ? "border-indigo-500" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 animate-fadeIn">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="remember-me" 
                        checked={rememberMe}
                        onChange={toggleRememberMe}
                        className="sr-only peer"
                      />
                      <div className="h-5 w-9 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-300 transition-colors"></div>
                      <div className="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-white"></div>
                    </div>
                    <label htmlFor="remember-me" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all active:scale-98 hover:shadow-indigo-500/30"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Sign In <FaCheckCircle className="ml-2" />
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-center text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                    Create account
                  </Link>
                </div>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-gray-200 w-full"></div>
                  <div className="bg-white px-4 text-sm text-gray-500">or continue with</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:border-indigo-500 hover:text-indigo-600 group"
                  >
                    <FaGoogle className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:border-indigo-500 hover:text-indigo-600 group"
                  >
                    <FaFacebook className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                  </button>
                  <button
                    type="button"
                    className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:border-indigo-500 hover:text-indigo-600 group"
                  >
                    <FaTwitter className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              By signing in, you agree to our{" "}
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
      </div>
    </UnAuthRedirect>
  );
}