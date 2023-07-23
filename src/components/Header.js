import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const Header = ({ isLoggedIn, onLogout, walletAddress, onConnectWallet }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-4 px-6 bg-gray-900 text-white">
      <div className="flex justify-between items-center">
        <Link to="/backgammon" className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">Backgammon</h1>
        </Link>
        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            className="text-white hover:text-gray-200 transition-colors"
            onClick={handleMenuToggle}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              )}
            </svg>
          </button>
        </div>
        {/* Desktop Menu */}
        <nav
          className={`hidden md:flex space-x-4 ${
            isMenuOpen ? "flex justify-end" : "hidden"
          }`}
        >
          {isLoggedIn ? (
            <>
              {walletAddress ? (
                <p>...{walletAddress.slice(-3)}</p>
              ) : (
                <button onClick={onConnectWallet}>Connect Wallet</button>
              )}
              <button
                className="bg-transparent hover:bg-white text-white hover:text-gray-900 border border-white hover:border-transparent rounded-md px-4 py-2 transition-colors"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/backgammon/login"
                className="text-white hover:text-gray-200 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/backgammon/signup"
                className="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
      {/* Sidebar for Mobile */}
      <div className={`sidebar md:hidden`}>
        <Sidebar
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          isMenuOpen={isMenuOpen}
          handleSidebarClose={() => setIsMenuOpen(false)} // Pass the function to close the sidebar
        />
      </div>
    </header>
  );
};

export default Header;
