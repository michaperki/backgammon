import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isLoggedIn, onLogout, isMenuOpen, handleSidebarClose }) => {
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }
  , [isMenuOpen]);

  return (
    <div
      className={`fixed inset-0 z-40 flex items-start bg-black bg-opacity-50 sm:items-center sm:justify-center ${
        isMenuOpen ? "block" : "hidden"
      }`}
    >
      <div
        className="fixed inset-0 transition-opacity"
        aria-hidden="true"
        onClick={handleSidebarClose}
      >
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>

      <div
        className="relative z-50 w-full max-w-xs bg-white shadow-xl sm:max-w-sm sm:rounded-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="px-4 py-6 bg-white sm:px-6 sm:py-8 sm:pb-4">
          <div className="flex items-start justify-between">
            <h2
              className="text-lg font-medium text-gray-900"
              id="modal-headline"
            >
              Menu
            </h2>
            <div className="ml-3 h-7 flex items-center">
              <button
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                onClick={handleSidebarClose}
              >
                <span className="sr-only">Close panel</span>
                {/* Heroicon name: outline/x */}
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#374151"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 pb-2 sm:p-0 sm:pt-0">
          <nav className="space-y-1">
            <Link
              to="/"
              className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900"
              onClick={handleSidebarClose}
            >
              Home
            </Link>

            {isLoggedIn ? (
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                onClick={handleSidebarClose}
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                onClick={handleSidebarClose}
              >
                Login
              </Link>
            )}

            {isLoggedIn ? (
              <button
                className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                onClick={onLogout}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signup"
                className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                onClick={handleSidebarClose}
              >
                Signup
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
