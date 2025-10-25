import React from "react";
import { FaArrowRight } from "react-icons/fa"; // Imported a new icon for the button

export default function LandingPage() {
  return (
    // ⭐️ Stylish Background: Deep, dark gradient for high contrast ⭐️
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center relative overflow-hidden">
      {/* Subtle Background Accent Blob */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto text-center px-6 py-28 relative z-10">
        {/* Subtitle/Course Info: Refined tracking and color */}
        <p className="text-sm tracking-[0.2em] font-semibold text-indigo-300/80 uppercase mb-4">
          SOFTWARE ENGINEERING (IT303) COURSE PROJECT
        </p>

        {/* Title: Larger, bolder, more vibrant gradients */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-tight tracking-tighter">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 pb-2">
            Automated Resume
          </span>{" "}
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 pt-1">
            Builder
          </span>
        </h1>

        {/* Action Button: Elevated style and icon */}
        <div className="mt-12">
          <button
            onClick={() => (window.location.href = "/home")}
            // ⭐️ Stylish Button: Primary action color, scale/shadow on hover ⭐️
            className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-indigo-600 text-white text-lg font-bold shadow-xl 
                                hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.05]"
            aria-label="Go to Home"
          >
            HOME <FaArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* List Header */}
        <h2 className="mt-16 text-lg font-semibold text-gray-400">
          Developed by
        </h2>

        {/* ⭐️ Students List: Increased visibility (text-white) ⭐️ */}
        <ul className="mt-3 space-y-1 text-white font-mono text-base bold">
          <li className="hover:text-cyan-400 transition">
            Student-1 Debajyoti Pandit (231IT020)
          </li>
          <li className="hover:text-cyan-400 transition">
            Student-2 Naveenkumar (231IT042)
          </li>
          <li className="hover:text-cyan-400 transition">
            Student-3 Laxminarayan Sahu (231IT035)
          </li>
        </ul>

        {/* ⭐️ Footer: Increased visibility (text-gray-300) ⭐️ */}
        <footer className="mt-24 text-sm text-gray-500 border-t border-gray-800 pt-6">
          NITK - Department of Information Technology
        </footer>
      </div>

      {/* Added CSS for subtle background animation */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1) translate(0px, 0px);
          }
          50% {
            transform: scale(1.1) translate(20px, -20px);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </main>
  );
}
