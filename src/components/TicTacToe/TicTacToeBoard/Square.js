import React from "react";

const Square = ({ value, onClick }) => {
  return (
    <button
      className="w-16 h-16 flex items-center justify-center border border-gray-500"
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
