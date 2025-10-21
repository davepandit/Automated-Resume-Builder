import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { loginUser, registerUser } from "@/Services/login";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // --- LOGIC REMAINS UNCHANGED ---

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    setSignInError("");

    const { email, password } = event.target.elements;
    const newErrors = { email: "", password: "" };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(email.value)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.value.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.value.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);

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

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    setSignUpError("");
    const { fullname, email, password } = event.target.elements;
    const newErrors = { fullname: "", email: "", password: "" };

    if (!fullname.value.trim()) {
      newErrors.fullname = "Full name is required.";
    } else if (fullname.value.trim().length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(email.value)) {
      newErrors.email = "Please enter a valid email address.";
    }

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

    setLoading(true);
    console.log("User Registration Started");
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

  // Helper function for styling inputs based on validation state
  const getFieldClasses = (fieldName, isPassword = false) => {
    const error = isPassword ? errors.password : errors[fieldName];
    return `flex items-center border rounded-xl p-3 gap-3 shadow-sm transition-all duration-300 ${
      error
        ? "border-red-500 bg-red-50"
        : "border-gray-300 focus-within:border-blue-600 focus-within:shadow-md"
    }`;
  };

  // --- DARK BLUE BACKGROUND & WHITE COMPONENT START ---

  return (
    // Background: Dark Blue/Indigo Gradient
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-gray-900 via-indigo-900 to-slate-900">
      <motion.div
        // Form Component: Bright White Background
        className="relative w-full max-w-md px-10 py-10 bg-white rounded-3xl shadow-2xl z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Welcome to Automated Resume Builder
        </h1>

        {/* Tab Buttons with Animated Indicator */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <button
            onClick={() => setIsSignUp(false)}
            className={`relative flex items-center justify-center flex-1 gap-2 px-4 py-3 text-lg font-bold transition-all duration-300 ${
              !isSignUp ? "text-blue-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaSignInAlt className="text-xl" />
            Sign In
            {!isSignUp && (
              <motion.span
                layoutId="tabIndicator"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-lg"
                transition={{ duration: 0.3 }}
              ></motion.span>
            )}
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`relative flex items-center justify-center flex-1 gap-2 px-4 py-3 text-lg font-bold transition-all duration-300 ${
              isSignUp ? "text-blue-700" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaUserPlus className="text-xl" />
            Sign Up
            {isSignUp && (
              <motion.span
                layoutId="tabIndicator"
                className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-lg"
                transition={{ duration: 0.3 }}
              ></motion.span>
            )}
          </button>
        </div>

        {/* Form Container with Animation */}
        <div className="relative overflow-hidden w-full">
          {/* -------------------- SIGN UP FORM -------------------- */}
          <motion.div
            className={`relative transition-transform duration-500 ${
              isSignUp
                ? "translate-x-0"
                : "translate-x-full opacity-0 pointer-events-none absolute inset-x-0"
            }`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isSignUp ? 1 : 0,
              position: isSignUp ? "relative" : "absolute",
            }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
              Create Account
            </h2>
            <form
              onSubmit={handleSignUpSubmit}
              className="space-y-4"
              noValidate
            >
              {/* Full Name */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700 text-sm">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className={getFieldClasses("fullname")}>
                  <FaUser className="text-gray-400" />
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name"
                    required
                    className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-400 text-base"
                    onChange={() => setErrors({ ...errors, fullname: "" })}
                  />
                </div>
                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700 text-sm">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className={getFieldClasses("email")}>
                  <FaEnvelope className="text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-400 text-base"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: "" });
                    }}
                    value={email}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700 text-sm">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className={getFieldClasses("password", true)}>
                  <FaLock className="text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    required
                    className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-400 text-base"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: "" });
                    }}
                    value={password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Password Requirements Note */}
              <div className="flex-col gap-y-1 text-xs text-gray-500 pt-1">
                <p className="text-red-500 font-semibold mb-1">Please Note:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>
                    Password length should be of at least **8 characters**.
                  </li>
                  
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                // Blue/Indigo Gradient for primary CTA
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl flex justify-center items-center font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  "Register User"
                )}
              </motion.button>

              {/* Backend/Server Error */}
              {signUpError && (
                <div className="text-red-500 text-center mt-2">
                  {signUpError}
                </div>
              )}
            </form>
          </motion.div>

          {/* -------------------- SIGN IN FORM -------------------- */}
          <motion.div
            className={`transition-transform duration-500 ${
              isSignUp
                ? "-translate-x-full opacity-0 pointer-events-none absolute inset-x-0"
                : "translate-x-0 relative"
            }`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: !isSignUp ? 1 : 0,
              position: !isSignUp ? "relative" : "absolute",
            }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
              Sign In
            </h2>
            <form
              onSubmit={handleSignInSubmit}
              className="space-y-6"
              noValidate
            >
              {/* Email */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700 text-sm">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className={getFieldClasses("email")}>
                  <FaEnvelope className="text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-400 text-base"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: "" });
                    }}
                    value={email}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-700 text-sm">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className={getFieldClasses("password", true)}>
                  <FaLock className="text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    required
                    className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-400 text-base"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: "" });
                    }}
                    value={password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                // Blue/Indigo Gradient for primary CTA
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl flex justify-center items-center font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-8"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  "Sign In"
                )}
              </motion.button>

              {/* Backend/Server Error */}
              {signInError && (
                <div className="text-red-500 text-center mt-2">
                  {signInError}
                </div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Toggle between Sign In/Sign Up message */}
        <p className="mt-8 text-center text-gray-500 text-sm">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-blue-600 font-semibold hover:underline transition-colors"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 font-semibold hover:underline transition-colors"
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
