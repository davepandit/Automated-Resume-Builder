import React, { useEffect } from "react";
import logo from "/logo.svg";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";

function Header({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Note: Added `user` to dependency array for correctness
    if (user) {
      console.log("Printing From Header User Found");
    } else {
      console.log("Printing From Header User Not Found");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode === 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      id="printHeader"
      // STYLISH DARK THEME: Sticky, dark background, subtle border/shadow
      className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-xl transition-colors duration-300"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-10 lg:px-14 py-4">
        {/* Logo/Brand Name (links to HOME) */}
        <Link
          to="/home"
          className="flex items-center space-x-3 transition duration-300 hover:opacity-85"
        >
          {/* Logo element is now resized and centered */}
          <img
            src={logo}
            alt="logo"
            width={62}
            height={62}
            className="w-12 h-12 filter invert"
          />
          <span className="text-xl font-extrabold text-gray-50 tracking-tight hidden sm:block">
            Automated Resume Builder
          </span>
        </Link>

        {/* Navigation and Action Buttons */}
        {user ? (
          // Logged-In State
          <div className="flex items-center gap-4">
            {/* Dashboard Button: Light outline against dark background */}
            <Button
              variant="outline"
              className="text-blue-400 border-blue-400 bg-transparent hover:bg-gray-800 hover:text-blue-300 transition-colors duration-200"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </Button>
            {/* Logout Button: High contrast, distinct color */}
            <Button
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors duration-200"
            >
              Logout
            </Button>
          </div>
        ) : (
          // Logged-Out State
          <Link to="/auth/sign-in">
            {/* Get Started Button: Primary action, vibrant color */}
            <Button className="bg-blue-500 text-gray-900 hover:bg-blue-600 shadow-lg transition duration-200 transform hover:scale-[1.02]">
              Get Started
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
