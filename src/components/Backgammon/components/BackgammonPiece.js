import React from "react";

const BackgammonPiece = ({ color }) => {
  // Add the Backgammon piece rendering logic here
  return (
    <div className="backgammon-piece">
      {/* Backgammon piece rendering */}
      <div
        className={`w-8 h-8 rounded-full ${
          color === "white" ? "bg-white ring ring-black" : "bg-black ring ring-black"
        }`}
      ></div>
    </div>
  );
};

export default BackgammonPiece;
