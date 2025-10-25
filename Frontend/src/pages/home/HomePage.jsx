import Header from "@/components/custom/Header";
import React, { useEffect } from "react";
import heroSnapshot from "@/assets/heroSnapshot.png";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaCircle, FaInfoCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { startUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";

function HomePage() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    window.open(
      "https://github.com/Naveen1763/Automated-Resume-Builder-SE/tree/main",
      "_blank"
    );
  };

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode === 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
        }
      } catch (error) {
        console.log(
          "Printing from Home Page there was a error ->",
          error.message
        );
        dispatch(addUserData(""));
      }
    };
    fetchResponse();
  }, [dispatch]);

  const handleGetStartedClick = () => {
    if (user) {
      console.log("Printing from Homepage User is There ");
      navigate("/dashboard");
    } else {
      console.log("Printing for Homepage User Not Found");
      navigate("/auth/sign-in");
    }
  };

  return (
    // ️ Main container: Dark background for the whole page ️
    <div className="bg-gray-950 text-gray-100 min-h-screen">
      <Header user={user} />

      {/* ️ Hero Section: Dark background, light text ️ */}
      <section className="pt-32 pb-24 bg-gray-950 overflow-hidden relative">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="w-full mx-auto text-center md:w-11/12 xl:w-9/12">
            {/* Main Heading: White text, refined gradient */}
            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tighter text-gray-50 md:text-7xl">
              <span>Start</span>{" "}
              <span className="block w-full py-2 text-transparent bg-clip-text leading-tight bg-gradient-to-r from-blue-400 to-indigo-500 lg:inline">
                building a Resume
              </span>{" "}
              <span>for your Dream Job</span>
            </h1>

            {/* Sub-heading/Tagline: Lighter gray for readability */}
            <p className="px-0 mb-10 text-xl text-gray-300 md:text-2xl lg:px-24">
              Build. Refine. Shine. Your path to a better job starts with
              **AI-Driven Resumes**.
            </p>

            {/* Call to Action Buttons: Dark-friendly variants */}
            <div className="mb-12 space-x-0 md:space-x-4 flex flex-col sm:flex-row justify-center items-center">
              {/* Get Started Button (Primary): Vibrant color for dark theme */}
              <a
                className="inline-flex items-center justify-center w-full px-8 py-3 mb-4 text-lg font-medium text-white bg-blue-600 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-[1.02] sm:w-auto sm:mb-0 cursor-pointer"
                onClick={handleGetStartedClick}
              >
                Get Started
                <svg
                  className="w-4 h-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>

              {/* Learn More Button (Secondary): Contrasting but subtle */}
              <a
                onClick={handleClick}
                className="inline-flex items-center justify-center w-full px-8 py-3 mb-4 text-lg font-medium text-blue-200 bg-gray-800 border border-gray-700 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:bg-gray-700 hover:border-gray-600 hover:scale-[1.02] sm:w-auto sm:mb-0 cursor-pointer"
              >
                Learn More
                <FaGithub className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>

          {/* Screenshot Container: Dark theme friendly card with subtle glow */}
          <div className="w-full mx-auto mt-16 text-center md:w-10/12">
            <div className="relative z-0 w-full p-4 bg-gray-800 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-700">
              <div className="relative overflow-hidden rounded-2xl transform transition duration-700 hover:shadow-2xl hover:-translate-y-1">
                {/* Header Bar: Elegant color and icons */}
                <div className="flex items-center justify-between px-4 bg-gradient-to-r from-blue-500 to-indigo-600 h-11">
                  <div className="flex space-x-1.5">
                    <FaCircle className="w-3 h-3 text-white/80 transition duration-300 hover:text-white" />
                    <FaCircle className="w-3 h-3 text-white/60 transition duration-300 hover:text-white" />
                    <FaCircle className="w-3 h-3 text-white/40 transition duration-300 hover:text-white" />
                  </div>
                  <FaInfoCircle className="text-white/80 hover:text-white transition duration-300 transform hover:rotate-45" />
                </div>

                {/* Screenshot Image */}
                <img
                  className="object-cover w-full h-auto transition duration-500 rounded-b-lg"
                  src={heroSnapshot}
                  alt="AI Resume Builder Dashboard Snapshot"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ️ Footer: Dark background, light text ️ */}
      <footer
        className="bg-gray-900 border-t border-gray-800"
        aria-labelledby="footer-heading"
      >
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm leading-6 text-gray-400 order-2 sm:order-1 mt-4 sm:mt-0">
            &copy; {new Date().getFullYear()} Automated-Resume-Builder.
          </p>
          <div className="order-1 sm:order-2">
            <Button
              variant="ghost"
              onClick={handleClick}
              className="text-gray-300 hover:bg-gray-700 hover:text-white transition duration-300"
            >
              <FaGithub className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
