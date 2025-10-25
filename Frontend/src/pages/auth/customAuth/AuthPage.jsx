import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { loginUser, registerUser } from "@/Services/login";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [loading, setLoading] = useState(false);
  // state to display the errors
  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // new states for OTP flow
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // axios instance
  const axiosInstance = axios.create({
    baseURL: VITE_APP_URL + "api/",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // send OTP to backend
  const handleSendOtp = async () => {
    setSignUpError("");
    setErrors({});
    if (!email.trim()) {
      setErrors({ email: "Please enter an email first." });
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("users/send-otp", { email });
      if (res.data.success) {
        setOtpSent(true);
        alert("OTP sent to your email!");
      } else {
        setSignUpError(res.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setSignUpError(error?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // submit Registration (with OTP check)
  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    setSignUpError("");
    const { fullname, email, password } = event.target.elements;
    const newErrors = { fullname: "", email: "", password: "" };

    // full name validation
    if (!fullname.value.trim()) {
      newErrors.fullname = "Full name is required.";
    } else if (fullname.value.trim().length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters.";
    }

    // email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(email.value)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // password validation
    if (!password.value.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.value.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password.value)
    ) {
      newErrors.password =
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((msg) => msg)) return;

    if (!otpVerified) {
      setSignUpError("Please verify your email with the correct OTP first.");
      return;
    }

    // continue registration
    setLoading(true);
    const data = {
      fullName: fullname.value,
      email: email.value,
      password: password.value,
    };

    try {
      const response = await registerUser(data);
      if (response?.statusCode === 201) {
        handleSignInSubmit(event);
      }
    } catch (error) {
      setSignUpError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("users/verify-otp", {
        email,
        otp,
      });
      if (res.data.success) {
        setOtpVerified(true);
        alert("Email verified successfully!");
      } else {
        setSignUpError(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      setSignUpError(error?.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    setSignInError("");

    const { email, password } = event.target.elements;
    const newErrors = { email: "", password: "" };

    // email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(email.value)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // password validation
    if (!password.value.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.value.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);

    // stop if any validation errors exist
    if (Object.values(newErrors).some((msg) => msg)) return;

    setLoading(true);
    const data = { email: email.value, password: password.value };

    try {
      console.log("Login Started in Frontend");
      const user = await loginUser(data);
      console.log("Login Completed");

      if (user?.statusCode === 200) {
        navigate("/");
      }
    } catch (error) {
      setSignInError(error.message);
      console.log("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // updated Background to Dark Blue/Purple Gradient
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#361f68] bg-opacity-80">
      <motion.div
        // updated Card style: Rounded, White, Box Shadow, specific width/padding
        className="relative w-[500px] p-8 bg-white rounded-3xl shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* main title, centered and bold */}
        <h1 className="text-2xl font-extrabold mb-8 text-center text-[#361f68]">
          Welcome to Automated Resume Builder
        </h1>

        {/* tab container - removed border-b to match screenshot, used flex/gap for layout */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            // sign in tab style
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg ${
              !isSignUp
                ? "bg-white text-[#361f68] border border-[#361f68] shadow-md"
                : "text-gray-600 hover:text-[#5d40a0]"
            }`}
          >
            <FaSignInAlt />
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            // sign up tab style
            className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg ${
              isSignUp
                ? "bg-[#5d40a0] text-white shadow-lg" // darker blue for active tab
                : "text-gray-600 hover:text-[#5d40a0]"
            }`}
          >
            <FaUserPlus />
            Sign Up
          </button>
        </div>

        {/* dynamic Content Area for sign up and sign in */}
        {/* adjusted height to accommodate all fields clearly */}
        <div className="relative overflow-hidden h-[420px] sm:h-[480px]">
          {" "}
          {/* adjusted for better content fit */}
          <motion.div
            className={`absolute inset-0 transition-transform duration-500 ${
              isSignUp ? "translate-x-0" : "translate-x-full"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isSignUp ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
              Create Account
            </h2>
            <form
              onSubmit={handleSignUpSubmit}
              className="space-y-4"
              noValidate
            >
              {/* full name */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700 text-sm">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border rounded-lg border-gray-300 p-3 gap-3">
                  <FaUser className="text-gray-400" />
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name" // updated placeholder
                    required
                    minLength={3}
                    pattern="^[A-Za-z\s]{3,}$"
                    title="Full name must contain only letters and spaces, at least 3 characters long."
                    className="outline-none w-full text-sm"
                  />
                </div>
                {errors.fullname && (
                  <p className="text-red-500 text-xs">{errors.fullname}</p>
                )}
              </div>

              {/* email + verify button */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700 text-sm">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border rounded-lg border-gray-300 p-3 gap-3">
                  <FaUser className="text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email" // updated placeholder
                    required
                    className="outline-none w-full text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    disabled={otpSent || otpVerified}
                  />
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      // new style for Verify button
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-purple-700 transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Verify Email"}
                    </button>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* OTP input (visible after OTP sent) */}
              {otpSent && !otpVerified && (
                <div className="flex flex-col space-y-1">
                  <label className="font-medium text-gray-700 text-sm">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border rounded-lg border-gray-300 p-3 gap-3">
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter the OTP sent to your email"
                      className="outline-none w-full text-sm"
                      onChange={(e) => setOtp(e.target.value)}
                      value={otp}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      // new style for Verify OTP button
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-blue-600 transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* password */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700 text-sm">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border rounded-lg border-gray-300 p-3 gap-3">
                  <FaLock className="text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password" // updated placeholder
                    required
                    className="outline-none w-full text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 ml-2"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {/* password notes */}
              <div className="flex-col gap-y-1 text-xs text-gray-600">
                <p className="text-red-500 font-semibold text-xs">
                  Please Note
                </p>
                <p className="text-xs">
                  * Password length should be of at least "8 characters".
                </p>
              </div>

              {/* register button only visible when OTP verified, new colors to match screenshot */}
              {otpVerified && (
                <button
                  type="submit"
                  // register button style - updated to blue/purple gradient
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold flex justify-center items-center shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin text-center w-5 h-5" />
                  ) : (
                    "Register User"
                  )}
                </button>
              )}

              {signUpError && (
                <div className="text-red-500 text-center mt-2 text-sm">
                  {signUpError}
                </div>
              )}
            </form>
          </motion.div>
          <motion.div
            className={`absolute inset-0 transition-transform duration-500 ${
              isSignUp ? "-translate-x-full" : "translate-x-0"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: !isSignUp ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Sign In
            </h2>
            <form
              onSubmit={handleSignInSubmit}
              className="space-y-4"
              noValidate
            >
              {/* email */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border rounded-lg border-gray-300 p-3 gap-3">
                  <FaUser className="text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    title="Please enter a valid email address (e.g., user@example.com)"
                    className="outline-none w-full text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border rounded-lg border-gray-300 p-3 gap-3">
                  <FaLock className="text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    title="Password must be at least 6 characters long."
                    className="outline-none w-full text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 ml-2"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              {/* submit button, new colors to match screenshot */}
              <button
                type="submit"
                // login button style - updated to blue/purple gradient
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold flex justify-center items-center shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin text-center w-5 h-5" />
                ) : (
                  "Login"
                )}
              </button>

              {/* backend/server error */}
              {signInError && (
                <div className="text-red-500 text-center mt-2 text-sm">
                  {signInError}
                </div>
              )}
            </form>
          </motion.div>
        </div>

        {/* 'already have an account' / 'Don't have an account' Text */}
        <p className="mt-8 text-center text-gray-600 text-sm">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                // 9. Link style updated to blue
                className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                // link style updated to blue
                className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}

export default AuthPage;
