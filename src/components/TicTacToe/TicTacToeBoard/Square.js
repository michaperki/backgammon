import React from "react";

const Square = ({ value, onClick }) => {
  return (
    <button className="border border-black h-16 w-16 text-2xl" onClick={onClick}>
      {value}
    </button>
  );
};

export default Square;
